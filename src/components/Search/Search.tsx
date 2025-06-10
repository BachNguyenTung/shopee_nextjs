import React from "react";
import ProductContainer from "@/components/Product/ProductContainer";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const { data } = useProductsQuery()
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const searchItems = data.filter((item: any) =>
    item.name.toLowerCase().includes(query?.trim().toLowerCase())
  );
  return (
    <ProductContainer items={searchItems}></ProductContainer>
  );
}
