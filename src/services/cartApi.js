import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {cartDocRef, sessionDocRef} from "@/db/dbRef";
import {getDoc, setDoc, updateDoc} from "firebase/firestore";
import {CART_PRODUCT_SESSION, CART_SESSION_ID_LOCAL} from "@/configs/cart";
import {getCartItemsFromSession} from "@/redux/cartSlice";

export const setCartSessionIdLocal = (sessionId) => localStorage.setItem(CART_SESSION_ID_LOCAL, sessionId);
export const getCartSessionIdLocal = () => localStorage.getItem(CART_SESSION_ID_LOCAL) || null;
const createSessionId = () => `session::${Date.now()}::${Math.random().toString(36).slice(2, 10)}`;

// Remove UI-only fields before persisting to Firestore.
const normalizeCartItemsForStore = (items = []) => items.map((item) => {
  const { similarDisPlay, variationDisPlay, ...rest } = item;
  return rest;
});

// Re-add UI flags after loading from Firestore/session sources.
const normalizeCartItemsForUi = (items = []) => items.map((item) => ({
  ...item,
  similarDisPlay: false,
  variationDisPlay: false,
}));

// Merge carts by product+variation and accumulate quantity.
const mergeCartsByProductVariation = (baseCart = [], incomingCart = []) => {
  const mergedMap = new Map();
  [...baseCart, ...incomingCart].forEach((item) => {
    const key = `${item.id}::${item.variation || ''}`;
    const existing = mergedMap.get(key);
    if (existing) {
      existing.amount = (existing.amount || 0) + (item.amount || 0);
      return;
    }
    mergedMap.set(key, { ...item });
  });
  return [...mergedMap.values()];
};

// Ensure this browser/device always has a local cart session id.
const ensureSessionId = () => {
  let sessionId = getCartSessionIdLocal();
  if (!sessionId) {
    sessionId = createSessionId();
    setCartSessionIdLocal(sessionId);
  }
  return sessionId;
};

// Keep a session snapshot for this user (sessionId + latest cart state).
const upsertSessionDoc = async ({ uid, sessionId, cartItems }) => {
  await setDoc(
    sessionDocRef(uid),
    {
      uid,
      sessionId,
      cart: normalizeCartItemsForStore(cartItems),
      updated: Date.now(),
    },
    { merge: true }
  );
};

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    fetchCart: builder.query({
      async queryFn({ uid, loading }) {
        // Guest flow: only work with local/session storage.
        if (!uid && !loading) {
          ensureSessionId();
          const products = getCartItemsFromSession();
          return { data: products };
        }

        // Logged-in flow:
        // 1) load user cart from Firestore
        // 2) merge guest cart once (if it exists)
        // 3) persist merged cart to user cart + session snapshot
        if (uid) {
          try {
            const sessionId = ensureSessionId();
            const docRef = cartDocRef(uid);
            const snapshot = await getDoc(docRef);
            const userProducts = snapshot.exists() ? snapshot.data().basket || [] : [];

            const guestProducts = getCartItemsFromSession() || [];
            const hasGuestCart = guestProducts.length > 0;
            const mergedProducts = hasGuestCart
              ? mergeCartsByProductVariation(userProducts, guestProducts)
              : userProducts;

            // Merge-on-login behavior: guest cart is consumed and then cleared.
            if (hasGuestCart) {
              await setDoc(
                docRef,
                {
                  basket: normalizeCartItemsForStore(mergedProducts),
                  updated: Date.now(),
                },
                { merge: true }
              );
              sessionStorage.removeItem(CART_PRODUCT_SESSION);
            }

            await upsertSessionDoc({
              uid,
              sessionId,
              cartItems: mergedProducts,
            });

            return { data: normalizeCartItemsForUi(mergedProducts) };
          } catch (error) {
            return { error: error };
          }
        }

        return { data: [] };
      },
      providesTags: ['Cart'],
    }),
    addCartToFireStore: builder.mutation({
      async queryFn({ user, cartProducts, operation = 'replace' }) {
        if (!user?.uid) return { error: new Error('No user ID provided') };

        try {
          const docRef = cartDocRef(user?.uid);
          const snapshot = await getDoc(docRef);
          const sessionId = ensureSessionId();
          let latestBasket = [];

          if (operation === 'add') {
            // Add mode: insert one item or increase amount if same variant exists.
            const itemToAdd = cartProducts[0];
            const { similarDisPlay, variationDisPlay, ...cleanItem } = itemToAdd;

            if (snapshot.exists()) {
              const existingBasket = snapshot.data().basket || [];
              const existingIndex = existingBasket.findIndex(
                item => item.id === cleanItem.id && item.variation === cleanItem.variation
              );

              if (existingIndex >= 0) {
                // Update existing item amount
                existingBasket[existingIndex].amount += cleanItem.amount;
                await updateDoc(docRef, { basket: existingBasket, updated: Date.now() });
                latestBasket = existingBasket;
              } else {
                // Add new item
                await updateDoc(docRef, {
                  basket: [...existingBasket, cleanItem],
                  updated: Date.now()
                });
                latestBasket = [...existingBasket, cleanItem];
              }
            } else {
              await setDoc(docRef, { basket: [cleanItem], created: Date.now() });
              latestBasket = [cleanItem];
            }
          } else {
            // Replace mode: overwrite basket with provided cartProducts.
            const savedCartItems = normalizeCartItemsForStore(cartProducts);
            latestBasket = savedCartItems;

            if (snapshot.exists()) {
              await updateDoc(docRef, { basket: savedCartItems, updated: Date.now() });
            } else {
              await setDoc(docRef, { basket: savedCartItems, created: Date.now() });
            }
          }

          await upsertSessionDoc({
            uid: user.uid,
            sessionId,
            cartItems: latestBasket,
          });

          return { data: "ok" };
        } catch (error) {
          return { error: error };
        }
      },
      // Optimistic update - update the cache immediately
      async onQueryStarted({ user, cartProducts, operation }, { dispatch, queryFulfilled }) {
        // Optimistically update the cache
        const patchResult = dispatch(
          cartApi.util.updateQueryData('fetchCart', { uid: user?.uid, loading: false }, draft => {
            return cartProducts;
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          // If the mutation fails, undo the optimistic update
          patchResult.undo();
        }
      },
      // Invalidate the cache to trigger a refetch
      invalidatesTags: ['Cart'],
    }),
    mergeAndClearGuestCart: builder.mutation({
      async queryFn(uid) {
        if (!uid) return { error: new Error('No user ID provided for merge') };

        const guestCart = getCartItemsFromSession();
        if (!guestCart || guestCart.length === 0) return { data: "No guest cart to merge." };
        try {
          const sessionId = ensureSessionId();
          const docRef = cartDocRef(uid);
          const snapshot = await getDoc(docRef);
          const userCart = snapshot.exists() ? snapshot.data().basket || [] : [];

          // Legacy/manual merge endpoint (current login path already merges in fetchCart).
          const mergedCart = mergeCartsByProductVariation(userCart, guestCart);

          // Atomically update Firestore with the merged cart
          await setDoc(
            docRef,
            { basket: normalizeCartItemsForStore(mergedCart), updated: Date.now() },
            { merge: true }
          );
          await upsertSessionDoc({
            uid,
            sessionId,
            cartItems: mergedCart,
          });

          // Clear the guest cart data after a successful merge
          sessionStorage.removeItem(CART_PRODUCT_SESSION);
          localStorage.removeItem(CART_SESSION_ID_LOCAL);

          return { data: "ok" };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ['Cart'],
    }),
  }),
});
export const { useFetchCartQuery, useAddCartToFireStoreMutation, useMergeAndClearGuestCartMutation } = cartApi;
