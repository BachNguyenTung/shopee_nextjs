import React from "react";
import ProductContainer from "@/components/Product/ProductContainer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/services/fetchProduct";

export default function Product() {
  const {data} = useSuspenseQuery({
    queryKey: ['products'],
    queryFn: fetchProduct,
    staleTime: Infinity,
  })
  return (
      <ProductContainer items={data}></ProductContainer>
  );
}
