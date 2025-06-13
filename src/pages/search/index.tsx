import React, { ReactElement, Suspense } from "react";
import Layout from "@/components/Layout/Layout";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchProducts } from "@/services/fetchProducts";
import { NextPageWithLayout } from "@/pages/_app";
import Search from "@/components/Search/Search";
import { ClipLoading } from "@/components/ClipLoading";

const Page: NextPageWithLayout = () => {
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

export async function getServerSideProps(context: any) {
  // Fetch data from external API
  if (!context.query.query) {
    return {
      notFound: true,
    }
  }
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ['products'],
      queryFn: fetchProducts,
    })
  } catch (error) {
    console.error('Error prefetching products:', error);
    return 'Error prefetching products:' + error
  }

  // Pass data to the page via props
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
