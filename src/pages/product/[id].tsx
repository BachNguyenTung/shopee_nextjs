import React, { ReactNode } from "react";
import DetailContainer from "../../components/Detail/DetailContainer";
import Layout from "@/components/Layout/Layout";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchProducts } from "@/services/fetchProducts";
import { fetchProduct } from "@/services/fetchProductById";

interface Product {
  id: string;

  [key: string]: any; // Allow for other product properties
}

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
