import { Flex, Link as LinkText, Text } from '@chakra-ui/react';
import styles from './styles.module.scss';
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { selectPnftExchange } from '@/state/pnftExchange';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import { useAppSelector } from '@/state/hooks';
import { ROUTE_PATH } from '@/constants/route-path';
import { ScreenType } from '@/modules/Pools';
import { isScreenDarkMode } from '@/layouts/Header';
import { MXRC_ADDRESS, OXBT_ADDRESS } from '@/constants/common';
import { DEFAULT_FROM_ADDRESS } from '@/configs';

/* eslint-disable @typescript-eslint/no-explicit-any */
// const START_TIME = 1683903600;
// const END_TIME = 1684422000;
//
// export const CountDownTimer = ({ end_time, isActive } : {end_time: any, isActive: boolean}) => {
//   const [days, hours, minutes, seconds, expired] = useCountDownTimer(
//     moment.unix(end_time).format("YYYY/MM/DD HH:mm:ss")
//   );
//
//   const dispatch = useDispatch();
//
//   useEffect(() => {
//     if (expired && end_time) {
//       dispatch(requestReload());
//       dispatch(updateShowBanner(false));
//     }
//   }, [expired]);
//
//   return (
//     <Flex as={"span"} className={styles.banner} gap={1}>
//       <img alt={"checkout"} src={`${CDN_URL}/icons/${isActive ? 'fire_orange.svg' : 'fire_white.svg'}`} />
//       <Text>{Number(days) > 0 && `${days}d :`} {hours}h : {minutes}m : {seconds}s</Text>
//     </Flex>
//   );
// };

const Banner = () => {
  const [isActive, setIsActive] = useState(false);
  const { bannerHeight } = useScreenLayout();
  // const needReload = useAppSelector(selectPnftExchange).needReload;
  const showBanner = useAppSelector(selectPnftExchange).showBanner;

  useEffect(() => {
    const intervalID = setInterval(() => {
      setIsActive(true);
    }, 3000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);
  //
  // const time = useMemo(() => {
  //   return END_TIME;
  // }, [needReload]);

  return showBanner ? (
    <Flex
      height={`${bannerHeight}px`}
      alignItems="center"
      justifyContent="center"
      className={cx(styles.wrapper, isActive ? styles.active : '')}
    >
      <Text
        fontWeight="medium"
        fontSize="sm"
        color={isScreenDarkMode() ? 'white' : 'black'}
      >
        $OXBT & $MXRC are now tradable. For a limited time, you can earn 2 $TM each
        time you add liquidity to{' '}
        <LinkText
          fontWeight="bold"
          color="brand.info.400"
          href={`${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${OXBT_ADDRESS}&t=${DEFAULT_FROM_ADDRESS}`}
          className={styles.checkItOut}
        >
          OXBT/WBTC
        </LinkText>{' '}
        or{' '}
        <LinkText
          fontWeight="bold"
          color="brand.info.400"
          href={`${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${MXRC_ADDRESS}&t=${DEFAULT_FROM_ADDRESS}`}
          className={styles.checkItOut}
        >
          MXRC/WBTC
        </LinkText>{' '}
        pool.
      </Text>
    </Flex>
  ) : (
    <div />
  );
};

export default Banner;
