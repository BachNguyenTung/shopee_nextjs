import React, { ReactNode } from "react";
import DetailContainer from "../../components/Detail/DetailContainer";
import Layout from "@/components/Layout/Layout";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchProducts } from "@/services/fetchProducts";
import { fetchProduct } from "@/services/fetchProductById";

//TODO: generateMetadata for dynamic routes in nextjs app router

//TODO: generate static params for product

export default function ProductDetail() {
  return (
        <DetailContainer />
  );
}

ProductDetail.getLayout = function (page: ReactNode) {
  return <Layout>{page}</Layout>
}

export async function getServerSideProps(context: { params: { id: string } }) {
  // Fetch data from external API
  const { id } = context.params;
  const queryClient = new QueryClient();

  await Promise.all([
      await queryClient.prefetchQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
      }),
      await queryClient.prefetchQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id),
      })
    ]
  )

  // Pass data to the page via props
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
