/* eslint-disable @typescript-eslint/no-explicit-any */
import { NULL_ADDRESS } from '@/constants/url';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { IToken } from '@/interfaces/token';
import { getDefaultProvider, sortAddressPair } from '@/utils';
import { useCallback } from 'react';
import {getPoolAddress} from "trustless-swap-sdk";

export interface IGetPoolAddressParams {
  tokenA: IToken;
  tokenB: IToken;
  fee: any;
}

const useGetPoolAddress: ContractOperationHook<
  IGetPoolAddressParams,
  string
> = () => {
  const provider = getDefaultProvider();

  const call = useCallback(
    async (params: IGetPoolAddressParams): Promise<string> => {
      const { tokenA, tokenB, fee } = params;
      if (provider && tokenA && tokenB && fee) {
        const [token0, token1] = sortAddressPair(tokenA, tokenB);
        const transaction = await getPoolAddress(token0.address, token1.address, fee);
        return transaction;
      }

      return NULL_ADDRESS;
    },
    [provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useGetPoolAddress;
