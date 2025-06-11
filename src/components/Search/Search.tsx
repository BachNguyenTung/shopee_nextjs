import React from "react";
import ProductContainer from "@/components/Product/ProductContainer";
import { useWaitProductsQuery } from "@/hooks/useWaitProductsQuery";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const { data } = useWaitProductsQuery()
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const searchItems = data.filter((item: any) =>
    item.name.toLowerCase().includes(query?.trim().toLowerCase())
  );
  return (
    <ProductContainer items={searchItems}></ProductContainer>
  );
}
