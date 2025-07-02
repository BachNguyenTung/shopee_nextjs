import React, { useEffect } from "react";
import ProductContainer from "@/components/Product/ProductContainer";
import { useWaitProductsQuery } from "@/hooks/useWaitProductsQuery";
import { useRouter } from "next/router";
import { resetCart } from "@/redux/cartSlice";
import { auth } from "@/configs/firebase";
import { useDispatch } from "react-redux";

export default function Product() {
  const { data, isPending } = useWaitProductsQuery()
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAlert = async () => {
      if (router.query.forceLogout) {
        dispatch(resetCart());
        await auth.signOut()
        alert("Phiên đăng nhập đã hết hạn!")
      }
    }
    handleAlert()
  }, [router.query.forceLogout]);
  return (
    <ProductContainer items={data}></ProductContainer>
  );
}
