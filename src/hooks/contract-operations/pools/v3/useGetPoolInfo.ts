/* eslint-disable @typescript-eslint/no-explicit-any */
import UniswapV3PoolJson from '@/abis/UniswapV3Pool.json';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract, getDefaultProvider } from '@/utils';
import { formatSqrtPriceX96ToPrice } from '@/utils/number';
import { useCallback } from 'react';

export interface IGetPoolInfoParams {
  poolAddress: string;
}

const useGetPoolInfo: ContractOperationHook<IGetPoolInfoParams, any> = () => {
  const provider = getDefaultProvider();

  const call = useCallback(
    async (params: IGetPoolInfoParams): Promise<any> => {
      const { poolAddress } = params;
      if (provider && poolAddress) {
        const contract = getContract(poolAddress, UniswapV3PoolJson, provider);

        const transaction = await contract.connect(provider).slot0();

        return {
          currentPrice: formatSqrtPriceX96ToPrice(transaction.sqrtPriceX96),
          currentTick: transaction.tick,
        };
      }

      return null;
    },
    [provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useGetPoolInfo;
