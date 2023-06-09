import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@chakra-ui/react';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { ROUTE_PATH } from '@/constants/route-path';

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
  showLaunchpadGetStarted: false,
  bannerHeight: 40,
  bannerHeightMobile: 40,
  showBannerPromotion: false
};

const ScreenLayoutContext = createContext(defaultProvider);

/* eslint-disable @typescript-eslint/no-explicit-any */
const ScreenLayoutProvider: React.FC<any> = ({ children }) => {
  const [screen800] = useMediaQuery('(max-width: 768px)');
  const { mobileScreen } = useWindowSize();
  const { account } = useWeb3React();
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

  const showBannerPromotion = false && router?.pathname?.includes(ROUTE_PATH.POOLS);
  const showGetStarted = !router?.pathname?.includes(ROUTE_PATH.LAUNCHPAD) && !showBannerPromotion;
  const showLaunchpadGetStarted = router?.pathname?.includes(ROUTE_PATH.LAUNCHPAD) && !showBannerPromotion;

  useEffect(() => {
    let height = _isMobile
      ? defaultProvider.headerHeightMobile
      : defaultProvider.headerHeight;
    // if ([APP_URL.TRADING, APP_URL.DASHBOARD].includes(router?.pathname)) {
    //   height = defaultProvider.headerTradingHeight;
    // }

    // if (!_isMobile) {
    height += showGetStarted ? bannerHeight : 0;
    height += showLaunchpadGetStarted ? bannerHeight : 0;
    height += showBannerPromotion ? bannerHeight : 0;//banner for $OXBT & $MXRC
    // }

    setHeaderHeight(height);
  }, [_isMobile, account, router?.pathname, showBanner]);

  const values = {
    ...defaultProvider,
    headerHeight,
    footerHeight,
    showGetStarted,
    showLaunchpadGetStarted,
    bannerHeight,
    showBannerPromotion
  };

  return (
    <ScreenLayoutContext.Provider value={values}>
      {children}
    </ScreenLayoutContext.Provider>
  );
};

export { ScreenLayoutContext, ScreenLayoutProvider };
