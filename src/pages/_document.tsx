import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Shoppe</title>
        <meta name="description" content="Shopee" />
        <meta property="og:title" content="Shopee" />
        <meta property="og:description" content="Ecommerce website" />
        <meta property="og:image" content="/img/shopee-logo.png" />
      </Head>
      <body>
      <Main />
      <NextScript />
      </body>
    </Html>
  )
}
