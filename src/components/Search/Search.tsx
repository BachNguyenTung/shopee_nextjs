import React, { useEffect } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { changeSearchInput } from "@/redux/searchSlice";
import ProductContainer from "@/components/Product/ProductContainer";

export default function Search() {
  const searchItems = useSelector((state: RootStateOrAny) => state.search.searchItems);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(changeSearchInput(""));
    };
  }, [dispatch]);
  return (
    <ProductContainer items={searchItems}></ProductContainer>
  );
}
