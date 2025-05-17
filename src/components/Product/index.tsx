import React from "react";
import ProductContainer from "@/components/Product/ProductContainer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/fetchProducts";

export default function Product() {
  const {data} = useSuspenseQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: Infinity,
  })
  return (
      <ProductContainer items={data}></ProductContainer>
  );
}
