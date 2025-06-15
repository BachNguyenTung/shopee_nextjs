import {createSlice} from "@reduxjs/toolkit";
import {cartApi} from "@/services/cartApi";

const CART_STORAGE_KEY = "cartProduct";
const saveCartItemsToStorage = (cartProduct) => {
  const savedCartItems = cartProduct.map((item) => ({
    ...item,
    similarDisPlay: undefined,
    variationDisPlay: undefined,
  }));
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(savedCartItems));
};

const getCartItemsFromStorage = () => {
  if (typeof window === 'undefined') return []
  let savedCartItems = localStorage.getItem(CART_STORAGE_KEY);
  return savedCartItems ? JSON.parse(savedCartItems) : [];
};

const products = getCartItemsFromStorage()
  ? getCartItemsFromStorage().map((item) => ({
      ...item,
      similarDisPlay: false,
      variationDisPlay: false,
    }))
  : [];

const initialState = {
  products,
};

// Create a store instance variable to use in the storage event listener
let storeInstance = null;

// Setup cross-tab synchronization if we're in the browser
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    // Only respond to changes in our cart storage key
    if (event.key === CART_STORAGE_KEY && storeInstance) {
      const newCartItems = JSON.parse(event.newValue || '[]');
      // Format cart items with display properties
      const formattedCartItems = newCartItems.map(item => ({
        ...item,
        similarDisPlay: false,
        variationDisPlay: false,
      }));
      // Update the Redux store with the new cart from another tab
      storeInstance.dispatch(updateFromOtherTab(formattedCartItems));
    }
  });
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProducts: (state, action) => {
      state.products.push(action.payload);
      saveCartItemsToStorage(state.products);
    },
    updateProducts: (state, action) => {
      state.products = action.payload;
      saveCartItemsToStorage(state.products);
    },
    resetCart: (state) => {
      state.products = [];
      localStorage.removeItem(CART_STORAGE_KEY);
    },
    // New reducer to update cart from another tab
    updateFromOtherTab: (state, action) => {
      state.products = action.payload;
      // Don't save to localStorage here to avoid infinite loop
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      cartApi.endpoints.fetchCart.matchFulfilled,
      (state, action) => {
        if (state.products.length === 0) {
          state.products = action.payload;
        }
      }
    );
  },
});

export const {
  addProducts,
  updateProducts,
  deleteProducts,
  resetCart,
  updateFromOtherTab,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

// This function should be called when the store is created
export const setStoreInstance = (store) => {
  storeInstance = store;
};
