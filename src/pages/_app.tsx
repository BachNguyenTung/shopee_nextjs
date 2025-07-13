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
import CheckoutProvider from "@/context/CheckoutProvider";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StagewiseToolbar } from '@stagewise/toolbar-next';
import ReactPlugin from '@stagewise-plugins/react';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
const isDev = process.env.NODE_ENV === 'development'
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // each page define a getLayout func to render itself and layout and pass it to const getLayout variable here
  // ?? -> still use the layout defined for each page, if getLayout not call at page
  const getLayout = Component.getLayout ?? ((page) => page)
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
                  {getLayout(
                    <>
                      {isDev ? <StagewiseToolbar config={{ plugins: [ReactPlugin] }} /> : null}
                      <Component {...pageProps} />
                    </>
                  )}
                </CheckoutProvider>
            </UserProvider>
          </ThemeProvider>
        </Provider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
