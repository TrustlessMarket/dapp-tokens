/* eslint-disable react-hooks/rules-of-hooks */
import {CDN_URL} from '@/configs';
import {ROUTE_PATH} from '@/constants/route-path';
import {gsap} from 'gsap';
import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {Wrapper} from './Header.styled';
import MenuMobile from './MenuMobile';
import WalletHeader from './Wallet';
import {useWindowSize} from '@trustless-computer/dapp-core';
import {useRouter} from 'next/router';
import {
  GENERATIVE_DISCORD,
  GM_ADDRESS,
  TRUSTLESS_COMPUTER,
  TRUSTLESS_GASSTATION,
  WETH_ADDRESS,
} from '@/constants/common';
import {useScreenLayout} from '@/hooks/useScreenLayout';
import {defaultProvider} from '@/contexts/screen-context';
import {compareString} from '@/utils';
import {Flex, Link as LinkText, Text} from '@chakra-ui/react';
import {RiArrowRightUpLine} from 'react-icons/ri';

export const isScreenDarkMode = () => {
  return true;
  const router = useRouter();
  return (
    compareString(router?.pathname, ROUTE_PATH.HOME) ||
    compareString(router?.pathname, ROUTE_PATH.MARKETS) ||
    compareString(router?.pathname, ROUTE_PATH.TOKEN) ||
    compareString(router?.pathname, ROUTE_PATH.GET_STARTED) ||
    compareString(router?.pathname, ROUTE_PATH.TM_TRANSFER_HISTORY) ||
    compareString(router?.pathname, ROUTE_PATH.SWAP_HISTORY)
  );
};

export const HEADER_MENUS = [
  {
    key: ROUTE_PATH.MARKETS,
    route: ROUTE_PATH.MARKETS,
    name: 'Markets',
  },
  {
    key: ROUTE_PATH.SWAP,
    route: `${ROUTE_PATH.SWAP}?from_token=${WETH_ADDRESS}&to_token=${GM_ADDRESS}`,
    name: 'Swap',
  },
  {
    key: ROUTE_PATH.POOLS,
    route: ROUTE_PATH.POOLS,
    name: 'Pools',
  },
];

const Header = () => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { mobileScreen } = useWindowSize();
  const router = useRouter();
  const { headerHeight, showGetStarted } = useScreenLayout();

  // const isTokensPage = useMemo(() => {
  //   return isScreenDarkMode();
  // }, [router?.pathname]);

  console.log('aaaa');

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
            <img
              src={`${CDN_URL}/icons/logo-tc-market.svg`}
              alt="Trustless Market logo"
              width={40}
              height={40}
            />
          </Link>
          {!mobileScreen && (
            <div className={'leftContainer'}>
              <div className="external-link">
                {HEADER_MENUS.map((m) => (
                  <Link
                    key={m.route}
                    href={m.route}
                    className={router?.pathname?.includes(m.key) ? 'isSelected' : ''}
                  >
                    {m.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <MenuMobile ref={refMenu} onCloseMenu={() => setIsOpenMenu(false)} />
        <div className="rightContainer">
          {mobileScreen ? (
            <button className="btnMenuMobile" onClick={() => setIsOpenMenu(true)}>
              <img
                src={`${CDN_URL}/icons/ic-header-menu.svg`}
                alt="trustless.maket"
              />
            </button>
          ) : (
            <>
              <div className="external-link">
                <Link href={TRUSTLESS_GASSTATION} target={'_blank'}>
                  <Flex gap={1} alignItems={'center'}>
                    <Text>GET TC</Text>
                    <RiArrowRightUpLine fontSize={'20px'} />
                  </Flex>
                </Link>
                <Link href={GENERATIVE_DISCORD} target={'_blank'}>
                  <Flex gap={1} alignItems={'center'}>
                    <Text>DISCORD</Text>
                    <RiArrowRightUpLine fontSize={'20px'} />
                  </Flex>
                </Link>
                <Link href={TRUSTLESS_COMPUTER} target={'_blank'}>
                  <Flex gap={1} alignItems={'center'}>
                    <Text>TRUSTLESS</Text>
                    <RiArrowRightUpLine fontSize={'20px'} />
                  </Flex>
                </Link>
              </div>
              <WalletHeader />
            </>
          )}
        </div>
      </div>
      {showGetStarted && (
        <Flex
          height={10}
          alignItems="center"
          justifyContent="center"
          bgColor={`#ebebeb${isScreenDarkMode() ? '33' : ''}`}
        >
          <Text
            fontWeight="medium"
            fontSize="sm"
            color={isScreenDarkMode() ? 'white' : 'black'}
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
