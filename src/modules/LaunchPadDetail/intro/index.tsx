/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@chakra-ui/react';
import { CDN_URL } from '@/configs';
import cx from 'classnames';
import React, { useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import styles from './styles.module.scss';

const Intro = ({ poolDetail, className }: any) => {
  const refVideo = useRef<any>();

  const [isPlay, setIsPlay] = useState(false);
  const isYoutube = useMemo(() => {
    return (
      poolDetail?.video?.includes('youtube') ||
      poolDetail?.video?.includes('youtu.be')
    );
  }, [poolDetail?.video]);

  const onPlay = () => {
    setIsPlay(true);
    return refVideo.current.play();
  };

  const onPause = () => {
    setIsPlay(false);
    return refVideo.current.pause();
  };

  return (
    <Box className={cx(styles.wrapper, className)}>
      {poolDetail?.image && (
        <div
          className={styles.bgBlur}
          style={{
            backgroundImage: `url(${poolDetail?.image})`,
          }}
        />
      )}

      {poolDetail?.video ? (
        <>
          {isYoutube ? (
            <Box
              className="youtube-video"
              flex={1}
              position="relative"
              display={['none', 'block']}
            >
              <ReactPlayer url={poolDetail?.video} width="100%" height="100%" />
            </Box>
          ) : (
            <Box
              className="home-video"
              flex={1}
              position="relative"
              display={['none', 'block']}
              onClick={isPlay ? onPause : onPlay}
            >
              <video poster={poolDetail?.image} ref={refVideo}>
                <source src={poolDetail?.video} type="video/mp4"></source>
              </video>
              {!isPlay && <div className="bg-fade" />}
              <a className={cx('btn-play', isPlay && 'played')}>
                <img
                  src={`${CDN_URL}/icons/${
                    isPlay ? 'ic_pause_video.svg' : 'ic_play_video.svg'
                  }`}
                  alt="thumbnail"
                ></img>
              </a>
            </Box>
          )}
        </>
      ) : (
        <></>
        // <img src={poolDetail?.image} alt="thumbnail" className={'home-image'}></img>
      )}
    </Box>
  );
};
export default Intro;
