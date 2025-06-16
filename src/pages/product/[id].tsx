import React, { ReactNode, Suspense } from "react";
import Head from "next/head";
import DetailContainer from "../../components/Detail/DetailContainer";
import Layout from "@/components/Layout/Layout";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchProducts } from "@/services/fetchProducts";
import { fetchProduct } from "@/services/fetchProductById";
import { useRouter } from "next/router";
import { useWaitProductQuery } from "@/hooks/useWaitProductQuery";
import { ClipLoading } from "@/components/ClipLoading";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data: product } = useWaitProductQuery(id?.toString())
  return (
    <>
      <Head>
        <title>{product?.name ?? 'Product Detail'}</title>
        <meta name="description" content={product?.description ?? 'Product description'} />
        <meta property="og:title" content={product?.name ?? 'Product Detail'} />
        <meta property="og:description" content={product?.description ?? 'Product description'} />
      </Head>
      <Suspense fallback={<ClipLoading />}>
        <DetailContainer />
      </Suspense>
    </>
  );
}

ProductDetail.getLayout = function (page: ReactNode) {
  return <Layout>{page}</Layout>
}

// export async function getStaticPaths() {
//   // Fetch all product IDs
//   const products = await fetchProducts();
//
//   // Generate paths for all products
//   const paths = products.map((product: any) => ({
//     params: { id: product.id.toString() },
//   }));
//
//   return {
//     paths,
//     // Enable fallback for new products added after build
//     fallback: 'blocking'
//   };
// }

export async function getServerSideProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
      }),
      queryClient.prefetchQuery({
        queryKey: ['product', params.id],
        queryFn: () => fetchProduct(params.id),
      })
    ]);

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
}
