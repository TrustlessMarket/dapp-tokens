import { UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS } from '@/configs';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import { IToken } from '@/interfaces/token';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { formatCurrency } from '@/utils';
import { Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useForm, useFormState } from 'react-final-form';
import web3 from 'web3';
import s from './styles.module.scss';
import {ethers} from "ethers";
import {useWeb3React} from "@web3-react/core";
import {  isNativeToken } from '@/utils';

interface IAddTokenBalance {
  token: IToken;
  name: string;
}

const AddTokenBalance: React.FC<IAddTokenBalance> = ({ token, name }) => {
  const { values } = useFormState();
  const { change } = useForm();
  const { account, provider } = useWeb3React()

  const needReload = useAppSelector(selectPnftExchange).needReload;

  const { call: isApproved } = useIsApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();

  const balanceName = `${name}Balance`;
  const amountApprovedName = `${name}AmountApprove`;

  const balance: string = values?.[balanceName] || '0';

  useEffect(() => {
    fetchDataForQuoteToken(token);
  }, [JSON.stringify(token), needReload]);

  const fetchDataForQuoteToken = async (_token: IToken) => {
    change(balanceName, '0');
    change(amountApprovedName, '0');
    try {
    //  alert(_token.address);
      //alert(isNativeToken(_token.address));
      const [_isApprove, _tokenBalance] = await Promise.all([
        checkTokenApprove(_token),
        !isNativeToken(_token.address)?getTokenBalance(_token):getAccountBalance(),
      ]);
      change(amountApprovedName, !isNativeToken(_token.address)?web3.utils.fromWei(_isApprove):ethers.constants.MaxUint256.toString());
      change(balanceName, _tokenBalance);
    } catch (error) {
      console.log('error', error);
    } finally {
    }
  };

  const checkTokenApprove = async (token: IToken) => {
    try {
      const response = await isApproved({
        erc20TokenAddress: token.address,
        address: UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getTokenBalance = async (token: IToken) => {
    try {
      const response = await tokenBalance({
        erc20TokenAddress: token.address,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getAccountBalance = async () => {
    if (!account || !provider) {
      return;
    }
    try {
      const response = await provider.getBalance(account);
      return ethers.utils.formatEther(response?.toString());
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };


  return (
    <>
      <Text className={s.formContainer__left__amountWrap__balance}>
        Balance: {formatCurrency(balance)} {token.symbol}
      </Text>
    </>
  );
};

export default AddTokenBalance;
