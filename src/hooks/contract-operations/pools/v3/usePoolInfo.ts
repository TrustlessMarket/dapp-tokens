/* eslint-disable @typescript-eslint/no-explicit-any */
import UniswapV3FactoryJson from '@/abis/UniswapV3Factory.json';
import { UNIV3_FACTORY_ADDRESS } from '@/configs';
import { NULL_ADDRESS } from '@/constants/url';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { IToken } from '@/interfaces/token';
import { getContract, getDefaultProvider, sortAddressPair } from '@/utils';
import { useCallback } from 'react';

export interface IGetPairParams {
  tokenA: IToken;
  tokenB: IToken;
  fee: any;
}

const useGetPool: ContractOperationHook<IGetPairParams, string> = () => {
  const provider = getDefaultProvider();

  const call = useCallback(
    async (params: IGetPairParams): Promise<string> => {
      const { tokenA, tokenB, fee } = params;
      if (provider) {
        const contract = getContract(
          UNIV3_FACTORY_ADDRESS,
          UniswapV3FactoryJson,
          provider,
        );
        const [token0, token1] = sortAddressPair(tokenA, tokenB);

        const transaction = await contract
          .connect(provider)
          .getPool(token0.address, token1.address, fee);

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

export default useGetPool;
