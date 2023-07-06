/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FiledButton from '@/components/Swap/button/filedButton';
import HorizontalItem from '@/components/Swap/horizontalItem';
import { IToken } from '@/interfaces/token';
import {
  compareString,
  formatCurrency,
  getTokenIconUrl,
  sortAddressPair,
} from '@/utils';
import { Avatar, AvatarGroup, Box, Divider, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import DetailPair from '../Detail/Detail.Pair';
import sDetail from '../Detail/styles.module.scss';
import PoolsV2PositionStatus from '../PoolsV2.PositionStatus';
import { SwitchSymbol } from './Add.Header.SwitchPair';
import s from './styles.module.scss';

interface IAddConfirm {
  values: {
    baseToken?: IToken | undefined;
    quoteToken?: IToken | undefined;
    tickUpper: any;
    tickLower: any;
    currentTick: any;
    baseAmount: any;
    quoteAmount: any;
    fee: any;
    reFee: any;
    currentSelectPair: any;
    minPrice: any;
    maxPrice: any;
    currentPrice: any;
  };
  onClose: () => void;
  onSubmit?: (_: any) => void;
  onSelectPair?: (_1?: IToken, _2?: IToken) => void;
}

const AddConfirm: React.FC<IAddConfirm> = ({
  values,
  onClose,
  onSubmit,
  onSelectPair,
}) => {
  const {
    baseToken,
    quoteToken,
    tickUpper,
    tickLower,
    currentTick,
    quoteAmount,
    baseAmount,
    reFee,
    currentSelectPair,
    minPrice,
    maxPrice,
    currentPrice,
  } = values;

  const [selectPair, setSelectPair] = useState(currentSelectPair);

  let [tokenA, tokenB] = [baseToken, quoteToken];

  const [token0] = sortAddressPair(baseToken, quoteToken);

  if (!compareString(token0.address, baseToken?.address)) {
    [tokenA, tokenB] = [quoteToken, baseToken];
  }

  const onHandleSelectPair = (tk1?: IToken, tk2?: IToken) => {
    setSelectPair(tk1);
    onSelectPair?.(tk1, tk2);
  };

  const onClick = () => {
    onSubmit?.(values);
    onClose();
  };

  const isRange = true;

  return (
    <Box className={s.confirmAddLiquidityContainer}>
      <Flex gap={4} alignItems={'center'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <AvatarGroup size="sm">
            <Avatar src={getTokenIconUrl(tokenA)} />
            <Avatar src={getTokenIconUrl(tokenB)} />
          </AvatarGroup>
          <Text className={s.confirmAddLiquidityContainer__title}>
            {tokenA?.symbol} / {tokenB?.symbol}
          </Text>
        </Flex>
        <PoolsV2PositionStatus
          positionDetail={{
            tickUpper,
            tickLower,
            pair: {
              tick: currentTick,
            },
          }}
          amounts={[baseAmount, quoteAmount]}
        />
      </Flex>
      <Box mt={6} />
      <DetailPair
        tokenA={tokenA}
        tokenB={tokenB}
        amountValues={[baseAmount, quoteAmount]}
      />
      <Box mt={3} />
      <HorizontalItem
        className={s.confirmAddLiquidityContainer__horizontalItem}
        label={'Free Tier'}
        value={`${reFee / 10000}%`}
      />
      <Divider borderColor={'#718096'} />
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Text color={'#fff'}>Price Range</Text>
        <SwitchSymbol
          tokenA={tokenA}
          tokenB={tokenB}
          onSelectPair={onHandleSelectPair}
          currentSelectPair={selectPair}
        />
      </Flex>
      <Box mt={4} />
      <Flex gap={4}>
        <Flex className={sDetail.itemRangeContainer}>
          <Text>Min price</Text>
          <Text className={sDetail.itemRangeContainer__price}>
            {formatCurrency(minPrice)}
          </Text>
          <Text>
            {tokenB?.symbol} per {tokenA?.symbol}
          </Text>
          {isRange && (
            <Text textAlign={'center'} className={sDetail.itemRangeContainer__note}>
              Your position will be 100% {tokenB?.symbol} at this price.
            </Text>
          )}
        </Flex>
        <Flex className={sDetail.itemRangeContainer}>
          <Text>Max price</Text>
          <Text className={sDetail.itemRangeContainer__price}>
            {formatCurrency(maxPrice)}
          </Text>
          <Text>
            {tokenB?.symbol} per {tokenA?.symbol}
          </Text>
          {isRange && (
            <Text textAlign={'center'} className={sDetail.itemRangeContainer__note}>
              Your position will be 100% {tokenA?.symbol} at this price.
            </Text>
          )}
        </Flex>
      </Flex>
      <Box mt={3} />
      <Flex className={sDetail.itemRangeContainer}>
        <Text>Current price</Text>
        <Text className={sDetail.itemRangeContainer__price}>
          {formatCurrency(currentPrice)}
        </Text>
        <Text>
          {tokenB?.symbol} per {tokenA?.symbol}
        </Text>
      </Flex>
      <Box mt={6} />
      {onSubmit && (
        <FiledButton btnSize="h" onClick={onClick}>
          Add
        </FiledButton>
      )}
    </Box>
  );
};

export default AddConfirm;
