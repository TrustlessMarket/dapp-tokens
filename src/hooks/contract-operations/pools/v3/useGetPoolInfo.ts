/* eslint-disable @typescript-eslint/no-explicit-any */
import UniswapV3PoolJson from '@/abis/UniswapV3Pool.json';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { IToken } from '@/interfaces/token';
import {
  compareString,
  getContract,
  getDefaultProvider,
  sortAddressPair,
} from '@/utils';
import { formatSqrtPriceX96ToPrice } from '@/utils/number';
import BigNumber from 'bignumber.js';
import { useCallback } from 'react';

export interface IGetPoolInfoParams {
  poolAddress: string;
  baseToken: IToken;
  quoteToken: IToken;
}

const useGetPoolInfo: ContractOperationHook<IGetPoolInfoParams, any> = () => {
  const provider = getDefaultProvider();

  const call = useCallback(
    async (params: IGetPoolInfoParams): Promise<any> => {
      const { poolAddress, baseToken, quoteToken } = params;
      if (provider && poolAddress) {
        const contract = getContract(poolAddress, UniswapV3PoolJson, provider);

        const transaction = await contract.connect(provider).slot0();

        const [token0] = sortAddressPair(baseToken, quoteToken);

        let currentPrice = formatSqrtPriceX96ToPrice(transaction.sqrtPriceX96);

        if (compareString(token0.address, quoteToken.address)) {
          currentPrice = new BigNumber(1).dividedBy(currentPrice).toString();
        }

        return {
          currentPrice,
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
