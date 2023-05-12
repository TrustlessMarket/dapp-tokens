import {Flex, Link as LinkText, Text} from "@chakra-ui/react";
import styles from './styles.module.scss';
import React, {useEffect, useState} from "react";
import cx from 'classnames';
import {CDN_URL} from "@/configs";
import useCountDownTimer from "@/hooks/useCountdown";
import {useDispatch} from "react-redux";
import {requestReload} from "@/state/pnftExchange";
import moment from "moment";
import {useScreenLayout} from "@/hooks/useScreenLayout";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const CountDownTimer = ({ end_time, isActive } : {end_time: any, isActive: boolean}) => {
  const [hours, minutes, seconds, expired] = useCountDownTimer(
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
      <Text>{hours}h : {minutes}m : {seconds}s</Text>
    </Flex>
  );
};

const Banner = () => {
  const [isActive, setIsActive] = useState(false);
  const { bannerHeight } = useScreenLayout();

  useEffect(() => {
    const intervalID = setInterval(() => {
      setIsActive(true);
    }, 3000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

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
        <CountDownTimer end_time={moment("2023-05-12 22:00:00", "YYYY-MM-DD HH:mm:ss")} isActive={isActive}/>
        $GM Crowdfunding Now Live.{' '}
        <LinkText
          className={styles.checkItOut}
          href={"https://newbitcoincity.com/gm"}
          target={"_blank"}
          textDecoration={"none"}
        >
          <Flex gap={1} alignItems={"center"}>
            <Text>Check it out</Text>
            <img alt={"checkout"} src={`${CDN_URL}/icons/${isActive ? 'explore_active.svg' : 'explore_inactive.svg'}`} />
          </Flex>
        </LinkText>
      </Flex>
    </Flex>
  );
};

export default Banner;