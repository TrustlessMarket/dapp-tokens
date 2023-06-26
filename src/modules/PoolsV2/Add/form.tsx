/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FilterButton from '@/components/Swap/filterToken';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import { IToken } from '@/interfaces/token';
import { Box, Flex } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import s from './styles.module.scss';
import { IPoolV2AddPair } from '@/pages/pools/v2/add/[...id]';
import { getTokens } from '@/services/token-explorer';
import { WalletContext } from '@/contexts/wallet-context';
import { IResourceChain } from '@/interfaces/chain';
import { compareString } from '@/utils';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';
import AddItemToken from './Add.ItemToken';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import FiledButton from '@/components/Swap/button/filedButton';
import { UNIV3_ROUTER_ADDRESS } from '@/configs';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import web3 from 'web3';

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

  const { call: isApproved } = useIsApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tokensList, setTokenList] = useState<IToken[]>([]);
  const [isApproveAmountBaseToken, setIsApproveAmountBaseToken] =
    useState<string>('0');
  const [isApproveAmountQuoteToken, setIsApproveAmountQuoteToken] =
    useState<string>('0');

  const { values } = useFormState();
  const { initialize, change } = useForm();
  const baseToken = values?.baseToken;
  const quoteToken = values?.quoteToken;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    initialData();
  }, [ids, tokensList]);

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
    const _initialForm: any = {};
    const findBaseToken = tokensList.find((v) =>
      compareString(v.address, paramBaseTokenAddress),
    );
    if (findBaseToken) {
      _initialForm.baseToken = findBaseToken;
    }
    const findQuoteToken = tokensList.find((v) =>
      compareString(v.address, paramQuoteTokenAddress),
    );
    if (findBaseToken) {
      _initialForm.baseToken = findBaseToken;
      fetchDataForToken(findBaseToken);
    }
    if (findBaseToken) {
      _initialForm.quoteToken = findQuoteToken;
    }
    initialize(_initialForm);
  };

  const onSelectBaseToken = (_token: IToken) => {
    change('baseToken', _token);
    let _router = `${ROUTE_PATH.POOLS_V2_ADD}/${_token.address}`;
    if (paramQuoteTokenAddress) {
      _router += `/${paramQuoteTokenAddress}`;
    }
    router.push(_router);
    fetchDataForToken(_token);
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

  const fetchDataForToken = async (_token: IToken) => {
    try {
      const [_isApprove, _tokenBalance] = await Promise.all([
        checkTokenApprove(_token),
        getTokenBalance(_token),
      ]);
      setIsApproveAmountBaseToken(web3.utils.fromWei(_isApprove));
      console.log('_tokenBalance', _tokenBalance);

      change('baseTokenBalance', _tokenBalance);
    } catch (error) {
      console.log('error', error);
    } finally {
    }
  };

  const checkTokenApprove = async (token: IToken | any) => {
    try {
      const response = await isApproved({
        erc20TokenAddress: token.address,
        address: UNIV3_ROUTER_ADDRESS,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getTokenBalance = async (token: IToken | any) => {
    try {
      const response = await tokenBalance({
        erc20TokenAddress: token.address,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex className={s.formContainer}>
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
                //   validate={composeValidators(requiredAmount, validateBaseAmount)}
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
                  <>
                    <Flex>Balance: </Flex>
                  </>
                }
              />
            </Box>
            <Box mt={2} />
            <Box className={s.formContainer__left__amountWrap}>
              <Field
                name="quoteAmount"
                children={FieldAmount}
                //   validate={composeValidators(requiredAmount, validateBaseAmount)}
                //   fieldChanged={onChangeValueBaseAmount}
                //   disabled={submitting || isDisabled}
                // placeholder={"Enter number of tokens"}
                decimals={quoteToken?.decimal || 18}
                className={s.formContainer__left__inputAmount}
                appendComp={
                  quoteToken && <AddItemToken token={quoteToken} hideName={true} />
                }
                note={<Flex>Balance: </Flex>}
              />
            </Box>
          </InputWrapper>
        </Box>
        <Box className={s.formContainer__right}>
          <FiledButton type="submit" btnSize="h">
            Preview
          </FiledButton>
        </Box>
      </Flex>
    </form>
  );
};

export default FormAddPoolsV2Container;
