import React from "react";
import ProductContainer from "@/components/Product/ProductContainer";
import { useWaitProductsQuery } from "@/hooks/useWaitProductsQuery";

export default function ProductContent() {
  const { data } = useWaitProductsQuery();

  return <ProductContainer items={data} />;
}
