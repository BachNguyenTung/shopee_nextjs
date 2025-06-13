import React, { ReactElement, Suspense } from "react";
import Product from '@/components/Product'
import { NextSeo } from 'next-seo';
import Layout from "@/components/Layout/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchProducts } from "@/services/fetchProducts";
import { ClipLoading } from "@/components/ClipLoading";


const Home: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Shopee - Online Shopping Platform | Best Deals & Discounts"
        description="Shop online for the best deals on electronics, fashion, home goods and more on Shopee. Free shipping, authentic products, and secure payments."
        canonical="https://shopee-nextjs-ecru.vercel.app"
        robotsProps={{
          maxSnippet: -1,
          maxImagePreview: 'large',
          maxVideoPreview: -1
        }}
        openGraph={{
          type: 'website',
          locale: 'vi_VN',
          url: 'https://shopee-nextjs-ecru.vercel.app',
          title: 'Shopee - Online Shopping Platform | Best Deals & Discounts',
          description: 'Shop online for the best deals on electronics, fashion, home goods and more on Shopee. Free shipping, authentic products, and secure payments.',
          images: [
            {
              url: '/img/shoppe-logo.png',
              width: 800,
              height: 600,
              alt: 'Shopee Logo',
              type: 'image/png',
            }
          ],
          site_name: 'Shopee',
        }}
        twitter={{
          handle: '@ShopeePH',
          site: '@ShopeePH',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'online shopping, e-commerce, shopee, deals, discounts, electronics, fashion, home goods'
          },
          {
            name: 'application-name',
            content: 'Shopee'
          },
          {
            name: 'apple-mobile-web-app-title',
            content: 'Shopee'
          }
        ]}
        additionalLinkTags={[
          {
            rel: 'sitemap',
            type: 'application/xml',
            href: '/api/sitemap.xml'
          },
          {
            rel: 'icon',
            href: '/favicon.ico'
          },
          {
            rel: 'apple-touch-icon',
            href: '/img/shoppe-logo.png',
            sizes: '180x180'
          }
        ]}
      />
      <Suspense fallback={<ClipLoading />}>
        <Product />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Shopee",
            "url": "https://shopee-nextjs-ecru.vercel.app",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://shopee-nextjs-ecru.vercel.app/search?query={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            },
            "sameAs": [
              "https://www.facebook.com/Shopee",
              "https://twitter.com/ShopeePH"
            ]
          })
        }}
      />
    </>
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
  queryClient.prefetchQuery({
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
