/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FiledButton from '@/components/Swap/button/filedButton';
import FilterButton from '@/components/Swap/filterToken';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import WrapperConnected from '@/components/WrapperConnected';
import { ROUTE_PATH } from '@/constants/route-path';
import { WalletContext } from '@/contexts/wallet-context';
import { IResourceChain } from '@/interfaces/chain';
import { IToken } from '@/interfaces/token';
import { IPoolV2AddPair } from '@/pages/pools/v2/add/[...id]';
import { getTokens } from '@/services/token-explorer';
import { compareString } from '@/utils';
import { composeValidators, requiredAmount } from '@/utils/formValidate';
import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import {
  checkBalanceIsApprove,
  getUniFee,
  validateBaseAmount,
  validateQuoteAmount,
} from '../utils';
import AddItemToken from './Add.ItemToken';
import AddPriceRange from './Add.PriceRange';
import AddTokenBalance from './Add.TokenBalance';
import s from './styles.module.scss';
import AddApproveToken from './Add.ApproveToken';

interface IFormAddPoolsV2Container extends IPoolV2AddPair {
  handleSubmit: (_: any) => void;
}

const FormAddPoolsV2Container: React.FC<IFormAddPoolsV2Container> = ({
  handleSubmit,
  ids,
}) => {
  const paramBaseTokenAddress = ids?.[0];
  const paramQuoteTokenAddress = ids?.[1];

  const { getConnectedChainInfo } = useContext(WalletContext);
  const connectInfo: IResourceChain = getConnectedChainInfo();

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tokensList, setTokenList] = useState<IToken[]>([]);

  const { values } = useFormState();
  const { initialize, change } = useForm();
  const baseToken: IToken = values?.baseToken;
  const quoteToken: IToken = values?.quoteToken;
  const baseAmount: any = values?.baseAmount;
  const quoteAmount: IToken = values?.quoteAmount;
  const baseTokenBalance: string = values?.baseTokenBalance || '0';
  const quoteTokenBalance: string = values?.quoteTokenBalance || '0';
  const baseTokenAmountApprove: string = values?.baseTokenAmountApprove || '0';
  const quoteTokenAmountApprove: string = values?.quoteTokenAmountApprove || '0';
  const fee: number = values?.fee || 0;

  const isBaseTokenApprove = checkBalanceIsApprove(
    baseTokenAmountApprove,
    baseAmount,
  );

  const isQuoteTokenApprove = checkBalanceIsApprove(
    quoteTokenAmountApprove,
    quoteAmount,
  );

  const isTokenApproved = isBaseTokenApprove && isQuoteTokenApprove;

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
    change('fee', getUniFee());
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
          <InputWrapper label="Deposit Amounts">
            <Box className={s.formContainer__left__amountWrap}>
              <Field
                name="baseAmount"
                children={FieldAmount}
                validate={composeValidators(requiredAmount, validateBaseAmount)}
                //   fieldChanged={onChangeValueBaseAmount}
                //   disabled={submitting || isDisabled}
                // placeholder={"Enter number of tokens"}
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
            </Box>
            <Box mt={2} />
            <Box className={s.formContainer__left__amountWrap}>
              <Field
                name="quoteAmount"
                children={FieldAmount}
                validate={composeValidators(requiredAmount, validateQuoteAmount)}
                //   fieldChanged={onChangeValueBaseAmount}
                //   disabled={submitting || isDisabled}
                // placeholder={"Enter number of tokens"}
                decimals={quoteToken?.decimal || 18}
                className={s.formContainer__left__inputAmount}
                appendComp={
                  quoteToken && <AddItemToken token={quoteToken} hideName={true} />
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
            </Box>
          </InputWrapper>
          <Box mt={6} />
          <InputWrapper label={`Fee Tier: ${fee / 10000}%`}>{''}</InputWrapper>
        </Box>
        <Flex className={s.formContainer__right}>
          <AddPriceRange loading={loading} />
          <Box mt={10} />
          <WrapperConnected>
            <>
              {!isTokenApproved && (
                <AddApproveToken
                  token={isBaseTokenApprove ? quoteToken : baseToken}
                />
              )}

              <FiledButton
                isDisabled={!isTokenApproved}
                className={
                  !isTokenApproved ? s.formContainer__right__btnInActive : ''
                }
                type="submit"
                btnSize="h"
              >
                Preview
              </FiledButton>
            </>
          </WrapperConnected>
        </Flex>
      </Flex>
    </form>
  );
};

export default FormAddPoolsV2Container;
