import React, { ReactNode } from "react";
import Head from "next/head";
import DetailContainer from "../../components/Detail/DetailContainer";
import Layout from "@/components/Layout/Layout";
import { dehydrate, DehydratedState, QueryClient } from "@tanstack/react-query";
import { fetchProducts } from "@/services/fetchProducts";
import { fetchProduct } from "@/services/fetchProductById";
import Link from "next/link";
import { Product } from "@/types/types";
import { GetStaticPropsResult, InferGetStaticPropsType } from "next";

export default function ProductDetail(
  { product }: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <>
      <Head>
        <title>{product?.name ?? 'Product Detail'}</title>
        <meta name="description" content={product?.description ?? 'Product description'} />
        <meta property="og:title" content={product?.name ?? 'Product Detail'} />
        <meta property="og:description" content={product?.description ?? 'Product description'} />
      </Head>
      <div className="container bg-lighter-grey" data-product-id={product?.id}>
        <div className="detail-breadcrumb">
          <Link href="/" className="detail-breadcrumb__home">
            Shopee
          </Link>
          <svg
            enableBackground="new 0 0 11 11"
            viewBox="0 0 11 11"
            x="0"
            y="0"
            className="detail-breadcrumb__icon"
          >
            <path
              d="m2.5 11c .1 0 .2 0 .3-.1l6-5c .1-.1.2-.3.2-.4s-.1-.3-.2-.4l-6-5c-.2-.2-.5-.1-.7.1s-.1.5.1.7l5.5 4.6-5.5 4.6c-.2.2-.2.5-.1.7.1.1.3.2.4.2z"></path>
          </svg>
          <span className="detail-breadcrumb__current">{product?.name}</span>
        </div>
        <div className="detail-product">
          <DetailContainer />
        </div>
      </div>
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


export async function getStaticProps({ params }: { params: { id: string } }): Promise<GetStaticPropsResult<{
  product: Product,
  dehydratedState: DehydratedState
}>> {
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

    // Get the cached data directly after prefetching
    const product = queryClient.getQueryData(['product', params.id]);
    const products = queryClient.getQueryData(['products']);

    return {
      props: {
        product: product as Product,
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
