import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { CDN_URL } from '@/configs';
import React from 'react';
import styles from './styles.module.scss';
import px2rem from '@/utils/px2rem';

const DATA = [
  {
    img: `${CDN_URL}/icons/fund-project.svg`,
    title: 'Keep building',
    desc: 'Provide builders the necessary support to make their visions a reality.',
  },
  {
    img: `${CDN_URL}/icons/reward.svg`,
    title: 'DYOR',
    desc: 'Builders are expected to keep supporters updated on a regular basis, even though reward values may not be guaranteed.',
  },
  {
    img: `${CDN_URL}/icons/charge1.svg`,
    title: 'Reduce risk',
    desc: 'Contributions from supporters will be processed if the project meets its funding goal within the campaign deadline.',
  },
];

const Usp = () => {
  return (
    <Box className={styles.wrapper}>
      <Flex flexDirection={['column', 'row']} gap={8}>
        {DATA.map((d) => {
          return (
            <Flex flex={1} gap={4} key={d?.img}>
              <Center
                bgColor={'#1E1E22'}
                w={px2rem(48)}
                minW={px2rem(48)}
                h={px2rem(48)}
                minH={px2rem(48)}
                borderRadius={px2rem(8)}
              >
                <img src={d?.img} alt={d?.img || 'default-icon'} />
              </Center>
              <Flex direction={'column'} gap={1}>
                <Text fontSize={px2rem(16)} fontWeight={'500'}>
                  {d?.title}
                </Text>
                <Text
                  fontSize={px2rem(14)}
                  fontWeight={'400'}
                  color={'rgba(255, 255, 255, 0.7)'}
                >
                  {d?.desc}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};
export default Usp;
