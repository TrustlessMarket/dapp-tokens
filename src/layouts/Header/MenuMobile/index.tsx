/* eslint-disable @typescript-eslint/no-unused-vars */
// import IcAvatarDefault from '@/assets/icons/ic-avatar.svg';
// import IcMenuClose from '@/assets/icons/ic_close_menu.svg';
import {CDN_URL} from '@/configs';
import {ROUTE_PATH} from '@/constants/route-path';
import {AssetsContext} from '@/contexts/assets-context';
import {getIsAuthenticatedSelector} from '@/state/user/selector';
import {useRouter} from 'next/router';
import React, {ForwardedRef, useContext, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {HEADER_MENUS} from '..';
import {StyledLink} from '../Header.styled';
import {Wrapper} from './MenuMobile.styled';
import {Box, Flex, Text} from '@chakra-ui/react';
import {GENERATIVE_DISCORD, NEW_BITCOIN_CITY, TRUSTLESS_GASSTATION} from '@/constants/common';
import {selectPnftExchange} from "@/state/pnftExchange";

interface IProp {
  onCloseMenu: () => void;
}

const MenuMobile = React.forwardRef(
  ({ onCloseMenu }: IProp, ref: ForwardedRef<HTMLDivElement>) => {
    const { btcBalance, juiceBalance } = useContext(AssetsContext);
    const isAuthenticated = useSelector(getIsAuthenticatedSelector);
    const router = useRouter();
    const currentSelectedChain = useSelector(selectPnftExchange).currentChain;

    const headerMenu = useMemo(() => {
      return HEADER_MENUS(currentSelectedChain);
    }, [currentSelectedChain.chain]);

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
              <StyledLink active={false} href={TRUSTLESS_GASSTATION} target={'_blank'}>
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
