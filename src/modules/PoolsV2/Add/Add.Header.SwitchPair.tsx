/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTE_PATH } from '@/constants/route-path';
import { IToken } from '@/interfaces/token';
import { compareString, sortAddressPair } from '@/utils';
import { tickToPrice } from '@/utils/number';
import { Box, Flex, Text } from '@chakra-ui/react';
import { isNumber } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useField, useForm, useFormState } from 'react-final-form';
import s from './styles.module.scss';
import { isPool } from '../utils';

const AddHeaderSwitchPair = () => {
  const router = useRouter();
  const { change } = useForm();
  const { values } = useFormState();
  const tickLower = useField('defaultTickLower').input.value;
  const tickUpper = useField('defaultTickUpper').input.value;
  const baseToken: IToken = values?.baseToken;
  const quoteToken: IToken = values?.quoteToken;
  const currentSelectPair: IToken = values?.currentSelectPair;
  const currentTick: any = isNumber(values?.currentTick)
    ? Number(values?.currentTick)
    : 0;
  const baseAmount: any = values?.baseAmount;
  const quoteAmount: any = values?.quoteAmount;
  const poolAddress: any = values?.poolAddress;

  useEffect(() => {
    if (poolAddress && currentSelectPair && baseToken && quoteToken) {
      checkRevert();
    }
  }, [poolAddress, currentSelectPair, baseToken, quoteToken]);

  const checkRevert = useCallback(() => {
    const [token0] = sortAddressPair(baseToken, quoteToken);

    let isRevert = false;

    if (!compareString(token0.address, currentSelectPair.address)) {
      isRevert = true;
    }

    if (isPool(poolAddress)) {
      const _revertTickLower = isRevert ? -tickUpper : tickLower;

      const _revertTickUpper = isRevert ? -tickLower : tickUpper;
      change('currentTick', isRevert ? -currentTick : currentTick);
      change('tickLower', _revertTickLower);
      change('minPrice', tickToPrice(_revertTickLower));
      change('tickUpper', _revertTickUpper);
      change('maxPrice', tickToPrice(_revertTickUpper));
    }

    change('isRevert', isRevert);
    change('baseAmount', quoteAmount);
    change('quoteAmount', baseAmount);
  }, [currentSelectPair, currentTick]);

  const onChangeRouter = (_tkA?: IToken, _tkB?: IToken) => {
    return router.replace(
      `${ROUTE_PATH.POOLS_V2_ADD}/${_tkA?.address}/${_tkB?.address}`,
    );
  };

  if (!Boolean(baseToken) || !Boolean(quoteToken)) {
    return null;
  }

  if (compareString(baseToken.address, quoteToken.address)) {
    return null;
  }

  const [_tokenA, _tokenB] = sortAddressPair(baseToken, quoteToken);

  return (
    <SwitchSymbol
      tokenA={_tokenA}
      tokenB={_tokenB}
      currentSelectPair={currentSelectPair}
      onSelectPair={onChangeRouter}
    />
  );
};

export const SwitchSymbol = ({
  tokenA,
  tokenB,
  currentSelectPair,
  onSelectPair,
}: {
  tokenA: IToken | undefined;
  tokenB: IToken | undefined;
  currentSelectPair: IToken;
  onSelectPair: (_1?: IToken, _2?: IToken) => void;
}) => {
  const selectPair = (_tokenA?: IToken, _tokenB?: IToken) => {
    onSelectPair?.(_tokenA, _tokenB);
  };

  if (Boolean(tokenA) && Boolean(tokenB)) {
    return (
      <Flex className={s.switchContainer}>
        <Box
          className={
            compareString(currentSelectPair.symbol, tokenA?.symbol)
              ? s.switchContainer__active
              : ''
          }
          onClick={() => selectPair(tokenA, tokenB)}
        >
          <Text>{tokenA?.symbol}</Text>
        </Box>
        <Box
          className={
            compareString(currentSelectPair.symbol, tokenB?.symbol)
              ? s.switchContainer__active
              : ''
          }
          onClick={() => selectPair(tokenB, tokenA)}
        >
          <Text>{tokenB?.symbol}</Text>
        </Box>
      </Flex>
    );
  }

  return null;
};

export default AddHeaderSwitchPair;
