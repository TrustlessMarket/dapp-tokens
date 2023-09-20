import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import { IToken } from '@/interfaces/token';
import { formatCurrency, isNativeToken } from '@/utils';
import { Skeleton, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { ethers } from 'ethers';
import localStorage from '@/utils/localstorage';

export interface ItemBalanceProps {
  token?: IToken | undefined;
  onBalanceChange?: (_amount: string | undefined) => void;
}

const TokenBalance = (props: ItemBalanceProps) => {
  const { token, onBalanceChange } = props;
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const { call: tokenBalance } = useBalanceERC20Token();
  const { account, provider, isActive } = useWeb3React();
  const needReload = useAppSelector(selectPnftExchange).needReload;

  useEffect(() => {
    if (token?.address && account && isActive) {
      fetchBalance();
    }
  }, [token?.address, account, provider, needReload]);

  const fetchBalance = async () => {
    if (!token) return
    try {
      setLoading(true);
      const [_tokenBalance] = await Promise.all([isNativeToken(token.address)? getAccountBalance(account) : getTokenBalance(token)]);
      if (_tokenBalance) {
        setBalance(_tokenBalance);
        let has_balance = localStorage.get("has_balance")
        const list_has_balance = has_balance?has_balance.toString().split(","):[]
        if(Number(_tokenBalance)>0)
        {
          const id = token.id.toString()
          if(list_has_balance.indexOf(id)<0){
            list_has_balance.push(id)
            has_balance = list_has_balance.join()
            localStorage.set("has_balance",has_balance)
          }
        }
      }


      onBalanceChange && onBalanceChange(_tokenBalance);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAccountBalance = async (account : string | undefined) => {
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

  const getTokenBalance = async (token: IToken | undefined) => {
    if (!token) {
      return;
    }
    try {
      const response = await tokenBalance({
        erc20TokenAddress: token.address,
      });
      return response;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  return (
    <Skeleton isLoaded={!loading}>
      <Text>{formatCurrency(balance)}</Text>
    </Skeleton>
  );
};

export default TokenBalance;
