import {IPosition} from '@/interfaces/position';
import {getTokenIconUrl} from '@/utils';
import {Box, Flex, Text} from '@chakra-ui/react';
import React from 'react';
import s from './styles.module.scss';
import PoolsV2PositionStatus from '../PoolsV2.PositionStatus';

interface IDetailHeader {
  positionDetail?: IPosition;
}

const RemoveHeader: React.FC<IDetailHeader> = ({ positionDetail }) => {
  return (
    <Box className={s.container__header}>
      {positionDetail && (
        <Flex alignItems={'center'} gap={4} justifyContent={'space-between'}>
          <Flex gap={2} className={s.container__header__topInfo} flex={1}>
            <Flex className={s.container__header__topInfo__groupIcon}>
              <img src={getTokenIconUrl(positionDetail.pair?.token0Obj)} />
              <img src={getTokenIconUrl(positionDetail.pair?.token1Obj)} />
            </Flex>
            <Text className={s.container__header__topInfo__name}>
              {positionDetail.pair?.token0Obj?.symbol} /{' '}
              {positionDetail.pair?.token1Obj?.symbol}
            </Text>
          </Flex>
          <PoolsV2PositionStatus positionDetail={positionDetail} />
        </Flex>
      )}
    </Box>
  );
};

export default RemoveHeader;
