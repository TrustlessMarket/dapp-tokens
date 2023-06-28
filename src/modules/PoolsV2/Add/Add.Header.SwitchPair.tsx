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

const AddHeaderSwitchPair = () => {
  const router = useRouter();
  const { change, batch } = useForm();
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

  console.log('poolAddress', poolAddress);

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

    console.log('isRevert', isRevert);

    console.log('isRevert', isRevert ? -currentTick : currentTick);

    const _revertTickLower = isRevert ? -tickUpper : tickLower;
    const _revertTickUpper = isRevert ? -tickLower : tickUpper;

    batch(() => {
      change('isRevert', isRevert);
      change('currentTick', isRevert ? -currentTick : currentTick);
      change('tickLower', _revertTickLower);
      change('minPrice', tickToPrice(_revertTickLower));
      change('tickUpper', _revertTickUpper);
      change('maxPrice', tickToPrice(_revertTickUpper));
      change('baseAmount', quoteAmount);
      change('quoteAmount', baseAmount);
    });
  }, [currentSelectPair, currentTick]);

  const onChangeRouter = (_tkA: IToken, _tkB: IToken) => {
    return router.replace(
      `${ROUTE_PATH.POOLS_V2_ADD}/${_tkA.address}/${_tkB.address}`,
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
    <Flex className={s.container__top_body__right__switchContainer}>
      <Box
        className={
          compareString(currentSelectPair.symbol, _tokenA.symbol)
            ? s.container__top_body__right__switchContainer__active
            : ''
        }
        onClick={() => onChangeRouter(_tokenA, _tokenB)}
      >
        <Text>{_tokenA.symbol}</Text>
      </Box>
      <Box
        className={
          compareString(currentSelectPair.symbol, _tokenB.symbol)
            ? s.container__top_body__right__switchContainer__active
            : ''
        }
        onClick={() => onChangeRouter(_tokenB, _tokenA)}
      >
        <Text>{_tokenB.symbol}</Text>
      </Box>
    </Flex>
  );
};

export default AddHeaderSwitchPair;
