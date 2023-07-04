/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import FilterButton from '@/components/Swap/filterToken';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import WrapperConnected from '@/components/WrapperConnected';
import { ROUTE_PATH } from '@/constants/route-path';
import { IResourceChain } from '@/interfaces/chain';
import { IToken } from '@/interfaces/token';
import { IPoolV2AddPair } from '@/pages/pools/nos/add/[[...id]]';
import { getTokens } from '@/services/token-explorer';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { compareString } from '@/utils';
import { composeValidators, requiredAmount } from '@/utils/formValidate';
import { Box, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import {
  allowStep,
  checkBalanceIsApprove,
  handleChangeAmount,
  validateBaseAmount,
  validateQuoteAmount,
} from '../utils';
import AddApproveToken from './Add.ApproveToken';
import AddFeeTier from './Add.FeeTier';
import AddFieldAmount from './Add.FieldAmount';
import AddHeader from './Add.Header';
import AddItemToken from './Add.ItemToken';
import AddPriceRange from './Add.PriceRange';
import s from './styles.module.scss';

interface IFormAddPoolsV2Container extends IPoolV2AddPair {
  handleSubmit: (_: any) => void;
  submitting?: boolean;
}

const FormAddPoolsV2Container = forwardRef<any, IFormAddPoolsV2Container>(
  (props, ref) => {
    const { handleSubmit, ids, submitting } = props;
    const paramBaseTokenAddress = ids?.[0];
    const paramQuoteTokenAddress = ids?.[1];
    const paramFee = ids?.[2];

    const currentChain: IResourceChain =
      useAppSelector(selectPnftExchange).currentChain;

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [tokensList, setTokenList] = useState<IToken[]>([]);

    const { values } = useFormState();
    const { restart, change } = useForm();
    const baseToken: IToken = values?.baseToken;
    const quoteToken: IToken = values?.quoteToken;
    const baseAmount: any = values?.baseAmount;
    const quoteAmount: IToken = values?.quoteAmount;
    const baseTokenAmountApprove: string = values?.baseTokenAmountApprove || '0';
    const quoteTokenAmountApprove: string = values?.quoteTokenAmountApprove || '0';
    const currentPrice: number = values?.currentPrice || 0;
    const maxPrice: number = values?.maxPrice || 0;
    const minPrice: number = values?.minPrice || 0;
    const currentTick: number = values?.currentTick || 0;
    const tickLower: number = values?.tickLower || 0;
    const tickUpper: number = values?.tickUpper || 0;

    const isBaseTokenApprove = checkBalanceIsApprove(
      baseTokenAmountApprove,
      baseAmount,
    );

    const isQuoteTokenApprove = checkBalanceIsApprove(
      quoteTokenAmountApprove,
      quoteAmount,
    );

    const isTokenApproved = isBaseTokenApprove && isQuoteTokenApprove;

    const isDisabledBaseAmount = new BigNumber(maxPrice).lt(currentPrice);

    const isDisabledQuoteAmount = new BigNumber(minPrice).gt(currentPrice);

    useImperativeHandle(ref, () => {
      return {
        reset: () =>
          restart({
            ...values,
            baseAmount: '0',
            quoteAmount: '0',
          }),
      };
    });

    useEffect(() => {
      if (currentChain) {
        fetchData();
      }
    }, [currentChain?.chainId]);

    useEffect(() => {
      initialData();
    }, [JSON.stringify(ids), tokensList]);

    const fetchData = async () => {
      try {
        setLoading(true);
        const [_tokenList] = await Promise.all([
          getTokens({
            page: 1,
            limit: 99,
            network: currentChain.chain.toLowerCase(),
          }),
        ]);
        setTokenList(_tokenList);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    const initialData = () => {
      if (paramFee) {
        change('fee', paramFee);
      }

      const findBaseToken = tokensList.find((v) =>
        compareString(v.address, paramBaseTokenAddress),
      );
      if (findBaseToken) {
        change('baseToken', findBaseToken);
        change('currentSelectPair', findBaseToken);
      }
      const findQuoteToken = tokensList.find((v) =>
        compareString(v.address, paramQuoteTokenAddress),
      );
      if (findBaseToken) {
        change('quoteToken', findQuoteToken);
      }
    };

    const onSelectBaseToken = (_token: IToken) => {
      change('baseToken', _token);
      change('currentSelectPair', _token);
      let _router = `${ROUTE_PATH.POOLS_V2_ADD}/${_token.address}`;
      if (paramQuoteTokenAddress) {
        _router += `/${paramQuoteTokenAddress}`;
      }
      router.push(_router);
    };

    const onSelectQuoteToken = (_token: IToken) => {
      change('quoteToken', _token);
      let _router = `${ROUTE_PATH.POOLS_V2_ADD}`;
      if (paramBaseTokenAddress) {
        _router += `/${paramBaseTokenAddress}`;
      }

      _router += `/${_token.address}`;

      router.push(_router);
    };

    const onChangeBaseAmount = (_amount: any) => {
      const value = handleChangeAmount('baseAmount', {
        currentTick,
        tickLower,
        tickUpper,
        _amount,
      });

      change('quoteAmount', value);
    };

    const onChangeQuoteAmount = (_amount: any) => {
      const value = handleChangeAmount('quoteAmount', {
        currentTick,
        tickLower,
        tickUpper,
        _amount,
      });

      change('baseAmount', value);
    };

    const isHideAmount = allowStep(values) < 3;

    return (
      <form onSubmit={handleSubmit}>
        <AddHeader />
        <Box className={s.container__content_body}>
          <Flex gap={12} className={s.formContainer}>
            <Box className={s.formContainer__left}>
              <InputWrapper label="Select Pair">
                <Flex gap={2}>
                  <FilterButton
                    data={tokensList}
                    commonData={tokensList.slice(0, 3)}
                    parentClose={close}
                    value={baseToken}
                    handleSelectItem={onSelectBaseToken}
                    renderSelectItem={(_token: IToken) => (
                      <AddItemToken token={_token} />
                    )}
                    className={baseToken && 'active'}
                    // onExtraSearch={onExtraSearch}
                  />
                  <FilterButton
                    data={tokensList}
                    commonData={tokensList.slice(0, 3)}
                    parentClose={close}
                    value={quoteToken}
                    handleSelectItem={onSelectQuoteToken}
                    renderSelectItem={(_token: IToken) => (
                      <AddItemToken token={_token} />
                    )}
                    className={quoteToken && 'active'}
                    // onExtraSearch={onExtraSearch}
                  />
                </Flex>
              </InputWrapper>
              <Box mt={8} />
              <AddFeeTier />
              <Box mt={8} />
              <InputWrapper
                className={isHideAmount ? s.blur : ''}
                label="Deposit Amounts"
              >
                {isHideAmount && <Box className={s.blur__fade} />}
                <AddFieldAmount
                  fieldName="baseAmount"
                  amountName="baseToken"
                  token={baseToken}
                  validate={composeValidators(requiredAmount, validateBaseAmount)}
                  fieldChanged={onChangeBaseAmount}
                  isDisabledBaseAmount={isDisabledBaseAmount}
                />
                <Box mt={2} />
                <AddFieldAmount
                  fieldName="quoteAmount"
                  amountName="quoteToken"
                  token={quoteToken}
                  validate={composeValidators(requiredAmount, validateQuoteAmount)}
                  fieldChanged={onChangeQuoteAmount}
                  isDisabledBaseAmount={isDisabledQuoteAmount}
                />
              </InputWrapper>
            </Box>
            <Flex className={s.formContainer__right}>
              <AddPriceRange loading={loading} />
              <Box mt={10} />
              <WrapperConnected className={s.formContainer__right__btnContainer}>
                <Box>
                  {!isTokenApproved && (
                    <AddApproveToken
                      token={isBaseTokenApprove ? quoteToken : baseToken}
                    />
                  )}

                  <FiledButton
                    isDisabled={
                      !isTokenApproved || submitting || allowStep(values) === 4
                    }
                    isLoading={submitting}
                    className={
                      !isTokenApproved ? s.formContainer__right__btnInActive : ''
                    }
                    type="submit"
                    btnSize="h"
                    processInfo={{
                      id: transactionType.createPool,
                    }}
                  >
                    Preview
                  </FiledButton>
                </Box>
              </WrapperConnected>
            </Flex>
          </Flex>
        </Box>
      </form>
    );
  },
);

export default FormAddPoolsV2Container;
