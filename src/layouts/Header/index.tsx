/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {CDN_URL, L2_USDT_ADDRESS, L2_WBTC_ADDRESS} from '@/configs';
import {GENERATIVE_DISCORD, GM_ADDRESS, NEW_BITCOIN_CITY, WETH_ADDRESS,} from '@/constants/common';
import {ROUTE_PATH} from '@/constants/route-path';
import {defaultProvider} from '@/contexts/screen-context';
import {useScreenLayout} from '@/hooks/useScreenLayout';
import HeaderSwitchNetwork from '@/layouts/Header/Header.SwitchNetwork';
import { getChainNameRequestAPI, getTCGasStationddress, isCustomChain } from '@/utils';
import {Flex, Link as LinkText, Text} from '@chakra-ui/react';
import {useWindowSize} from '@trustless-computer/dapp-core';
import {gsap} from 'gsap';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useMemo, useRef, useState} from 'react';
import {Wrapper} from './Header.styled';
import MenuMobile from './MenuMobile';
import WalletHeader from './Wallet';
import Banner from './banner';
import useCheckIsLayer2 from "@/hooks/useCheckIsLayer2";
import { useAppSelector } from '@/state/hooks';
import { currentChainSelector } from '@/state/pnftExchange';
import { IResourceChain } from '@/interfaces/chain';

export const isScreenDarkMode = () => {
  return true;
};

export const HEADER_MENUS = ({ isL2, isCustomChain, chainName }: { isL2: boolean, isCustomChain: boolean, chainName: string }) => [
  {
    key: ROUTE_PATH.MARKETS,
    route: ROUTE_PATH.MARKETS,
    name: 'Markets',
  },
  {
    key: isL2 ? `/swap/${chainName}` : ROUTE_PATH.SWAP,
    route: `${
      isL2 ? `/swap/${chainName}` : ROUTE_PATH.SWAP
    }${isCustomChain ? '' : `?from_token=${isL2 ? L2_USDT_ADDRESS : WETH_ADDRESS}&to_token=${isL2 ? L2_WBTC_ADDRESS : GM_ADDRESS}`}`,
    name: 'Swap',
  },
  {
    key: isL2 ? ROUTE_PATH.POOLS_V2 : ROUTE_PATH.POOLS,
    route: `${isL2 ? `/pools/${chainName}` : ROUTE_PATH.POOLS}`,
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
  const currentChain: IResourceChain = useAppSelector(currentChainSelector);
  const {
    headerHeight,
    showGetStarted,
    showLaunchpadGetStarted,
    showBannerPromotion,
    bannerHeight,
  } = useScreenLayout();

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

  const isL2 = useCheckIsLayer2();

  const headerMenu = useMemo(() => {
    const menu = HEADER_MENUS({
      isL2,
      isCustomChain: isCustomChain(currentChain.chainId),
      chainName: getChainNameRequestAPI(currentChain)
    });
    return menu;
  }, [isL2, currentChain]);

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
              alt="New Bitcoin DEX logo"
              width={40}
              height={40}
            />
          </Link>
          {!mobileScreen && (
            <div className={'leftContainer'}>
              <div className="external-link">
                {headerMenu.map((m) => (
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
        {/* <div className={"centerContainer"}>
          <HeaderSwitchNetwork />
        </div> */}
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
                <Link href={getTCGasStationddress()} target={'_blank'}>
                  <Flex gap={1} alignItems={'center'}>
                    <Text>GET TC</Text>
                    <img
                      className="arrow-icon"
                      src={`${CDN_URL}/trustless-market/icons/arrow_right_up.svg`}
                    />
                  </Flex>
                </Link>
                <Link href={NEW_BITCOIN_CITY} target={'_blank'}>
                  <Flex gap={1} alignItems={'center'}>
                    <Text>NBC</Text>
                    <img
                      className="arrow-icon"
                      src={`${CDN_URL}/trustless-market/icons/arrow_right_up.svg`}
                    />
                  </Flex>
                </Link>
                <Link href={GENERATIVE_DISCORD} target={'_blank'}>
                  <Flex gap={1} alignItems={'center'}>
                    <Text>DISCORD</Text>
                    <img
                      className="arrow-icon"
                      src={`${CDN_URL}/trustless-market/icons/arrow_right_up.svg`}
                    />
                  </Flex>
                </Link>
              </div>
              <HeaderSwitchNetwork />
              <WalletHeader />
            </>
          )}
        </div>
      </div>
      {showGetStarted && (
        <Flex
          height={`${bannerHeight}px`}
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
          height={`${bannerHeight}px`}
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
      {showBannerPromotion && <Banner />}
    </Wrapper>
  );
};

export default Header;
