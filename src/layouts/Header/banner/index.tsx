import {Flex, Link as LinkText, Text} from "@chakra-ui/react";
import styles from './styles.module.scss';
import React, {useEffect, useState} from "react";
import cx from 'classnames';
import {CDN_URL} from "@/configs";

const Banner = () => {
  const [isActive, setIsActive] = useState(false);

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
      height={10}
      alignItems="center"
      justifyContent="center"
      className={cx(styles.wrapper, isActive ? styles.active : '')}
    >
      <Flex
        fontWeight="medium"
        fontSize="sm"
        color={'white'}
        alignItems={"center"}
        gap={1}
      >
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