import Head from 'next/head';
import type { AppProps } from 'next/app'
import { SEO_TITLE, SEO_DESCRIPTION, SEO_IMAGE } from '@/constants/seo';
import Web3Provider from '@/components/Web3Provider';
import { Provider } from 'react-redux';
import { WalletProvider } from '@/contexts/wallet-context';
import { AssetsProvider } from '@/contexts/assets-context';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeProvider, { ThemedGlobalStyle } from '@/theme/theme';
import store from '@/state';
import { Toaster } from 'react-hot-toast';
import '@/styles/index.scss';

export default function App({ Component, pageProps }: AppProps) {
  const { seoInfo = {} } = pageProps;
  const { title, description, image } = seoInfo;

  return (
    <>
      <Head>
        <title>{title ?? SEO_TITLE}</title>
        <meta property="og:title" content={title ?? SEO_TITLE} />
        <meta
          property="og:description"
          content={description ?? SEO_DESCRIPTION}
        />
        <meta property="og:image" content={image ?? SEO_IMAGE} />
        <meta property="og:type" content="website" />
        <meta property="twitter:title" content={title ?? SEO_TITLE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content={description ?? SEO_DESCRIPTION}
        />
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
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/images/favicon-72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/images/favicon-144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/images/favicon-60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/images/favicon-120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/images/favicon-76.png"
        />
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
      </Head>

      <Provider store={store}>
        <ThemeProvider>
          <ThemedGlobalStyle />
          <Web3Provider>
            <WalletProvider>
              <AssetsProvider>
                <Component {...pageProps} />
              </AssetsProvider>
              <Toaster position="top-center" reverseOrder={false} />
            </WalletProvider>
          </Web3Provider>
        </ThemeProvider>
      </Provider>
    </>
  )
}
