/* eslint-disable @typescript-eslint/no-explicit-any */
import { IToken } from '@/interfaces/token';
import { getTokenRate } from '@/services/bitcoin';
import { compareString, convertWrappedToToken, sortAddressPair } from '@/utils';
import { Box, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import s from './styles.module.scss';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { selectPnftExchange } from '@/state/pnftExchange';
import { useAppSelector } from '@/state/hooks';
import useGetReserves from '@/hooks/contract-operations/swap/useReserves';
import useGetPair from '@/hooks/contract-operations/swap/useGetPair';

const SuggestBestAmount = ({
  baseToken,
  quoteToken,
}: {
  baseToken: IToken | null;
  quoteToken: IToken | null;
}) => {
  const configs = useAppSelector(selectPnftExchange).configs;
  const swapFee = configs?.swapFee || 0.3;
  const [marketRate, setMarketRate] = useState('0');

  const refPair = useRef('');
  const refLoopGetRate = useRef(0);

  const { call: getReserves } = useGetReserves();
  const { call: getPair } = useGetPair();

  useEffect(() => {
    if (baseToken?.address && quoteToken?.address) {
      refLoopGetRate.current = 0;
      fetchTokenRate(baseToken, quoteToken);
    }
  }, [baseToken?.address, quoteToken?.address]);

  const getPairInfo = async (_baseToken: IToken, _quoteToken: IToken) => {
    try {
      if (!_baseToken?.symbol || !_quoteToken?.symbol) {
        return null;
      }

      const tokenPair: any = await getPair({
        tokenA: _baseToken,
        tokenB: _quoteToken,
      });

      if (tokenPair) {
        const _reserveInfos: any = await getReserves({
          address: tokenPair,
        });

        bestAmount(_baseToken, _quoteToken, _reserveInfos);
      }
    } catch (error) {}
  };

  const fetchTokenRate = async (_baseToken: IToken, _quoteToken: IToken) => {
    if (!_baseToken?.symbol || !_quoteToken?.symbol) {
      return null;
    }

    try {
      const rate: any = await getTokenRate(
        `${convertWrappedToToken(_baseToken?.symbol)}${convertWrappedToToken(
          _quoteToken?.symbol,
        )}`,
      );

      setMarketRate(rate);
      refPair.current = `${convertWrappedToToken(
        _baseToken?.symbol,
      )}${convertWrappedToToken(_quoteToken?.symbol)}`;
      getPairInfo(_baseToken, _quoteToken);
    } catch (error) {
      console.log('error', error);

      if (refLoopGetRate.current < 1) {
        setMarketRate('0');
        refLoopGetRate.current = refLoopGetRate.current + 1;
        fetchTokenRate(_quoteToken, _baseToken);
      }
    }
  };

  const bestAmount = (_baseToken: IToken, _quoteToken: IToken, resReserve: any) => {
    const amount = 1;

    const [token1, token2] = sortAddressPair(_baseToken, _quoteToken);

    const _reserveIn = compareString(token1.address, _baseToken.address)
      ? resReserve._reserve0
      : resReserve._reserve1;
    const _reserveOut = compareString(token2.address, _quoteToken.address)
      ? resReserve._reserve1
      : resReserve._reserve0;

    const amountIn = new BigNumber(amount);
    const reserveIn = new BigNumber(
      Web3.utils.fromWei(Web3.utils.toBN(_reserveIn || 0), 'ether').toString(),
    );
    const reserveOut = new BigNumber(
      Web3.utils.fromWei(Web3.utils.toBN(_reserveOut || 0), 'ether').toString(),
    );
    if (amountIn.lte(0) || reserveIn.lte(0) || reserveOut.lte(0)) {
      return;
    }

    const baseAmount = getBaseAmountOut(amountIn, reserveIn, reserveOut);
    console.log('bestAmount', baseAmount.toString());

    const rate = new BigNumber(baseAmount)
      .div(amount)
      .decimalPlaces(_baseToken?.decimal || 18);

    console.log(refPair.current);

    console.log('bestAmount', rate.toString());
  };

  const getBaseAmountOut = (
    amountIn: BigNumber,
    reserveIn: BigNumber,
    reserveOut: BigNumber,
  ): BigNumber => {
    try {
      const amountInWithFee = amountIn.multipliedBy(1000 + swapFee * 10);
      const numerator = amountInWithFee.multipliedBy(reserveOut);
      const denominator = reserveIn.multipliedBy(1000).plus(amountInWithFee);
      const amountOut = numerator.div(denominator).decimalPlaces(18);

      return amountOut;
    } catch (err: any) {
      return new BigNumber(0);
    }
  };

  if (!baseToken?.address || !quoteToken?.address || !Boolean(Number(marketRate))) {
    return null;
  }

  return (
    <>
      <Box mt={2} />
      <Box className={s.bestAmount}>
        <Text className={s.bestAmount__label}>Best Amount:</Text>
      </Box>
    </>
  );
};

export default SuggestBestAmount;
