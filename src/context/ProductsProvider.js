import React, { useContext, useState } from "react";
import useGetItemsFromFirebase from "../hooks/useGetItemsFromFirebase";

const ProductsContext = React.createContext();
export function useProductsContext() {
  return useContext(ProductsContext);
}
const ProductsProvider = ({ children }) => {
  useGetItemsFromFirebase();
  const bestSelling = 1000;
  const value = {
    bestSelling,
  };
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;
