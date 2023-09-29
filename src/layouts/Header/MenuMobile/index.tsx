/* eslint-disable @typescript-eslint/no-unused-vars */
import {CDN_URL} from '@/configs';
import {ROUTE_PATH} from '@/constants/route-path';
import {useRouter} from 'next/router';
import React, {ForwardedRef, useMemo} from 'react';
import {HEADER_MENUS} from '..';
import {StyledLink} from '../Header.styled';
import {Wrapper} from './MenuMobile.styled';
import {Box, Flex, Text} from '@chakra-ui/react';
import {GENERATIVE_DISCORD, NEW_BITCOIN_CITY,} from '@/constants/common';
import HeaderSwitchNetwork from '../Header.SwitchNetwork';
import {getTCGasStationddress} from "@/utils";
import useCheckIsLayer2 from "@/hooks/useCheckIsLayer2";

interface IProp {
  onCloseMenu: () => void;
}

const MenuMobile = React.forwardRef(
  ({ onCloseMenu }: IProp, ref: ForwardedRef<HTMLDivElement>) => {
    const router = useRouter();

    const isL2 = useCheckIsLayer2();

    const headerMenu = useMemo(() => {
      const menu = HEADER_MENUS(isL2);
      return menu;
    }, [isL2]);

    const handleConnectWallet = async () => {
      router.push(`${ROUTE_PATH.CONNECT_WALLET}?next=${window.location.href}`);
    };

    return (
      <Wrapper ref={ref}>
        <div className="inner">
          <button className="btnMenuMobile" onClick={onCloseMenu}>
            <img src={`${CDN_URL}/icons/ic_close_menu.svg`} />
          </button>
          <Flex
            className="content"
            flexDirection={'column'}
            justifyContent={'space-between'}
          >
            <Box className="menu-container" flex={1}>
              {headerMenu.map((item) => {
                return (
                  <StyledLink
                    active={router?.pathname?.includes(item.key)}
                    href={item.route}
                    key={item.key}
                    onClick={onCloseMenu}
                    activeColor="#3385FF"
                  >
                    {item.name}
                  </StyledLink>
                );
              })}
              <StyledLink
                active={false}
                href={getTCGasStationddress()}
                target={'_blank'}
              >
                <Text>GET TC</Text>
                <img
                  className="arrow-icon"
                  src={`${CDN_URL}/trustless-market/icons/arrow_right_up.svg`}
                />
              </StyledLink>
              <StyledLink active={false} href={NEW_BITCOIN_CITY} target={'_blank'}>
                <Text>NBC</Text>
                <img
                  className="arrow-icon"
                  src={`${CDN_URL}/trustless-market/icons/arrow_right_up.svg`}
                />
              </StyledLink>
              <StyledLink active={false} href={GENERATIVE_DISCORD} target={'_blank'}>
                <Text>DISCORD</Text>
                <img
                  className="arrow-icon"
                  src={`${CDN_URL}/trustless-market/icons/arrow_right_up.svg`}
                />
              </StyledLink>
            </Box>
            <Flex alignContent={'center'} justifyContent={'center'}>
              <HeaderSwitchNetwork />
            </Flex>
            <Box mt={6} />
            {/* <Box>
              {isAuthenticated ? (
                <div className="wallet mobile">
                  <WalletBalance>
                    <div className="balance">
                      <p>{formatBTCPrice(btcBalance)} BTC</p>
                      <span className="divider"></span>
                      <p>{formatEthPriceFloor(juiceBalance)} TC</p>
                    </div>
                    <div className="avatar">
                      <img
                        src={`${CDN_URL}/icons/ic-avatar.svg`}
                        alt="default avatar"
                      />
                    </div>
                  </WalletBalance>
                </div>
              ) : (
                <ConnectWalletButton onClick={handleConnectWallet}>
                  Connect Wallet
                </ConnectWalletButton>
              )}
            </Box> */}
          </Flex>
        </div>
      </Wrapper>
    );
  },
);

MenuMobile.displayName = 'MenuMobile';
export default MenuMobile;
