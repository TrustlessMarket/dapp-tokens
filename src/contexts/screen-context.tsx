import useTCWallet from '@/hooks/useTCWallet';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { useMediaQuery } from '@chakra-ui/react';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { useRouter } from 'next/router';
import React, { createContext, useEffect, useMemo, useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const defaultProvider = {
  headerHeight: 80,
  headerHeightMobile: 80,
  headerTradingHeight: 48,
  footerHeight: 66,
  footerHeightMobile: 66,
  footerTradingHeight: 35,
  footerTradingHeightMobile: 60,
  showGetStarted: false,
  bannerHeight: 40,
  bannerHeightMobile: 40,
};

const ScreenLayoutContext = createContext(defaultProvider);

/* eslint-disable @typescript-eslint/no-explicit-any */
const ScreenLayoutProvider: React.FC<any> = ({ children }) => {
  const [screen800] = useMediaQuery('(max-width: 768px)');
  const { mobileScreen } = useWindowSize();
  const { tcWalletAddress: account } = useTCWallet();
  const showBanner = useAppSelector(selectPnftExchange).showBanner;

  const _isMobile = mobileScreen || screen800;

  const router = useRouter();

  const [headerHeight, setHeaderHeight] = useState(
    _isMobile ? defaultProvider.headerHeightMobile : defaultProvider.headerHeight,
  );

  const footerHeight = useMemo(() => {
    return _isMobile
      ? defaultProvider.footerHeightMobile
      : defaultProvider.footerHeight;
  }, [_isMobile]);

  const bannerHeight = useMemo(() => {
    return showBanner
      ? _isMobile
        ? defaultProvider.bannerHeightMobile
        : defaultProvider.bannerHeight
      : 0;
  }, [_isMobile, showBanner]);

  const showGetStarted = true;

  useEffect(() => {
    let height = _isMobile
      ? defaultProvider.headerHeightMobile
      : defaultProvider.headerHeight;
    // if ([APP_URL.TRADING, APP_URL.DASHBOARD].includes(router?.pathname)) {
    //   height = defaultProvider.headerTradingHeight;
    // }

    // if (!_isMobile) {
    height += showGetStarted ? bannerHeight : 0;
    // }

    setHeaderHeight(height);
  }, [_isMobile, account, router?.pathname, showBanner]);

  const values = {
    ...defaultProvider,
    headerHeight,
    footerHeight,
    showGetStarted,
    bannerHeight,
  };

  return (
    <ScreenLayoutContext.Provider value={values}>
      {children}
    </ScreenLayoutContext.Provider>
  );
};

export { ScreenLayoutContext, ScreenLayoutProvider };
