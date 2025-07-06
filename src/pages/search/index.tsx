import React, { ReactElement } from "react";
import Layout from "@/components/Layout/Layout";
import { fetchProductsByQuery } from "@/services/fetchProductsByQuery";
import { NextPageWithLayout } from "@/pages/_app";
import { GetServerSidePropsContext, InferGetStaticPropsType } from "next";
import { Product } from "@/types/types";
import ProductContainer from "@/components/Product/ProductContainer";

const Page: NextPageWithLayout<InferGetStaticPropsType<typeof getServerSideProps>> = ({ searchProducts }: InferGetStaticPropsType<typeof getServerSideProps>) => {
  return (
    <ProductContainer items={searchProducts}></ProductContainer>
  )
};
Page.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}
export default Page;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Check if query parameter exists
  if (!context.query.query) {
    return {
      notFound: true,
    }
  }
  const query = context.query.query as string;
  const searchProducts = await fetchProductsByQuery(query) as Product[];

  // Set balanced caching headers for Vercel Edge Network
  if (context.res) {
    context.res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    context.res.setHeader('CDN-Cache-Control', 'max-age=60');
    context.res.setHeader('Vercel-CDN-Cache-Control', 'max-age=60');
    context.res.setHeader('Vary', 'Accept-Encoding, Accept-Language');
  }

  // Pass data to the page via props
  return {
    props: {
      searchProducts: searchProducts || [],
    },
  }
}
