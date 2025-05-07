import React, { ReactElement, Suspense } from "react";
import Product from '@/components/Product'

import Layout from "@/components/Layout/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebase";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchProduct } from "@/services/fetchProduct";
import { ClipLoading } from "@/components/ClipLoading";

const Home = (props) => {
  const { dehydratedState } = props;
  return (
    /** Your content */
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<ClipLoading />}>
        <Product />
      </Suspense>
    </HydrationBoundary>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout isProductPage={true}>
      {page}
    </Layout>
  )
}
export default Home

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: fetchProduct,
  })

  // Pass data to the page via props
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
