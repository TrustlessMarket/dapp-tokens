import {getTokenIconUrl} from '@/utils';
import {Box, Flex, Text} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import s from './styles.module.scss';
import {ILiquidity} from "@/interfaces/liquidity";

interface ITopPoolsPair {
  poolDetail?: ILiquidity;
}

const TopPoolsPair: React.FC<ITopPoolsPair> = ({ poolDetail }) => {
  return (
    <Box className={s.poolContainer__header}>
      <Flex gap={2} className={s.poolContainer__header__topInfo} flex={1}>
        <Flex className={s.poolContainer__header__topInfo__groupIcon}>
          <img src={getTokenIconUrl(poolDetail?.token0Obj)} />
          <img src={getTokenIconUrl(poolDetail?.token1Obj)} />
        </Flex>
        <Text className={s.poolContainer__header__topInfo__name}>
          {poolDetail?.token0Obj?.symbol} /{' '}
          {poolDetail?.token1Obj?.symbol}
        </Text>
        <Box className={s.poolContainer__percent}>
          {poolDetail?.fee
            ? new BigNumber(poolDetail?.fee)
              .dividedBy(10000)
              .toString()
            : '0'}
          %
        </Box>
      </Flex>
    </Box>
  );
};

export default TopPoolsPair;
