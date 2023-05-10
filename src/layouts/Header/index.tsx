/* eslint-disable react-hooks/rules-of-hooks */
import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Wrapper } from './Header.styled';
import MenuMobile from './MenuMobile';
import WalletHeader from './Wallet';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { useRouter } from 'next/router';
import { GENERATIVE_DISCORD, TRUSTLESS_COMPUTER } from '@/constants/common';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import { Flex, Text, Link as LinkText } from '@chakra-ui/react';
import { defaultProvider } from '@/contexts/screen-context';
import { compareString } from '@/utils';

export const isScreenDarkMode = () => {
  const router = useRouter();
  return (
    compareString(router?.pathname, ROUTE_PATH.HOME) ||
    compareString(router?.pathname, ROUTE_PATH.MARKETS) ||
    compareString(router?.pathname, ROUTE_PATH.TOKEN) ||
    compareString(router?.pathname, ROUTE_PATH.GET_STARTED)
  );
};

const Header = () => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { mobileScreen } = useWindowSize();
  const router = useRouter();
  const { headerHeight, showGetStarted } = useScreenLayout();

  const isTokensPage = useMemo(() => {
    return isScreenDarkMode();
  }, [router?.pathname]);

  useEffect(() => {
    if (refMenu.current) {
      if (isOpenMenu) {
        gsap.to(refMenu.current, { x: 0, duration: 0.6, ease: 'power3.inOut' });
      } else {
        gsap.to(refMenu.current, {
          x: '100%',
          duration: 0.6,
          ease: 'power3.inOut',
        });
      }
    }
  }, [isOpenMenu]);

  return (
    <Wrapper style={{ height: headerHeight, margin: '0 auto' }}>
      <div className={'container'} style={{ height: defaultProvider.headerHeight }}>
        <div className={'leftWrapper'}>
          <Link className="logo" href={ROUTE_PATH.HOME}>
            {!mobileScreen && (
              <img
                src={`${CDN_URL}/icons/logo-tc-market.svg`}
                alt="Trustless Market logo"
                style={{ height: '40px' }}
                // height={40}
              />
            )}
            {mobileScreen && (
              <img
                src={`${CDN_URL}/icons/logo-tc-market.svg`}
                alt="Trustless Market logo"
                width={40}
                height={40}
              />
            )}
          </Link>
          <div className={'leftContainer'}>
            <div className="external-link">
              <Link
                href={ROUTE_PATH.MARKETS}
                className={
                  router?.pathname?.includes(ROUTE_PATH.MARKETS) ? 'isSelected' : ''
                }
              >
                Markets
              </Link>
              <Link
                href={ROUTE_PATH.SWAP}
                className={
                  router?.pathname?.includes(ROUTE_PATH.SWAP) ? 'isSelected' : ''
                }
              >
                Swap
              </Link>
              <Link
                href={ROUTE_PATH.POOLS}
                className={
                  router?.pathname?.includes(ROUTE_PATH.POOLS) ? 'isSelected' : ''
                }
              >
                Pools
              </Link>
            </div>
          </div>
        </div>
        <MenuMobile ref={refMenu} onCloseMenu={() => setIsOpenMenu(false)} />
        <div className="rightContainer">
          {!mobileScreen && (
            <div className="external-link">
              <Link href={GENERATIVE_DISCORD} target={'_blank'}>
                DISCORD
              </Link>
              <Link href={TRUSTLESS_COMPUTER} target={'_blank'}>
                TRUSTLESS
              </Link>
            </div>
          )}
          <WalletHeader />
          <button className="btnMenuMobile" onClick={() => setIsOpenMenu(true)}>
            <img src={`${CDN_URL}/icons/ic_hambuger.svg`} />
          </button>
        </div>
      </div>
      {showGetStarted && (
        <Flex
          height={10}
          alignItems="center"
          justifyContent="center"
          bgColor={`#ebebeb${isTokensPage ? '33' : ''}`}
        >
          <Text
            fontWeight="medium"
            fontSize="sm"
            color={isTokensPage ? 'white' : 'black'}
          >
            New to Bitcoin DeFi?{' '}
            <LinkText
              fontWeight="bold"
              color="brand.info.400"
              href={ROUTE_PATH.GET_STARTED}
            >
              Start here.
            </LinkText>{' '}
          </Text>
        </Flex>
      )}
    </Wrapper>
  );
};

export default Header;
