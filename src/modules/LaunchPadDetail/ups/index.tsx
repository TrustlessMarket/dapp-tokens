import {Flex, Text} from "@chakra-ui/react";
import {CDN_URL} from "@/configs";
import React from "react";
import styles from "./styles.module.scss";
import BodyContainer from "@/components/Swap/bodyContainer";

const DATA = [
  {
    img: ``,
    desc: 'We connects creators with backers to fund projects.'
  },
  {
    img: ``,
    desc: 'Reward values aren’t guaranteed, but creators must regularly update backers.'
  },
  {
    img: ``,
    desc: 'You’re only charged if the project meets its funding goal by the campaign deadline.'
  },
]

const Usp = () => {
  return (
    <BodyContainer className={styles.wrapper}>
      <Flex className={"max-content"} gap={8}>
        {
          DATA.map((d => {
            return (
              <Flex flex={1} gap={4} key={d?.img}>
                <img
                  src={
                    d?.img ||
                    `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                  }
                  alt={d?.img || 'default-icon'}
                />
                <Text>{d?.desc}</Text>
              </Flex>
            )
          }))
        }
      </Flex>
    </BodyContainer>
  )
};
export default Usp;