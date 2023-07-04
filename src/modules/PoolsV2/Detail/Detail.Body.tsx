/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useGetEarnedFeeV3 from '@/hooks/contract-operations/pools/v3/useGetEarnedFee';
import { IToken } from '@/interfaces/token';
import { compareString, formatCurrency, sortAddressPair } from '@/utils';
import { tickToPrice } from '@/utils/number';
import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { AiOutlineSwap } from 'react-icons/ai';
import { SwitchSymbol } from '../Add/Add.Header.SwitchPair';
import PoolsV2PositionStatus from '../PoolsV2.PositionStatus';
import { getPooledAmount, getRangeTick } from '../utils';
import DetailClaimFee from './Detail.ClaimFee';
import DetailImage from './Detail.Image';
import DetailPair from './Detail.Pair';
import { IDetailPositionBase } from './interface';
import s from './styles.module.scss';
import BigNumber from 'bignumber.js';

interface IDetailBody extends IDetailPositionBase {
  handleSubmit: (_: any) => void;
}

const DetailBody: React.FC<IDetailBody> = ({ positionDetail }) => {
  const [fees, setFees] = useState([0, 0]);

  const { restart } = useForm();
  const { values } = useFormState();

  const minPrice = values.minPrice;
  const maxPrice = values.maxPrice;
  const tickLower: any = positionDetail?.tickLower;
  const tickUpper: any = positionDetail?.tickUpper;
  const currentPrice = values.currentPrice;
  const tokenA: IToken = values.tokenA;
  const tokenB: IToken = values.tokenB;
  const isRevert: any = values.isRevert;

  const { call: getEarnedFee } = useGetEarnedFeeV3();

  const currentSelectPair: IToken = values?.currentSelectPair;

  useEffect(() => {
    getEarnedFeeInfo();
  }, [positionDetail]);

  const getEarnedFeeInfo = async () => {
    const res = await getEarnedFee({ tokenId: positionDetail?.tokenId });
    setFees(res);
  };

  const onSelectPair = (_tokenA?: IToken, _tokenB?: IToken) => {
    if (Boolean(_tokenA) && Boolean(_tokenB)) {
      const [token0] = sortAddressPair(_tokenA, _tokenB);

      let isRevert = false;

      if (!compareString(token0.address, tokenA)) {
        isRevert = true;
      }

      const _revertTickLower = isRevert ? -tickUpper : tickLower;
      const _revertTickUpper = isRevert ? -tickLower : tickUpper;

      restart({
        ...values,
        minPrice: tickToPrice(_revertTickLower),
        maxPrice: tickToPrice(_revertTickUpper),
        tokenA: isRevert
          ? positionDetail?.pair?.token1Obj
          : positionDetail?.pair?.token0Obj,
        tokenB: isRevert
          ? positionDetail?.pair?.token0Obj
          : positionDetail?.pair?.token1Obj,
        currentPrice: isRevert
          ? new BigNumber(1).dividedBy(positionDetail?.pair?.price as any).toFixed()
          : positionDetail?.pair?.price,
        currentSelectPair: _tokenA,
        isRevert: isRevert,
      });
    }
  };

  const isRange = getRangeTick(positionDetail)?.isRange;

  return (
    <Grid className={s.container__body__gridContainer}>
      <GridItem area={'g-img'}>
        <DetailImage positionDetail={positionDetail} />
      </GridItem>
      <GridItem area={'g-info'}>
        <Flex className={s.container__body__gridContainer__item}>
          <Box>
            <Text className={s.container__body__gridContainer__title}>
              Liquidity
            </Text>
            <Box mt={6} />
            <DetailPair
              tokenA={tokenA}
              tokenB={tokenB}
              amountValues={
                isRevert
                  ? getPooledAmount(positionDetail).reverse()
                  : getPooledAmount(positionDetail)
              }
              tickRange={
                isRevert
                  ? {
                      ...getRangeTick(positionDetail),
                      percents: getRangeTick(positionDetail)?.percents.reverse(),
                    }
                  : getRangeTick(positionDetail)
              }
            />
          </Box>
          <Box>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Text className={s.container__body__gridContainer__title}>
                Unclaimed fees
              </Text>
              <DetailClaimFee positionDetail={positionDetail} />
            </Flex>
            <Box mt={6} />
            <DetailPair
              tokenA={tokenA}
              tokenB={tokenB}
              amountValues={isRevert ? fees.reverse() : fees}
            />
          </Box>
        </Flex>
      </GridItem>
      <GridItem
        className={s.container__body__gridContainer__itemRangePrice}
        area={'g-range'}
      >
        <Flex gap={2} alignItems={'center'} justifyContent={'space-between'}>
          <Flex gap={2} alignItems={'center'}>
            <Text className={s.container__body__gridContainer__title}>
              Range Price
            </Text>
            <PoolsV2PositionStatus positionDetail={positionDetail} />
          </Flex>
          <SwitchSymbol
            tokenA={positionDetail?.pair?.token0Obj}
            tokenB={positionDetail?.pair?.token1Obj}
            currentSelectPair={currentSelectPair}
            onSelectPair={onSelectPair}
          />
        </Flex>
        <Box mt={6} />
        <Flex alignItems={'center'} gap={8}>
          <Flex className={s.itemRangeContainer}>
            <Text>Min price</Text>
            <Text className={s.itemRangeContainer__price}>
              {formatCurrency(minPrice)}
            </Text>
            <Text>
              {tokenA.symbol} per {tokenB.symbol}
            </Text>
            {isRange && (
              <Text className={s.itemRangeContainer__note}>
                Your position will be 100% {tokenB.symbol} at this price.
              </Text>
            )}
          </Flex>
          <Box>
            <AiOutlineSwap color="#A0AEC0" style={{ fontSize: '24px' }} />
          </Box>
          <Flex className={s.itemRangeContainer}>
            <Text>Max price</Text>
            <Text className={s.itemRangeContainer__price}>
              {formatCurrency(maxPrice)}
            </Text>
            <Text>
              {tokenA.symbol} per {tokenB.symbol}
            </Text>
            {isRange && (
              <Text className={s.itemRangeContainer__note}>
                Your position will be 100% {tokenA.symbol} at this price.
              </Text>
            )}
          </Flex>
        </Flex>
        <Box mt={3} />
        <Flex className={s.itemRangeContainer}>
          <Text>Current price</Text>
          <Text className={s.itemRangeContainer__price}>
            {formatCurrency(currentPrice)}
          </Text>
          <Text>
            {tokenA.symbol} per {tokenB.symbol}
          </Text>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default DetailBody;
