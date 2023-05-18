import {Flex, Link as LinkText, Text} from "@chakra-ui/react";
import styles from './styles.module.scss';
import React, {useEffect, useMemo, useState} from "react";
import cx from 'classnames';
import {CDN_URL} from "@/configs";
import useCountDownTimer from "@/hooks/useCountdown";
import {useDispatch} from "react-redux";
import {requestReload, selectPnftExchange} from "@/state/pnftExchange";
import moment from "moment";
import {useScreenLayout} from "@/hooks/useScreenLayout";
import {useAppSelector} from "@/state/hooks";

/* eslint-disable @typescript-eslint/no-explicit-any */
// const START_TIME = 1683903600;
const END_TIME = 1684422000;

export const CountDownTimer = ({ end_time, isActive } : {end_time: any, isActive: boolean}) => {
  const [days, hours, minutes, seconds, expired] = useCountDownTimer(
    moment.unix(end_time).format("YYYY/MM/DD HH:mm:ss")
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (expired && end_time) {
      dispatch(requestReload());
    }
  }, [expired]);

  return (
    <Flex as={"span"} className={styles.banner} gap={1}>
      <img alt={"checkout"} src={`${CDN_URL}/icons/${isActive ? 'fire_orange.svg' : 'fire_white.svg'}`} />
      <Text>{Number(days) > 0 && `${days}d :`} {hours}h : {minutes}m : {seconds}s</Text>
    </Flex>
  );
};

const Banner = () => {
  const [isActive, setIsActive] = useState(false);
  const { bannerHeight } = useScreenLayout();
  const needReload = useAppSelector(selectPnftExchange).needReload;

  useEffect(() => {
    const intervalID = setInterval(() => {
      setIsActive(true);
    }, 3000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  const time = useMemo(() => {
    return END_TIME;
  }, [needReload]);

  return (
    <Flex
      height={`${bannerHeight}px`}
      alignItems="center"
      justifyContent="center"
      className={cx(styles.wrapper, isActive ? styles.active : '')}
    >
      <Flex
        fontWeight="medium"
        fontSize="sm"
        color={'white'}
        alignItems={"center"}
        gap={2}
        direction={["column", "row"]}
        textAlign={["center", "left"]}
      >
        <CountDownTimer end_time={time} isActive={isActive}/>
        $GM (the first smart contract on Bitcoin) crowdfunding campaign is live.{' '}
        <LinkText
          className={styles.checkItOut}
          href={"https://newbitcoincity.com/gm"}
          target={"_blank"}
          textDecoration={"none"}
        >
          <Flex gap={1} alignItems={"center"}>
            <Text>Get $GM</Text>
            <img alt={"checkout"} src={`${CDN_URL}/icons/${isActive ? 'explore_active.svg' : 'explore_inactive.svg'}`} />
          </Flex>
        </LinkText>
      </Flex>
    </Flex>
  );
};

export default Banner;