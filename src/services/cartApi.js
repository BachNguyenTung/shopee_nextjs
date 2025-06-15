import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {cartDocRef} from "@/db/dbRef";
import {getDoc, setDoc} from "firebase/firestore";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    fetchCart: builder.query({
      async queryFn(uid) {
        if (!uid) return { data: [] }
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
      },
    }),
    addCartToFireStore: builder.mutation({
      async queryFn({ user, cartProducts }) {
        if (!user?.uid) return { error: new Error('No user ID provided') };
        try {
          let savedCartItems = [];
          const created = Date.now();
          if (cartProducts?.length > 0) {
            savedCartItems = cartProducts.map((item) => {
              const { similarDisPlay, variationDisPlay, ...rest } = item;
              return rest;
            });
          }
          const docRef = cartDocRef(user?.uid);
          await setDoc(docRef, {
            basket: savedCartItems,
            created: created,
          });
          return { data: "ok" };
        } catch (error) {
          return { error: error };
        }
      },
      // Optimistic update
      onQueryStarted({ user, cartProducts }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('fetchCart', user?.uid, draft => {
            return cartProducts;
          })
        )
        queryFulfilled.catch(() => {
          patchResult.undo();
        })
      },
      invalidatesTags: (result, error) => {
        return error ? [] : ['Cart'];
      }
    }),
  }),
});
export const { useFetchCartQuery, useAddCartToFireStoreMutation } = cartApi;
