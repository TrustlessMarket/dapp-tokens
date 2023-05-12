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
const START_TIME = '2023-05-12 22:00:00';
const END_TIME = '2023-05-15 22:00:00';

export const CountDownTimer = ({ end_time, isActive } : {end_time: any, isActive: boolean}) => {
  const [days, hours, minutes, seconds, expired] = useCountDownTimer(
    moment(end_time).format("YYYY/MM/DD HH:mm:ss")
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
    if(moment().isBefore(moment(START_TIME, "YYYY-MM-DD HH:mm:ss"))) {
      return START_TIME;
    } else if(moment().isBefore(moment(END_TIME, "YYYY-MM-DD HH:mm:ss"))) {
      return END_TIME;
    }

    return moment().format("YYYY-MM-DD HH:mm:ss");
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
      >
        <CountDownTimer end_time={moment(time, "YYYY-MM-DD HH:mm:ss")} isActive={isActive}/>
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