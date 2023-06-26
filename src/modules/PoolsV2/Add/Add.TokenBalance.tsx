import { IToken } from '@/interfaces/token';
import { Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import s from './styles.module.scss';
import { formatCurrency } from '@/utils';
import { useForm, useFormState } from 'react-final-form';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import { UNIV3_ROUTER_ADDRESS } from '@/configs';
import web3 from 'web3';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';

interface IAddTokenBalance {
  token: IToken;
  name: string;
}

const AddTokenBalance: React.FC<IAddTokenBalance> = ({ token, name }) => {
  const { values } = useFormState();
  const { change } = useForm();

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
      const [_isApprove, _tokenBalance] = await Promise.all([
        checkTokenApprove(_token),
        getTokenBalance(_token),
      ]);
      change(amountApprovedName, web3.utils.fromWei(_isApprove));
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
        address: UNIV3_ROUTER_ADDRESS,
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

  return (
    <>
      <Text className={s.formContainer__left__amountWrap__balance}>
        Balance: {formatCurrency(balance)} {token.symbol}
      </Text>
    </>
  );
};

export default AddTokenBalance;
