/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Empty from '@/components/Empty';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import HorizontalItem from '@/components/Swap/horizontalItem';
import useGetPoolAddress from '@/hooks/contract-operations/pools/v3/useGetPoolAddress';
import useGetPoolInfo from '@/hooks/contract-operations/pools/v3/useGetPoolInfo';
import { IToken } from '@/interfaces/token';
import { formatCurrency } from '@/utils';
import { FeeAmount, TICK_SPACINGS } from '@/utils/constants';
import { composeValidators, required, requiredAmount } from '@/utils/formValidate';
import { priceToTick, tickToPrice } from '@/utils/number';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { isPool, validateMaxRangeAmount, validateMinRangeAmount } from '../utils';
import s from './styles.module.scss';

interface IAddPriceRange {
  loading?: boolean;
}

const AddPriceRange: React.FC<IAddPriceRange> = ({ loading }) => {
  const { call: getPoolAddress } = useGetPoolAddress();
  const { call: getPoolInfo } = useGetPoolInfo();

  const { values } = useFormState();
  const { change, restart } = useForm();

  const [pooling, setPooling] = useState(false);

  let baseToken: IToken = values?.baseToken;
  let quoteToken: IToken = values?.quoteToken;
  const poolAddress: any = values?.poolAddress;
  const fee: FeeAmount = values?.fee;
  const currentPrice: any = values?.currentPrice;
  const tickLower: any = values?.tickLower || '0';
  const tickUpper: any = values?.tickUpper || '0';
  const isRevert: boolean = values?.isRevert;

  [baseToken, quoteToken] = !isRevert
    ? [values?.baseToken, values?.quoteToken]
    : [values?.quoteToken, values?.baseToken];

  useEffect(() => {
    if (Boolean(baseToken) && Boolean(quoteToken)) {
      onGetPool(baseToken, quoteToken);
    }
  }, [values?.baseToken, values?.quoteToken, fee]);

  const onGetPool = async (_tokenA: IToken, _tokenB: IToken) => {
    try {
      setPooling(true);
      const response = await getPoolAddress({
        tokenA: _tokenA,
        tokenB: _tokenB,
        fee: fee,
      });
      change('currentPrice', 0);
      change('currentTick', 0);
      if (isPool(response)) {
        const poolInfo = await getPoolInfo({ poolAddress: response });
        change('currentPrice', poolInfo.currentPrice);
        change('currentTick', poolInfo.currentTick);
      }
      change('poolAddress', response);
    } catch (error) {
    } finally {
      setPooling(false);
    }
  };

  const onChangePriceTick = (type: 'add' | 'minus', name: 'min' | 'max') => {
    let _tick = name === 'min' ? tickLower : tickUpper;

    if (type === 'add') {
      _tick = new BigNumber(_tick).plus(TICK_SPACINGS[fee]).toNumber();
    } else {
      _tick = new BigNumber(_tick).minus(TICK_SPACINGS[fee]).toNumber();
    }

    if (name === 'min') {
      change('tickLower', _tick);
      change('defaultTickLower', _tick);
      change('minPrice', tickToPrice(_tick));
    } else {
      change('tickUpper', _tick);
      change('defaultTickUpper', _tick);
      change('maxPrice', tickToPrice(_tick));
    }
  };

  const onFieldChanged = (_value: any, name: 'min' | 'max') => {
    const _tick = priceToTick(_value, TICK_SPACINGS[fee]);
    const _price = tickToPrice(_tick);

    if (name === 'min') {
      change('tickLower', _tick);
      change('defaultTickLower', _tick);
      change('minPrice', _price);
    } else {
      change('tickUpper', _tick);
      change('defaultTickUpper', _tick);
      change('maxPrice', _price);
    }
  };

  const renderContent = () => {
    if (loading || pooling) {
      return (
        <Flex alignItems={'center'} height={'100%'} justifyContent={'center'}>
          <Spinner color="white" />
        </Flex>
      );
    }

    if (!Boolean(baseToken) || !Boolean(quoteToken)) {
      return (
        <>
          <Empty infoText="Your position will appear here." />
        </>
      );
    }

    if (!isPool(poolAddress)) {
      return (
        <>
          <InputWrapper label={`Set Starting Price`}>
            <Box className={s.formContainer__right__noteWrap}>
              <Text>
                This pool must be initialized before you can add liquidity. To
                initialize, select a starting price for the pool. Then, enter your
                liquidity price range and deposit amount. Gas fees will be higher
                than usual due to the initialization transaction.
              </Text>
            </Box>
            <Box mt={6} />
            <Field
              children={FieldAmount}
              name="currentPrice"
              validate={requiredAmount}
              fieldChanged={(e: any) =>
                change('currentTick', priceToTick(e, TICK_SPACINGS[fee]))
              }
            />
            <Box mt={2} />
            <HorizontalItem
              label={`Current ${baseToken?.symbol} Price:`}
              value={`${formatCurrency(currentPrice)} ${quoteToken?.symbol}`}
              className={s.formContainer__right__currentPrice}
            />
          </InputWrapper>
          <Box mt={8} />
          <InputWrapper label={`Set Price Range`}>
            <Flex mt={4} gap={2} className={s.formContainer__right__rangeContainer}>
              <Box className={s.formContainer__right__rangeContainer__item}>
                <Field
                  label="Min Price"
                  name="minPrice"
                  children={FieldAmount}
                  validate={composeValidators(required, validateMinRangeAmount)}
                  blurFieldChanged={(e: any) => onFieldChanged(e, 'min')}
                  decimals={18}
                  prependComp={
                    <Box
                      className={s.formContainer__right__rangeContainer__rangeButton}
                      onClick={() => onChangePriceTick('minus', 'min')}
                    >
                      <AiOutlineMinus />
                    </Box>
                  }
                  appendComp={
                    <Box
                      className={s.formContainer__right__rangeContainer__rangeButton}
                      onClick={() => onChangePriceTick('add', 'min')}
                    >
                      <AiOutlinePlus />
                    </Box>
                  }
                  note={`${quoteToken.symbol} per ${baseToken.symbol}`}
                />
              </Box>
              <Box className={s.formContainer__right__rangeContainer__item}>
                <Field
                  label="Max Price"
                  name="maxPrice"
                  children={FieldAmount}
                  validate={composeValidators(required, validateMaxRangeAmount)}
                  blurFieldChanged={(e: any) => onFieldChanged(e, 'max')}
                  prependComp={
                    <Box
                      className={s.formContainer__right__rangeContainer__rangeButton}
                      onClick={() => onChangePriceTick('minus', 'max')}
                    >
                      <AiOutlineMinus />
                    </Box>
                  }
                  appendComp={
                    <Box
                      className={s.formContainer__right__rangeContainer__rangeButton}
                      onClick={() => onChangePriceTick('add', 'max')}
                    >
                      <AiOutlinePlus />
                    </Box>
                  }
                  note={`${quoteToken.symbol} per ${baseToken.symbol}`}
                />
              </Box>
            </Flex>
          </InputWrapper>
        </>
      );
    }

    return (
      <>
        <InputWrapper label={`Set Price Range`}>
          <Box mt={4} />
          <Flex
            className={s.formContainer__right__rangeContainer__currentPrice}
            alignItems={'center'}
            gap={2}
            justifyContent={'center'}
          >
            <Text>Current Price:</Text>
            <Text>{formatCurrency(currentPrice)}</Text>
            <Text>
              {quoteToken.symbol} per {baseToken.symbol}
            </Text>
          </Flex>
          <Flex mt={4} gap={2} className={s.formContainer__right__rangeContainer}>
            <Box className={s.formContainer__right__rangeContainer__item}>
              <Field
                label="Min Price"
                name="minPrice"
                children={FieldAmount}
                validate={composeValidators(required, validateMinRangeAmount)}
                blurFieldChanged={(e: any) => onFieldChanged(e, 'min')}
                decimals={18}
                prependComp={
                  <Box
                    className={s.formContainer__right__rangeContainer__rangeButton}
                    onClick={() => onChangePriceTick('minus', 'min')}
                  >
                    <AiOutlineMinus />
                  </Box>
                }
                appendComp={
                  <Box
                    className={s.formContainer__right__rangeContainer__rangeButton}
                    onClick={() => onChangePriceTick('add', 'min')}
                  >
                    <AiOutlinePlus />
                  </Box>
                }
                note={`${quoteToken.symbol} per ${baseToken.symbol}`}
              />
            </Box>
            <Box className={s.formContainer__right__rangeContainer__item}>
              <Field
                label="Max Price"
                name="maxPrice"
                children={FieldAmount}
                validate={composeValidators(required, validateMaxRangeAmount)}
                blurFieldChanged={(e: any) => onFieldChanged(e, 'max')}
                prependComp={
                  <Box
                    className={s.formContainer__right__rangeContainer__rangeButton}
                    onClick={() => onChangePriceTick('minus', 'max')}
                  >
                    <AiOutlineMinus />
                  </Box>
                }
                appendComp={
                  <Box
                    className={s.formContainer__right__rangeContainer__rangeButton}
                    onClick={() => onChangePriceTick('add', 'max')}
                  >
                    <AiOutlinePlus />
                  </Box>
                }
                note={`${quoteToken.symbol} per ${baseToken.symbol}`}
              />
            </Box>
          </Flex>
        </InputWrapper>
      </>
    );
  };

  return renderContent();
};

export default AddPriceRange;
