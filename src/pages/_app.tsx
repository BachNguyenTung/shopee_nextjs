import '@/sass/style.scss'
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { store } from "@/redux/store";
import { theme } from "@/theme";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import UserProvider from "@/context/UserProvider";
import CheckoutProvider from "@/context/CheckoutProvider";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isDev } from "@/constants/constants";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}


const DynamicStagewiseToolbar = () => {
  const [Toolbar, setToolbar] = useState<any>(null);
  const [plugin, setPlugin] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    if (isDev && typeof window !== 'undefined') {
      import('@stagewise/toolbar-next').then((mod) => {
        if (mounted) setToolbar(() => mod.StagewiseToolbar);
      });
      import('@stagewise-plugins/react').then((mod) => {
        if (mounted) setPlugin(() => mod.default);
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  if (!Toolbar || !plugin) return null;
  return <Toolbar config={{ plugins: [plugin] }} />;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
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
                      {isDev ? <DynamicStagewiseToolbar /> : null}
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
