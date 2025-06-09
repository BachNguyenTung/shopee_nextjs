import React, { ReactElement, Suspense } from "react";
import Product from '@/components/Product'

import Layout from "@/components/Layout/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchProducts } from "@/services/fetchProducts";
import { ClipLoading } from "@/components/ClipLoading";


const Home: NextPageWithLayout = () => {
  return (
    /** Your content */
    <Suspense fallback={<ClipLoading />}>
      <Product />
    </Suspense>
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
export async function getStaticProps() {
  // Fetch data from external API

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  // Pass data to the page via props
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
