/* eslint-disable @typescript-eslint/no-explicit-any */
import { IToken } from '@/interfaces/token';
import { compareString, sortAddressPair } from '@/utils';
import { tickToPrice } from '@/utils/number';
import { Box, Flex, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect } from 'react';
import { useField, useForm, useFormState } from 'react-final-form';
import s from './styles.module.scss';

const AddHeaderSwitchPair = () => {
  const { change, batch } = useForm();
  const { values } = useFormState();
  const tickLower = useField('defaultTickLower').input.value;
  const tickUpper = useField('defaultTickUpper').input.value;
  const baseToken: IToken = values?.baseToken;
  const quoteToken: IToken = values?.quoteToken;
  const currentSelectPair: IToken = values?.currentSelectPair;
  const currentPrice: any = values?.currentPrice;
  const currentTick: any = values?.currentTick;

  useEffect(() => {
    if (currentSelectPair) {
      checkRevert();
    }
  }, [currentSelectPair]);

  const checkRevert = useCallback(() => {
    const [token0] = sortAddressPair(baseToken, quoteToken);

    let isRevert = false;

    if (!compareString(token0.address, currentSelectPair.address)) {
      isRevert = true;
    }

    const _revertTickLower = isRevert ? -tickUpper : tickLower;
    const _revertTickUpper = isRevert ? -tickLower : tickUpper;

    batch(() => {
      change('isRevert', isRevert);
      change('currentPrice', new BigNumber(1).dividedBy(currentPrice).toString());
      change('currentTick', isRevert ? -currentTick : currentTick);
      change('tickLower', _revertTickLower);
      change('minPrice', tickToPrice(_revertTickLower));
      change('tickUpper', _revertTickUpper);
      change('maxPrice', tickToPrice(_revertTickUpper));
    });
  }, [values, currentSelectPair]);

  if (!Boolean(baseToken) || !Boolean(quoteToken)) {
    return null;
  }

  if (compareString(baseToken.address, quoteToken.address)) {
    return null;
  }

  return (
    <Flex className={s.container__top_body__right__switchContainer}>
      <Box
        className={
          compareString(currentSelectPair.symbol, baseToken.symbol)
            ? s.container__top_body__right__switchContainer__active
            : ''
        }
        onClick={() => change('currentSelectPair', baseToken)}
      >
        <Text>{baseToken.symbol}</Text>
      </Box>
      <Box
        className={
          compareString(currentSelectPair.symbol, quoteToken.symbol)
            ? s.container__top_body__right__switchContainer__active
            : ''
        }
        onClick={() => change('currentSelectPair', quoteToken)}
      >
        <Text>{quoteToken.symbol}</Text>
      </Box>
    </Flex>
  );
};

export default AddHeaderSwitchPair;
