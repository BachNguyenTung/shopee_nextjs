import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="vi" suppressHydrationWarning>
      <Head>
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <meta httpEquiv="x-ua-compatible" content="IE=edge,chrome=1" />
        {/*<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />*/}
        <meta name="author" content="Shopee" />
        <meta name="generator" content="Shopee E-commerce" />
        <meta name="copyright" content="Shopee © 2025" />
        <meta name="distribution" content="Global" />
        <meta name="revisit-after" content="1 days" />
        <link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials" />
      </Head>
      <body>
      <Main />
      <NextScript />
      </body>
    </Html>
  )
}
