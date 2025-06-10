import React, { ReactElement, Suspense } from "react";
import Layout from "@/components/Layout/Layout";
import { dehydrate, DehydratedState, QueryClient } from "@tanstack/react-query";
import { fetchProducts } from "@/services/fetchProducts";
import { NextPageWithLayout } from "@/pages/_app";
import { ClipLoading } from "@/components/ClipLoading";
import Search from "@/components/Search/Search";

const Page: NextPageWithLayout<{ dehydratedState: DehydratedState }> = ({ dehydratedState }) => {
  return (
    <Suspense fallback={<ClipLoading />}>
      <Search />
    </Suspense>
  )
};
Page.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}
export default Page;

export async function getServerSideProps() {
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
