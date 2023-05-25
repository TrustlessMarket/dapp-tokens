/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './styles.module.scss';
import {Box, GridItem, SimpleGrid, Stat, StatLabel, StatNumber, Text} from "@chakra-ui/react";
import BodyContainer from "@/components/Swap/bodyContainer";
import {formatCurrency} from "@/utils";
import moment from "moment";
import Card from "@/components/Swap/card";
import React, {useEffect, useRef, useState} from "react";
import useCountDownTimer from "@/hooks/useCountdown";
import {useDispatch} from "react-redux";
import {requestReload} from "@/state/pnftExchange";
import cx from 'classnames';
import {CDN_URL} from "@/configs";

const LaunchpadUpComing = ({poolDetail}: any) => {
  const [endTime, setEndTime] = useState(0);
  const [days, hours, minutes, seconds, expired] = useCountDownTimer(
    moment.unix(endTime).format("YYYY/MM/DD HH:mm:ss")
  );

  const refVideo = useRef<any>();

  const [isPlay, setIsPlay] = useState(false);

  useEffect(() => {
    if(poolDetail?.id) {
      setEndTime(moment(poolDetail?.startTime).unix());
    }
  }, [poolDetail?.id])

  const dispatch = useDispatch();

  useEffect(() => {
    if (expired && endTime) {
      dispatch(requestReload());
    }
  }, [expired]);

  const onPlay = () => {
    setIsPlay(true);
    return refVideo.current.play();
  };

  const onPause = () => {
    setIsPlay(false);
    return refVideo.current.pause();
  };

  return (
    <BodyContainer className={styles.wrapper}>
      <SimpleGrid className={"max-content"} columns={[1, 2]} spacingX={10}>
        <GridItem>
          <img src={`${CDN_URL}/pages/gm/video-thumbnail.png`} alt="thumbnail" className={"home-image"}></img>
          <Box
            className="home-video"
            flex={1}
            position="relative"
            display={["none", "block"]}
            onClick={isPlay ? onPause : onPlay}
            mt={4}
          >
            <video
              poster={`${CDN_URL}/pages/gm/video-thumbnail.png`}
              ref={refVideo}
            >
              <source
                src={`${CDN_URL}/pages/gm/NBC_03.mp4`}
                type="video/mp4"
              ></source>
            </video>
            {!isPlay && <div className="bg-fade" />}
            <a className={cx("btn-play", isPlay && "played")}>
              <img src={`${CDN_URL}/icons/${isPlay ? 'ic_pause_video.svg' : 'ic_play_video.svg'}`} alt="thumbnail"></img>
            </a>
          </Box>
        </GridItem>
        <GridItem>
          <Card bgColor={"#1E1E22"} paddingX={8} paddingY={6}>
            <SimpleGrid columns={3} spacingX={6}>
              <GridItem>
                <Stat>
                  <StatLabel>Goal</StatLabel>
                  <StatNumber>
                    {formatCurrency(poolDetail?.goalBalance || 0)} {poolDetail?.liquidityToken?.symbol}
                  </StatNumber>
                </Stat>
              </GridItem>
              <GridItem>
                <Stat>
                  <StatLabel>Launchpad Balance</StatLabel>
                  <StatNumber>{formatCurrency(poolDetail?.launchpadBalance)} {poolDetail?.launchpadToken?.symbol}</StatNumber>
                </Stat>
              </GridItem>
              <GridItem>
                <Stat>
                  <StatLabel>Starts in</StatLabel>
                  <StatNumber>
                    <Text>{Number(days) > 0 && `${days}d :`} {hours}h : {minutes}m : {seconds}s</Text>
                  </StatNumber>
                </Stat>
              </GridItem>
            </SimpleGrid>
            <Text mt={4} fontSize={"sm"} color={"#FFFFFF"}>All or nothing. This project will only be funded if it reaches its goal by {moment.utc(poolDetail?.endTime).format('ddd, MMMM Do YYYY HH:mm:ss Z')}.</Text>
          </Card>
        </GridItem>
      </SimpleGrid>
    </BodyContainer>
  )
};

export default LaunchpadUpComing;