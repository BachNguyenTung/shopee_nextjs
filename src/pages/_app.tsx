import '@/sass/style.scss'
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { store } from "@/redux/store";
import { theme } from "@/theme";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import UserProvider from "@/context/UserProvider";
import Layout from "@/components/Layout/Layout";
import CheckoutProvider from "@/context/CheckoutProvider";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}


export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // each page define a getLayout func to render itself and layout and pass it to const getLayout variable here
  // ?? -> still use the layout defined for each page, if getLayout not call at page
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <UserProvider>
                <CheckoutProvider>
                  {/* use get layout variable here to return a page */}
                  {/*Component -> each page*/}
                  {getLayout(<Component {...pageProps} />)}
                  {/*{Component.getLayout ?? ((page: ReactElement) => <Layout>{page}</Layout>)}*/}
                </CheckoutProvider>
            </UserProvider>
          </ThemeProvider>
        </Provider>
      </HydrationBoundary>
    </QueryClientProvider>
  )

}
