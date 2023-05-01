import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Wrapper } from './Header.styled';
import MenuMobile from './MenuMobile';
import WalletHeader from './Wallet';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { useRouter } from 'next/router';

const Header = ({ height }: { height: number }) => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { mobileScreen } = useWindowSize();
  const router = useRouter();

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
    <Wrapper style={{ height }}>
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
        <WalletHeader />
        <button className="btnMenuMobile" onClick={() => setIsOpenMenu(true)}>
          <img src={`${CDN_URL}/icons/ic_hambuger.svg`} />
        </button>
      </div>
    </Wrapper>
  );
};

export default Header;
