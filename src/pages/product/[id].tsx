import React, { ReactNode } from "react";
import Head from "next/head";
import DetailContainer from "../../components/Detail/DetailContainer";
import Layout from "@/components/Layout/Layout";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/fetchProducts";
import { fetchProduct } from "@/services/fetchProductById";
import { useRouter } from "next/router";
import { Product } from "@/types/types";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data: product } = useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id as string) as Promise<Product>,
    enabled: !!id
  });
  return (
    <>
      <Head>
        <title>{product?.name ?? 'Product Detail'}</title>
        <meta name="description" content={product?.description ?? 'Product description'} />
        <meta property="og:title" content={product?.name ?? 'Product Detail'} />
        <meta property="og:description" content={product?.description ?? 'Product description'} />
      </Head>
      <DetailContainer />
    </>
  );
}

ProductDetail.getLayout = function (page: ReactNode) {
  return <Layout>{page}</Layout>
}

export async function getStaticPaths() {
  // Fetch all product IDs
  const products = await fetchProducts();

  // Generate paths for all products
  const paths = products.map((product: any) => ({
    params: { id: product.id.toString() },
  }));

  return {
    paths,
    // Enable fallback for new products added after build
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
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
      // Regenerate page every 1 hour
      revalidate: 3600,
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
}
