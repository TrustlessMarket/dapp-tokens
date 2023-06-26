/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import s from './styles.module.scss';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import { useForm, useFormState } from 'react-final-form';
import { IToken } from '@/interfaces/token';
import useGetPool from '@/hooks/contract-operations/pools/v3/usePoolInfo';
import { isPool } from '../utils';
import { Box } from '@chakra-ui/react';
import Empty from '@/components/Empty';

interface IAddPriceRange {}

const AddPriceRange: React.FC<IAddPriceRange> = () => {
  const { call: getPool } = useGetPool();

  const { values } = useFormState();
  const { change } = useForm();

  const baseToken: IToken = values?.baseToken;
  const quoteToken: IToken = values?.quoteToken;
  const poolAddress: IToken = values?.poolAddress;
  const fee: any = values?.fee;

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
      console.log('response', response);
    } catch (error) {}
  };

  const renderContent = () => {
    return (
      <>
        <Empty infoText="Your position will appear here." />
      </>
    );
  };

  return (
    <>
      <InputWrapper label={`Set Price Range`}>{''}</InputWrapper>
      <Box>{renderContent()}</Box>
    </>
  );
};

export default AddPriceRange;
