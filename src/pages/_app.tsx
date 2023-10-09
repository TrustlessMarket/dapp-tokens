import ModalManager from '@/components/Swap/modal';
import MyLoadingOverlay from '@/components/Swap/myLoadingOverlay';
import ClientOnly from '@/components/Utils/ClientOnly';
import Web3Provider from '@/components/Web3Provider';
import { SEO_DESCRIPTION, SEO_IMAGE, SEO_TITLE } from '@/constants/seo';
import { AssetsProvider } from '@/contexts/assets-context';
import { ScreenLayoutProvider } from '@/contexts/screen-context';
import { WalletProvider } from '@/contexts/wallet-context';
import store from '@/state';
import '@/styles/index.scss';
import ChakaDefaultProps from '@/theme/chakraDefaultProps';
import ThemeProvider, { ThemedGlobalStyle } from '@/theme/theme';
import customTheme from '@/theme/theme-chakra';
import { ChakraProvider } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import GoogleAnalytics from '../components/GA/GoogleAnalytics';
import { getConfigs } from '@/services';
import { updateAllConfigs, updateConfigs, updateCurrentChain, updateCurrentChainId } from '@/state/pnftExchange';
import { IResourceChain } from '@/interfaces/chain';
import { compareString, getLocalStorageChainInfo } from '@/utils';
import { IConfigs } from '@/interfaces/state/pnftExchange';
import { convertNetworkToResourceChain } from '@/constants/chains';
import { ConfigProvider } from '@/contexts/config-context';
import { CHAIN_INFO } from '@/constants/storage-key';

export default function App({ Component, pageProps }: AppProps) {
  const { seoInfo = {} } = pageProps;
  const { title, description, image } = seoInfo;
  const [loading, setLoading] = useState(false);

  const getConfigInfos = async () => {
    setLoading(true);
    try {
      const configs = await getConfigs() as IConfigs;

      const keys = Object.keys(configs);

      keys.forEach((key) => {
        const config = configs[key];
        configs[key] = {
          ...config,
          name: key,
        } as IConfigs[keyof IConfigs];
      });

      store.dispatch(updateAllConfigs(configs));
      const connectedChain: IResourceChain = getLocalStorageChainInfo();

      let network = Object.values(configs || {}).find(v => compareString(v.chainId, connectedChain?.chainId));
      if (!network) {
        network = Object.values(configs || {})[0];
        localStorage.setItem(CHAIN_INFO, JSON.stringify(network));
      }

      console.log('_app configs:', {
        configs,
        network,
      });

      if (!!network) {
        store.dispatch(updateConfigs(network));
        store.dispatch(updateCurrentChain(convertNetworkToResourceChain(network)));
        store.dispatch(updateCurrentChainId(Number(network.chainId)));
      } else {
        console.log('_app configs:: not found', connectedChain);
      }
    } catch (e) {
      console.log('_app configs:: error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConfigInfos();
  }, []);

  return (
    <>
      <Head>
        <title>{title ?? SEO_TITLE}</title>
        <meta property='og:title' content={title ?? SEO_TITLE} />
        <meta property='og:description' content={description ?? SEO_DESCRIPTION} />
        <meta property='og:image' content={image ?? SEO_IMAGE} />
        <meta property='og:type' content='website' />
        <meta property='twitter:title' content={title ?? SEO_TITLE} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:description' content={description ?? SEO_DESCRIPTION} />
        <meta name='twitter:image' content={image ?? SEO_IMAGE} />
        <meta
          name='viewport'
          content='width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        />

        <link rel='manifest' href='/manifest.json' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#fff' />
        <meta name='theme-color' content='#ffffff'></meta>

        <link
          rel='shortcut icon'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='icon'
          sizes='16x16 32x32 64x64'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='196x196'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='160x160'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='96x96'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='64x64'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='apple-touch-icon'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='apple-touch-icon'
          sizes='114x114'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='apple-touch-icon'
          sizes='72x72'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='apple-touch-icon'
          sizes='144x144'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='apple-touch-icon'
          sizes='60x60'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='apple-touch-icon'
          sizes='120x120'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='apple-touch-icon'
          sizes='76x76'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='apple-touch-icon'
          sizes='152x152'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <meta name='msapplication-TileColor' content='#FFFFFF' />
        <meta
          name='msapplication-TileImage'
          content='https://cdn.newbitcoindex.com/icons/logo-tc-market.svg'
        />
        <meta name='msapplication-config' content='/browserconfig.xml' />
        <link
          rel='stylesheet'
          type='text/css'
          charSet='UTF-8'
          href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
        />
        <link
          rel='stylesheet'
          type='text/css'
          href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
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
                      <ConfigProvider>
                        <Hydrated>
                          <GoogleAnalytics />
                          {!loading && (
                            <Component {...pageProps} />
                          )}
                        </Hydrated>
                      </ConfigProvider>
                    </AssetsProvider>
                    <Toaster position='top-center' reverseOrder={false} />
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
