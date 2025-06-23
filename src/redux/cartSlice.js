import {createSlice} from "@reduxjs/toolkit";
import {cartApi} from "@/services/cartApi";
import {CART_PRODUCT_SESSION, CART_SESSION_ID_LOCAL} from "@/configs/cart";

export const saveCartItemsToSession = (cartProduct) => {
  const savedCartItems = cartProduct?.map((item) => ({
    ...item,
    similarDisPlay: undefined,
    variationDisPlay: undefined,
  })) ?? [];
  sessionStorage.setItem(CART_PRODUCT_SESSION, JSON.stringify(savedCartItems));
}

export const getCartItemsFromSession = () => {
  if (typeof window === 'undefined') return null
  let savedCartItems = sessionStorage.getItem(CART_PRODUCT_SESSION);
  return savedCartItems ? JSON.parse(savedCartItems) : [];
};

const products = getCartItemsFromSession()
  ? getCartItemsFromSession().map((item) => ({
    ...item,
    similarDisPlay: false,
    variationDisPlay: false,
  }))
  : [];

const initialState = {
  products,
};



const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProducts: (state, action) => {
      state.products.push(action.payload);
      // Only save to session storage for guest users
      // For logged-in users, RTK Query will handle the persistence
      saveCartItemsToSession(state.products);
    },
    addProductsAndSync: (state, action) => {
      // This action is for logged-in users - it will be handled by middleware
      // to trigger Firestore sync
      state.products.push(action.payload);
    },
    updateProducts: (state, action) => {
      state.products = action.payload;
      // Only save to session storage for guest users
      // For logged-in users, RTK Query will handle the persistence
    },
    resetCart: (state) => {
      state.products = [];
      sessionStorage.removeItem(CART_PRODUCT_SESSION);
      localStorage.removeItem(CART_SESSION_ID_LOCAL);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      cartApi.endpoints.fetchCart.matchFulfilled,
      (state, action) => {
        // Always update the cart state with RTK Query data
        state.products = action.payload;
      }
    );
    builder.addMatcher(
      cartApi.endpoints.addCartToFireStore.matchFulfilled,
      (state, action) => {
        // The cache has already been updated by the optimistic update
        // This ensures the Redux store reflects the latest state
      }
    );
    builder.addMatcher(
      cartApi.endpoints.mergeAndClearGuestCart.matchFulfilled,
      (state, action) => {
        // After merging guest cart, the fetchCart query will be invalidated
        // and will update the state with the merged cart
      }
    );
  },
});

export const {
  addProducts,
  updateProducts,
  deleteProducts,
  resetCart,
  addProductsAndSync
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
