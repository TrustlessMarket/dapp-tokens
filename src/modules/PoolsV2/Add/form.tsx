/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Empty from '@/components/Empty';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import FilterButton from '@/components/Swap/filterToken';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import WrapperConnected from '@/components/WrapperConnected';
import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { WalletContext } from '@/contexts/wallet-context';
import { IResourceChain } from '@/interfaces/chain';
import { IToken } from '@/interfaces/token';
import { IPoolV2AddPair } from '@/pages/pools/v2/add/[...id]';
import { getTokens } from '@/services/token-explorer';
import { compareString } from '@/utils';
import { FeeAmount, MaxUint128 } from '@/utils/constants';
import { composeValidators, requiredAmount } from '@/utils/formValidate';
import { amountDesiredChanged } from '@/utils/utilities';
import { Box, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import {
  checkBalanceIsApprove,
  validateBaseAmount,
  validateQuoteAmount,
} from '../utils';
import AddApproveToken from './Add.ApproveToken';
import AddFeeTier from './Add.FeeTier';
import AddItemToken from './Add.ItemToken';
import AddPriceRange from './Add.PriceRange';
import AddTokenBalance from './Add.TokenBalance';
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

    const { getConnectedChainInfo } = useContext(WalletContext);
    const connectInfo: IResourceChain = getConnectedChainInfo();

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
      fetchData();
    }, []);

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
            network: connectInfo.nativeCurrency.symbol.toLowerCase(),
          }),
        ]);
        setTokenList(_tokenList);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    const initialData = () => {
      change('fee', FeeAmount.MEDIUM);
      const findBaseToken = tokensList.find((v) =>
        compareString(v.address, paramBaseTokenAddress),
      );
      if (findBaseToken) {
        change('baseToken', findBaseToken);
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
      try {
        const [, _quoteAmount] = amountDesiredChanged(
          currentTick,
          tickLower,
          tickUpper,
          ethers.utils.parseEther(_amount),
          MaxUint128,
        );

        change('quoteAmount', ethers.utils.formatEther(_quoteAmount));
      } catch (error) {}
    };

    const onChangeQuoteAmount = (_amount: any) => {
      try {
        const [_baseAmount] = amountDesiredChanged(
          currentTick,
          tickLower,
          tickUpper,
          MaxUint128,
          ethers.utils.parseEther(_amount),
        );

        change('baseAmount', ethers.utils.formatEther(_baseAmount));
      } catch (error) {}
    };

    return (
      <form onSubmit={handleSubmit}>
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
            <InputWrapper label="Deposit Amounts">
              <Box className={s.formContainer__left__amountWrap}>
                {isDisabledBaseAmount ? (
                  <Box className={s.formContainer__left__amountWrap__locked}>
                    <Empty
                      src={`${CDN_URL}/icons/ic-locked-2.svg`}
                      size={24}
                      infoText="The market price is outside your specified price range. Single-asset deposit only."
                    />
                  </Box>
                ) : (
                  <Field
                    name="baseAmount"
                    children={FieldAmount}
                    validate={composeValidators(requiredAmount, validateBaseAmount)}
                    fieldChanged={onChangeBaseAmount}
                    disabled={isDisabledBaseAmount}
                    decimals={baseToken?.decimal || 18}
                    className={s.formContainer__left__inputAmount}
                    appendComp={
                      baseToken && (
                        <>
                          <AddItemToken token={baseToken} hideName={true} />
                        </>
                      )
                    }
                    note={
                      baseToken && (
                        <>
                          <Box />
                          <AddTokenBalance token={baseToken} name="baseToken" />
                        </>
                      )
                    }
                  />
                )}
              </Box>
              <Box mt={2} />
              <Box className={s.formContainer__left__amountWrap}>
                {isDisabledQuoteAmount ? (
                  <Box className={s.formContainer__left__amountWrap__locked}>
                    <Empty
                      size={24}
                      src={`${CDN_URL}/icons/ic-locked-2.svg`}
                      infoText="The market price is outside your specified price range. Single-asset deposit only."
                    />
                  </Box>
                ) : (
                  <Field
                    name="quoteAmount"
                    children={FieldAmount}
                    validate={composeValidators(requiredAmount, validateQuoteAmount)}
                    disabled={isDisabledQuoteAmount}
                    fieldChanged={onChangeQuoteAmount}
                    decimals={quoteToken?.decimal || 18}
                    className={s.formContainer__left__inputAmount}
                    appendComp={
                      quoteToken && (
                        <AddItemToken token={quoteToken} hideName={true} />
                      )
                    }
                    note={
                      quoteToken && (
                        <>
                          <Box />
                          <AddTokenBalance token={quoteToken} name="quoteToken" />
                        </>
                      )
                    }
                  />
                )}
              </Box>
            </InputWrapper>
          </Box>
          <Flex className={s.formContainer__right}>
            <AddPriceRange loading={loading} />
            <Box mt={10} />
            <WrapperConnected>
              <Box>
                {!isTokenApproved && (
                  <AddApproveToken
                    token={isBaseTokenApprove ? quoteToken : baseToken}
                  />
                )}

                <FiledButton
                  isDisabled={!isTokenApproved || submitting}
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
      </form>
    );
  },
);

export default FormAddPoolsV2Container;
