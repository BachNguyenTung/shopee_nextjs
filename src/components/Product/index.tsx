import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { ClipLoading } from "@/components/ClipLoading";

// Create client-only ProductContent component
const ProductContent = dynamic(
  () => import("./ProductContent"),
  { ssr: false, loading: () => <ClipLoading /> }
);

export default function Product() {
  return (
    <Suspense fallback={<ClipLoading />}>
      <ProductContent />
    </Suspense>
  );
}
