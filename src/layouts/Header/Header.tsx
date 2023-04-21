// import IcOpenMenu from '@/assets/icons/ic_hambuger.svg';
// import IcLogo from '@/assets/icons/logo.svg';
import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Wrapper } from './Header.styled';
import MenuMobile from './MenuMobile';
import WalletHeader from './Wallet';

const Header = ({ height }: { height: number }) => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

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
      <Link className="logo" href={ROUTE_PATH.HOME}>
        <Image
          src={`${CDN_URL}/icons/logo-tc-market.svg`}
          alt="Trustless Market logo"
          width={40}
          height={40}
        />
      </Link>
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
