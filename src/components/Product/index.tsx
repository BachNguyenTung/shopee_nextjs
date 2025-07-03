import React from "react";
import ProductContainer from "@/components/Product/ProductContainer";
import { useWaitProductsQuery } from "@/hooks/useWaitProductsQuery";

export default function Product() {
  const { data, isPending } = useWaitProductsQuery()

  return (
    <ProductContainer items={data}></ProductContainer>
  );
}
