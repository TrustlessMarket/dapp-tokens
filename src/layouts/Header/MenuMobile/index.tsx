// import IcAvatarDefault from '@/assets/icons/ic-avatar.svg';
// import IcMenuClose from '@/assets/icons/ic_close_menu.svg';
import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { AssetsContext } from '@/contexts/assets-context';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { formatBTCPrice, formatEthPrice } from '@/utils/format';
import { useRouter } from 'next/router';
import React, { ForwardedRef, useContext } from 'react';
import { useSelector } from 'react-redux';
import { ConnectWalletButton, WalletBalance } from '../Header.styled';
import { Wrapper } from './MenuMobile.styled';

interface IProp {
  onCloseMenu: () => void;
}

const MenuMobile = React.forwardRef(
  ({ onCloseMenu }: IProp, ref: ForwardedRef<HTMLDivElement>) => {
    const { btcBalance, juiceBalance } = useContext(AssetsContext);
    const isAuthenticated = useSelector(getIsAuthenticatedSelector);
    const router = useRouter();
    // const activePath = router.pathname.split('/')[1];

    const handleConnectWallet = async () => {
      router.push(`${ROUTE_PATH.CONNECT_WALLET}?next=${window.location.href}`);
    };

    return (
      <Wrapper ref={ref}>
        <div className="inner">
          <button className="btnMenuMobile" onClick={onCloseMenu}>
            <img src={`${CDN_URL}/icons/ic_close_menu.svg`} />
          </button>
          {/* {MENU_HEADER.map(item => {
          return (
            <StyledLink
              active={activePath === item.activePath}
              href={item.route}
              key={item.id}
              onClick={onCloseMenu}
              activeColor="#F9D03F"
            >
              {item.name}
            </StyledLink>
          );
        })} */}
          {isAuthenticated ? (
            <div className="wallet mobile">
              <WalletBalance>
                <div className="balance">
                  <p>{formatBTCPrice(btcBalance)} BTC</p>
                  <span className="divider"></span>
                  <p>{formatEthPrice(juiceBalance)} TC</p>
                </div>
                <div className="avatar">
                  <img src={`${CDN_URL}/icons/ic-avatar.svg`} alt="default avatar" />
                </div>
              </WalletBalance>
            </div>
          ) : (
            <ConnectWalletButton onClick={handleConnectWallet}>
              Connect Wallet
            </ConnectWalletButton>
          )}
        </div>
      </Wrapper>
    );
  },
);

MenuMobile.displayName = 'MenuMobile';
export default MenuMobile;
