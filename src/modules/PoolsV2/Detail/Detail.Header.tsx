import FiledButton from '@/components/Swap/button/filedButton';
import { ROUTE_PATH } from '@/constants/route-path';
import { IPosition } from '@/interfaces/position';
import { getTokenIconUrl } from '@/utils';
import { Box, Flex, Icon, IconButton, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import PoolsV2PositionStatus from '../PoolsV2.PositionStatus';
import DetailIncrease from './Detail.Increase';
import s from './styles.module.scss';

interface IDetailHeader {
  positionDetail?: IPosition;
}

const DetailHeader: React.FC<IDetailHeader> = ({ positionDetail }) => {
  const router = useRouter();
  return (
    <Box className={s.container__header}>
      <Flex alignItems={'center'} gap={1}>
        <IconButton
          borderWidth={0}
          colorScheme="whiteAlpha"
          variant="outline"
          _hover={{
            backgroundColor: 'transparent',
          }}
          icon={
            <Icon
              as={BiChevronLeft}
              color={'rgba(255, 255, 255, 0.5)'}
              fontSize={'30px'}
            />
          }
          onClick={() => router.replace(`${ROUTE_PATH.POOLS_V2}`)}
          aria-label={''}
        />
        <Text color={'rgba(255, 255, 255, 0.5)'}>Back to Pools</Text>
      </Flex>

      <Box mt={4} />

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
            <Box className={s.container__percent}>
              {positionDetail?.fee
                ? new BigNumber(positionDetail?.fee).dividedBy(10000).toString()
                : '0'}
              %
            </Box>
            <PoolsV2PositionStatus positionDetail={positionDetail} />
          </Flex>
          <Flex gap={2}>
            <DetailIncrease positionDetail={positionDetail} />
            <FiledButton
              isDisabled={!Boolean(positionDetail)}
              onClick={() =>
                router.push(`${ROUTE_PATH.POOLS_V2_REMOVE}/${positionDetail?.id}`)
              }
              btnSize="l"
            >
              Remove Liquidity
            </FiledButton>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default DetailHeader;
