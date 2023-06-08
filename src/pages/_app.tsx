/* eslint-disable @typescript-eslint/no-explicit-any */
import ModalManager from '@/components/Swap/modal';
import MyLoadingOverlay from '@/components/Swap/myLoadingOverlay';
import ClientOnly from '@/components/Utils/ClientOnly';
import Web3Provider from '@/components/Web3Provider';
import {SEO_DESCRIPTION, SEO_IMAGE, SEO_TITLE} from '@/constants/seo';
import {AssetsProvider} from '@/contexts/assets-context';
import {ScreenLayoutProvider} from '@/contexts/screen-context';
import {WalletProvider} from '@/contexts/wallet-context';
import store from '@/state';
import '@/styles/index.scss';
import ChakaDefaultProps from '@/theme/chakraDefaultProps';
import ThemeProvider, {ThemedGlobalStyle} from '@/theme/theme';
import customTheme from '@/theme/theme-chakra';
import {ChakraProvider} from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {useEffect, useState} from 'react';
import {Toaster} from 'react-hot-toast';
import {Provider} from 'react-redux';
import GoogleAnalytics from "../components/GA/GoogleAnalytics";
import {getConfigs} from "@/services";
import {updateConfigs} from "@/state/pnftExchange";

export default function App({ Component, pageProps }: AppProps) {
  const { seoInfo = {} } = pageProps;
  const { title, description, image } = seoInfo;
  useEffect(() => {
    getConfigInfos();
  }, []);

  const getConfigInfos = async () => {
    const res = await getConfigs();
    store.dispatch(updateConfigs(res?.tc));
  }

  return (
    <>
      <Head>
        <title>{title ?? SEO_TITLE}</title>
        <meta property="og:title" content={title ?? SEO_TITLE} />
        <meta property="og:description" content={description ?? SEO_DESCRIPTION} />
        <meta property="og:image" content={image ?? SEO_IMAGE} />
        <meta property="og:type" content="website" />
        <meta property="twitter:title" content={title ?? SEO_TITLE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content={description ?? SEO_DESCRIPTION} />
        <meta name="twitter:image" content={image ?? SEO_IMAGE} />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#fff" />
        <meta name="theme-color" content="#ffffff"></meta>

        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="icon" sizes="16x16 32x32 64x64" href="/images/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="196x196"
          href="/images/favicon-192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="160x160"
          href="/images/favicon-160.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/images/favicon-96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="64x64"
          href="/images/favicon-64.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16.png"
        />
        <link rel="apple-touch-icon" href="/images/favicon-57.png" />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/images/favicon-114.png"
        />
        <link rel="apple-touch-icon" sizes="72x72" href="/images/favicon-72.png" />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/images/favicon-144.png"
        />
        <link rel="apple-touch-icon" sizes="60x60" href="/images/favicon-60.png" />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/images/favicon-120.png"
        />
        <link rel="apple-touch-icon" sizes="76x76" href="/images/favicon-76.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/images/favicon-152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicon-180.png"
        />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-TileImage" content="images/favicon-144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>

      <ClientOnly>
        <Provider store={store}>
          <ChakraProvider {...ChakaDefaultProps} theme={customTheme}>
            <ThemeProvider>
              <ThemedGlobalStyle />
              <Web3Provider>
                <WalletProvider>
                  <ScreenLayoutProvider>
                    <AssetsProvider>
                      <Hydrated>
                        <GoogleAnalytics />
                        <Component {...pageProps} />
                      </Hydrated>
                    </AssetsProvider>
                    <Toaster position="top-center" reverseOrder={false} />
                    <ModalManager />
                    <MyLoadingOverlay />
                  </ScreenLayoutProvider>
                </WalletProvider>
              </Web3Provider>
            </ThemeProvider>
          </ChakraProvider>
        </Provider>
      </ClientOnly>
    </>
  );
}

const Hydrated = ({ children }: { children?: any }) => {
  const [hydration, setHydration] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHydration(true);
    }
  }, []);
  return hydration ? children : null;
};
