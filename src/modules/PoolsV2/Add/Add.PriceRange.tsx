/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import s from './styles.module.scss';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import { Field, useForm, useFormState } from 'react-final-form';
import { IToken } from '@/interfaces/token';
import useGetPool from '@/hooks/contract-operations/pools/v3/usePoolInfo';
import { isPool } from '../utils';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import Empty from '@/components/Empty';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import HorizontalItem from '@/components/Swap/horizontalItem';
import { requiredAmount } from '@/utils/formValidate';
import { formatCurrency } from '@/utils';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { priceToTick } from '@/utils/number';
import { FeeAmount, TICK_SPACINGS } from '@/utils/constants';

interface IAddPriceRange {
  loading?: boolean;
}

const AddPriceRange: React.FC<IAddPriceRange> = ({ loading }) => {
  const { call: getPool } = useGetPool();

  const { values } = useFormState();
  const { change } = useForm();

  const baseToken: IToken = values?.baseToken;
  const quoteToken: IToken = values?.quoteToken;
  const poolAddress: IToken = values?.poolAddress;
  const fee: FeeAmount = values?.fee;
  const estimateAmount: any = values?.estimateAmount;
  const tickLower: any = values?.tickLower || '0';

  useEffect(() => {
    if (Boolean(baseToken) && Boolean(quoteToken)) {
      onGetPool(baseToken, quoteToken);
    }
  }, [baseToken, quoteToken]);

  const onGetPool = async (_tokenA: IToken, _tokenB: IToken) => {
    try {
      const response = await getPool({
        tokenA: _tokenA,
        tokenB: _tokenB,
        fee: fee,
      });
      if (isPool(response)) {
        change('poolAddress', response);
      }
    } catch (error) {}
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Flex justifyContent={'center'}>
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

    if (!poolAddress) {
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
              name="estimateAmount"
              validate={requiredAmount}
            />
            <Box mt={2} />
            <HorizontalItem
              label={`Current ${baseToken?.symbol} Price:`}
              value={`${formatCurrency(estimateAmount)} ${quoteToken?.symbol}`}
              className={s.formContainer__right__estimateAmount}
            />
          </InputWrapper>
          <Box mt={8} />
          <InputWrapper label={`Set Price Range`}>
            <Flex mt={4} gap={2} className={s.formContainer__right__rangeContainer}>
              <Box className={s.formContainer__right__rangeContainer__item}>
                <Text>Min Price</Text>
                <Field
                  name="tickLower"
                  children={FieldAmount}
                  prependComp={
                    <Box
                      className={s.formContainer__right__rangeContainer__rangeButton}
                      onClick={() =>
                        change(
                          'tickLower',
                          priceToTick(Number(tickLower), TICK_SPACINGS[fee]),
                        )
                      }
                    >
                      <AiOutlineMinus />
                    </Box>
                  }
                  appendComp={
                    <Box
                      className={s.formContainer__right__rangeContainer__rangeButton}
                    >
                      <AiOutlinePlus />
                    </Box>
                  }
                />
                <Text>
                  {quoteToken.symbol} per {baseToken.symbol}
                </Text>
              </Box>
              <Box className={s.formContainer__right__rangeContainer__item}>
                <Text>Max Price</Text>
                <Field
                  name="tickUpper"
                  children={FieldAmount}
                  prependComp={
                    <Box
                      className={s.formContainer__right__rangeContainer__rangeButton}
                    >
                      <AiOutlineMinus />
                    </Box>
                  }
                  appendComp={
                    <Box
                      className={s.formContainer__right__rangeContainer__rangeButton}
                    >
                      <AiOutlinePlus />
                    </Box>
                  }
                />
                <Text>
                  {quoteToken.symbol} per {baseToken.symbol}
                </Text>
              </Box>
            </Flex>
          </InputWrapper>
        </>
      );
    }

    return <></>;
  };

  return (
    <Box>
      <Box>{renderContent()}</Box>
    </Box>
  );
};

export default AddPriceRange;
