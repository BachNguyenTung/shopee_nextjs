import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {cartDocRef} from "@/db/dbRef";
import {getDoc, setDoc, updateDoc} from "firebase/firestore";
import {CART_PRODUCT_SESSION, CART_SESSION_ID_LOCAL} from "@/configs/cart";
import {getCartItemsFromSession} from "@/redux/cartSlice";
import unionWith from "lodash/unionWith";

export const setCartSessionIdLocal = (sessionId) => localStorage.setItem(CART_SESSION_ID_LOCAL, sessionId);
export const getCartSessionIdLocal = () => localStorage.getItem(CART_SESSION_ID_LOCAL) || null;

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    fetchCart: builder.query({
      async queryFn({ uid, loading }) {
        // Guest user logic
        if (!uid && !loading) {
          let sessionId = getCartSessionIdLocal();
          if (!sessionId) {
            sessionId = `session::${Date.now()}`;
            setCartSessionIdLocal(sessionId);
            return { data: [] };
          }
          const products = getCartItemsFromSession();
          return { data: products };
        }

        // Logged-in user logic
        if (uid) {
          try {
            const docRef = cartDocRef(uid);
            const snapshot = await getDoc(docRef);
            let products = [];
            if (snapshot.exists()) {
              products = snapshot.data().basket.map((item) => ({
                ...item,
                similarDisPlay: false,
                variationDisPlay: false,
              }));
            }
            return { data: products };
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

          if (operation === 'add') {
            // For adding items - merge with existing cart
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
              } else {
                // Add new item
                await updateDoc(docRef, {
                  basket: [...existingBasket, cleanItem],
                  updated: Date.now()
                });
              }
            } else {
              await setDoc(docRef, { basket: [cleanItem], created: Date.now() });
            }
          } else {
            // For replace operations (checkout, clear, etc.)
            let savedCartItems = cartProducts.map(item => {
              const { similarDisPlay, variationDisPlay, ...rest } = item;
              return rest;
            });

            if (snapshot.exists()) {
              await updateDoc(docRef, { basket: savedCartItems, updated: Date.now() });
            } else {
              await setDoc(docRef, { basket: savedCartItems, created: Date.now() });
            }
          }

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
          const docRef = cartDocRef(uid);
          const snapshot = await getDoc(docRef);
          const userCart = snapshot.exists() ? snapshot.data().basket || [] : [];

          // Use lodash unionWith to merge arrays by id and variation, summing amount
          const mergedCart = unionWith(
            [...userCart, ...guestCart],
            (a, b) => {
              if (a.id === b.id && (a.variation || '') === (b.variation || '')) {
                // If both have the same id and variation, sum the amount
                a.amount = (a.amount || 0) + (b.amount || 0);
                return true;
              }
              return false;
            }
          );

          // Atomically update Firestore with the merged cart
          await setDoc(docRef, { basket: mergedCart }, { merge: true });

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
