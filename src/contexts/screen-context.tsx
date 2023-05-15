import React, {createContext, useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import {useMediaQuery} from "@chakra-ui/react";
import {useWindowSize} from "@trustless-computer/dapp-core";
import {useWeb3React} from "@web3-react/core";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const defaultProvider = {
  headerHeight: 80,
  headerHeightMobile: 80,
  headerTradingHeight: 48,
  footerHeight: 80,
  footerHeightMobile: 80,
  footerTradingHeight: 35,
  footerTradingHeightMobile: 60,
  showGetStarted: false,
};

const ScreenLayoutContext = createContext(defaultProvider);

/* eslint-disable @typescript-eslint/no-explicit-any */
const ScreenLayoutProvider: React.FC<any> = ({ children }) => {
  const [screen800] = useMediaQuery("(max-width: 768px)");
  const { mobileScreen } = useWindowSize();
  const { account } = useWeb3React();

  const _isMobile = mobileScreen || screen800;

  const router = useRouter();

  const [headerHeight, setHeaderHeight] = useState(
    _isMobile
      ? defaultProvider.headerHeightMobile
      : defaultProvider.headerHeight
  );

  const footerHeight = useMemo(() => {
    return _isMobile
      ? defaultProvider.footerHeightMobile
      : defaultProvider.footerHeight
  }, [_isMobile]);

  const showGetStarted = true;

  useEffect(() => {
    let height = _isMobile
      ? defaultProvider.headerHeightMobile
      : defaultProvider.headerHeight;
    // if ([APP_URL.TRADING, APP_URL.DASHBOARD].includes(router?.pathname)) {
    //   height = defaultProvider.headerTradingHeight;
    // }

    // if (!_isMobile) {
      height +=
        (showGetStarted ? 40 : 0)
      ;
    // }

    setHeaderHeight(height);
  }, [
    _isMobile,
    account,
    router?.pathname,
  ]);

  const values = {
    ...defaultProvider,
    headerHeight,
    footerHeight,
    showGetStarted,
  };

  return (
    <ScreenLayoutContext.Provider value={values}>
      {children}
    </ScreenLayoutContext.Provider>
  );
};

export { ScreenLayoutContext, ScreenLayoutProvider };
