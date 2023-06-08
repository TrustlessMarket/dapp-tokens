/* eslint-disable react-hooks/rules-of-hooks */
import { CDN_URL } from '@/configs';
import {
  GENERATIVE_DISCORD,
  GM_ADDRESS,
  TRUSTLESS_COMPUTER,
  TRUSTLESS_GASSTATION,
  WETH_ADDRESS,
} from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import { defaultProvider } from '@/contexts/screen-context';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import { Flex, Link as LinkText, Text } from '@chakra-ui/react';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { RiArrowRightUpLine } from 'react-icons/ri';
import { Wrapper } from './Header.styled';
import MenuMobile from './MenuMobile';
import WalletHeader from './Wallet';
import {ScreenType} from "@/modules/Pools";

export const isScreenDarkMode = () => {
  return true;
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
  {
    key: ROUTE_PATH.LAUNCHPAD,
    route: ROUTE_PATH.LAUNCHPAD,
    name: 'Launchpad',
  },
  // {
  //   key: ROUTE_PATH.PROPOSAL,
  //   route: ROUTE_PATH.PROPOSAL,
  //   name: 'Proposal',
  // },
];

const Header = () => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { mobileScreen } = useWindowSize();
  const router = useRouter();
  const { headerHeight, showGetStarted, showLaunchpadGetStarted } =
    useScreenLayout();

  // const isTokensPage = useMemo(() => {
  //   return isScreenDarkMode();
  // }, [router?.pathname]);

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
      <div
        className={'header-container'}
        style={{ height: defaultProvider.headerHeight }}
      >
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
      {showLaunchpadGetStarted && (
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
            Are you new?{' '}
            <LinkText
              fontWeight="bold"
              color="brand.info.400"
              href={ROUTE_PATH.LAUNCHPAD_GET_STARTED}
            >
              Start here.
            </LinkText>{' '}
          </Text>
        </Flex>
      )}
      <Flex
        height={10}
        alignItems="center"
        justifyContent="center"
        bgColor={`#1e1e22`}
      >
        <Text
          fontWeight="medium"
          fontSize="sm"
          color={isScreenDarkMode() ? 'white' : 'black'}
        >
          $OXBT & $MXRC are now tradable. For a limited time, you can earn 2 $TM each time you add liquidity to <LinkText
          fontWeight="bold"
          color="brand.info.400"
          href={`${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=0x4A50C02CA92B363E337e79F1977865BBCF0b4630&t=0xfB83c18569fB43f1ABCbae09Baf7090bFFc8CBBD`}
        >OXBT/WBTC</LinkText> or <LinkText
          fontWeight="bold"
          color="brand.info.400"
          href={`${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=0x0deD162F7ad87A29c43923103141f4Dc86a01AA1&t=0xfB83c18569fB43f1ABCbae09Baf7090bFFc8CBBD`}
        >MXRC/WBTC</LinkText> pool.
        </Text>
      </Flex>
    </Wrapper>
  );
};

export default Header;
