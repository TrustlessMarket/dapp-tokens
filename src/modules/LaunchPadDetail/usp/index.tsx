import {Box, Center, Flex, Text} from "@chakra-ui/react";
import {CDN_URL} from "@/configs";
import React from "react";
import styles from "./styles.module.scss";
import px2rem from "@/utils/px2rem";

const DATA = [
  {
    img: `${CDN_URL}/icons/fund-project.svg`,
    title: 'Fund projects',
    desc: 'We connects creators with backers to fund projects.'
  },
  {
    img: `${CDN_URL}/icons/reward.svg`,
    title: 'Reward',
    desc: 'The value of your reward tokens fluctuate with the market. However, creators will always keep you up to date.'
  },
  {
    img: `${CDN_URL}/icons/charge1.svg`,
    title: 'Charge',
    desc: 'You’re only charged if the project meets its funding goal by the campaign deadline.'
  },
]

const Usp = () => {
  return (
    <Box className={styles.wrapper}>
      <Flex gap={8}>
        {
          DATA.map((d => {
            return (
              <Flex flex={1} gap={4} key={d?.img}>
                <Center
                  bgColor={"#1E1E22"}
                  w={px2rem(48)}
                  minW={px2rem(48)}
                  h={px2rem(48)}
                  minH={px2rem(48)}
                  borderRadius={px2rem(8)}
                >
                  <img
                    src={
                      d?.img
                    }
                    alt={d?.img || 'default-icon'}
                  />
                </Center>
                <Flex direction={"column"}>
                  <Text fontSize={px2rem(16)} fontWeight={"500"}>{d?.title}</Text>
                  <Text fontSize={px2rem(14)} fontWeight={"400"} color={'rgba(255, 255, 255, 0.7)'}>{d?.desc}</Text>
                </Flex>
              </Flex>
            )
          }))
        }
      </Flex>
    </Box>
  )
};
export default Usp;