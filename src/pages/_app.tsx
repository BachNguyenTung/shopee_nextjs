import '@/sass/style.scss'
import "/node_modules/bootstrap-icons/font/bootstrap-icons.css";
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
import {
  defaultShouldDehydrateQuery,
  HydrationBoundary,
  isServer,
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // each page define a getLayout func to render itself and layout and pass it to const getLayout variable here
  // ?? -> still use the layout defined for each page, if getLayout not call at page
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)
  const queryClient = getQueryClient()
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
