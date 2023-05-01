import {IToken} from "@/interfaces/token";
import React, {useEffect, useState} from "react";
import useBalanceERC20Token from "@/hooks/contract-operations/token/useBalanceERC20Token";
import {Skeleton, Text} from "@chakra-ui/react";
import {formatCurrency} from "@/utils";

export interface ItemBalanceProps {
  token?: IToken;
}

const TokenBalance = (props: ItemBalanceProps) => {
  const {token} = props;
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const { call: tokenBalance } = useBalanceERC20Token();

  useEffect(() => {
    if(token?.address) {
      fetchBalance();
    }
  }, [token?.address]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const [_tokenBalance] = await Promise.all([
        getTokenBalance(token),
      ]);
      setBalance(_tokenBalance);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const getTokenBalance = async (token: IToken) => {
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
      <Text fontSize={'md'} fontWeight={'normal'}>
        {formatCurrency(balance)}
      </Text>
    </Skeleton>
  )
}

export default TokenBalance;