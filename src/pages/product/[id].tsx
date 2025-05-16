import React, { ReactNode, Suspense } from "react";
import DetailContainer from "../../components/Detail/DetailContainer";
import Layout from "@/components/Layout/Layout";
import type { Metadata, ResolvingMetadata } from 'next'
import { ClipLoading } from "@/components/ClipLoading";
import { dehydrate, DehydratedState, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchProduct } from "@/services/fetchProduct";

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

//TODO: generateMetadata for dynamic routes in nextjs app router
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { id } = await params

  // fetch data
  const product = await fetch(`https://.../${id}`).then((res) => res.json())

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}

//TODO: generate static params for product
// export async function generateStaticParams() {
//   // const products = await fetch('https://.../product').then((res) => res.json())
//   //
//   // return products.map((product) => ({
//   //   id: product.id,
//   // }))
// }


export default function ProductDetail({ dehydratedState }: { dehydratedState: DehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<ClipLoading />}>
        <DetailContainer />
      </Suspense>
    </HydrationBoundary>
  );
}

ProductDetail.getLayout = function (page: ReactNode) {
  return <Layout>{page}</Layout>
}

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
