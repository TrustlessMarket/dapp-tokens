/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Center, Flex, Icon, Td, Text, Tr } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { ILiquidity } from '@/interfaces/liquidity';
import px2rem from '@/utils/px2rem';
import TopPoolsPair from '@/modules/PoolsV2/TopPools/TopPools.Pair';
import { formatCurrency, getTokenIconUrl } from '@/utils';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { IPosition } from '@/interfaces/position';
import { ROUTE_PATH } from '@/constants/route-path';
import ListTable from '@/components/Swap/listTable';
import { useRouter } from 'next/router';
import { tickToPrice } from '@/utils/number';
import { getPooledAmount } from '@/modules/PoolsV2/utils';
import PoolsV2PositionStatus from '@/modules/PoolsV2/PoolsV2.PositionStatus';
import PositionRemove from '@/modules/PoolsV2/MyPositions/Position.Remove';
import { useWindowSize } from '@trustless-computer/dapp-core';
import InfoTooltip from '@/components/Swap/infoTooltip';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useAppSelector } from '@/state/hooks';
import { currentPoolPathSelector } from '@/state/pnftExchange';

interface ITopPoolsItem {
  poolDetail?: ILiquidity;
  columns?: [];
}

const TopPoolsItem: React.FC<ITopPoolsItem> = ({ poolDetail, columns }) => {
  const currentPoolPath = useAppSelector(currentPoolPathSelector);

  const router = useRouter();
  const [showPosition, setShowPositions] = useState(false);

  const hasPositions = useMemo(() => {
    return (poolDetail?.positions?.length || 0) > 0;
  }, [JSON.stringify(poolDetail?.positions)]);

  const { mobileScreen } = useWindowSize();

  const columnsPosition = useMemo(() => {
    return [
      {
        id: 'min_price',
        label: 'Min Price',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          color: '#FFFFFF',
          borderBottom: 'none',
          backgroundColor: '#1E1E22',
        },
        render(row: IPosition) {
          return (
            <Flex direction={'column'} fontSize={px2rem(14)}>
              {formatCurrency(tickToPrice(row?.tickLower || 0))}
            </Flex>
          );
        },
      },
      {
        id: 'max_price',
        label: 'Max Price',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          color: '#FFFFFF',
          borderBottom: 'none',
          backgroundColor: '#1E1E22',
        },
        render(row: IPosition) {
          return (
            <Flex direction={'column'} fontSize={px2rem(14)}>
              {formatCurrency(tickToPrice(row?.tickUpper || 0))}
            </Flex>
          );
        },
      },
      {
        id: 'tvl',
        label: 'TVL',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          color: '#FFFFFF',
          borderBottom: 'none',
          backgroundColor: '#1E1E22',
        },
        render(row: IPosition) {
          const pooledAmount = getPooledAmount(row);
          const token0Obj = row?.pair?.token0Obj;
          const token1Obj = row?.pair?.token1Obj;
          return (
            <Flex direction={'column'} fontSize={px2rem(14)}>
              <Flex gap={1} alignItems={'center'}>
                <Text>{formatCurrency(pooledAmount[0]).toString()}</Text>
                <img
                  src={getTokenIconUrl(token0Obj)}
                  alt={token0Obj?.thumbnail || 'default-icon'}
                  className={'avatar2'}
                  title={token0Obj?.symbol}
                />
              </Flex>
              <Flex gap={1} alignItems={'center'}>
                <Text>{formatCurrency(pooledAmount[1]).toString()}</Text>
                <img
                  src={getTokenIconUrl(token1Obj)}
                  alt={token1Obj?.thumbnail || 'default-icon'}
                  className={'avatar2'}
                  title={token1Obj?.symbol}
                />
              </Flex>
            </Flex>
          );
        },
      },
      {
        id: 'action',
        label: ' ',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          color: '#FFFFFF',
          borderBottom: 'none',
          backgroundColor: '#1E1E22',
        },
        render(row: IPosition) {
          return <PoolsV2PositionStatus positionDetail={row} />;
        },
      },
      {
        id: 'actions',
        label: ' ',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
        },
        config: {
          color: '#FFFFFF',
          borderBottom: 'none',
          backgroundColor: '#1E1E22',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
        },
        render(row: IPosition) {
          return (
            <Flex gap={4} justifyContent={'center'}>
              <PositionRemove positionDetail={row} />
            </Flex>
          );
        },
      },
    ];
  }, [mobileScreen, JSON.stringify(poolDetail?.positions)]);

  return (
    <>
      <Tr
        onClick={() => hasPositions && setShowPositions(!showPosition)}
        cursor={hasPositions ? 'pointer' : 'auto'}
        bg={showPosition ? '#1e1e22' : 'none'}
        _hover={{
          bg: '#1e1e22',
        }}
      >
        <Td borderColor={'rgba(255,255,255,0.1)'}>
          <Flex fontSize={px2rem(14)} alignItems={'center'} gap={2}>
            <TopPoolsPair poolDetail={poolDetail} />
          </Flex>
        </Td>
        <Td color={'#FFFFFF'} borderColor={'rgba(255,255,255,0.1)'}>
          <Text fontSize={px2rem(14)} textAlign={'left'}>
            ${formatCurrency(poolDetail?.liquidityUsd || 0, 2)}
          </Text>
        </Td>
        <Td color={'#FFFFFF'} borderColor={'rgba(255,255,255,0.1)'}>
          <Text fontSize={px2rem(14)} textAlign={'left'}>
            ${formatCurrency(poolDetail?.usdVolume || 0, 2)}
          </Text>
        </Td>
        <Td color={'#FFFFFF'} borderColor={'rgba(255,255,255,0.1)'}>
          <Text fontSize={px2rem(14)} textAlign={'left'}>
            ${formatCurrency(poolDetail?.usdTotalVolume || 0, 2)}
          </Text>
        </Td>
        <Td borderColor={'rgba(255,255,255,0.1)'}>
          <Flex gap={2} justifyContent={'space-between'} alignItems={'center'}>
            <InfoTooltip label={'New Position'}>
              <Center
                cursor={'pointer'}
                fontSize={'24px'}
                _hover={{
                  color: '#0072ff',
                }}
                color="#FFFFFF"
              >
                <AiOutlinePlusCircle
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    router.replace(
                      `${currentPoolPath}/add/${poolDetail?.token0Obj?.address}/${poolDetail?.token1Obj?.address}/${poolDetail?.fee}`,
                    );
                  }}
                />
              </Center>
            </InfoTooltip>
            {hasPositions && (
              <Icon
                as={showPosition ? BiChevronUp : BiChevronDown}
                color={'#919AB0'}
                fontSize={px2rem(24)}
              />
            )}
          </Flex>
        </Td>
      </Tr>
      {showPosition && (
        <Tr>
          <Td color={'#FFF'} colSpan={5} borderColor={'rgba(255,255,255,0.1)'}>
            <ListTable
              // noHeader={true}
              data={poolDetail?.positions}
              columns={columnsPosition}
              showEmpty={false}
              onItemClick={(e: IPosition) => {
                return router.push(`${currentPoolPath}/${e.id}`);
              }}
            />
          </Td>
        </Tr>
      )}
    </>
  );
};

export default TopPoolsItem;
