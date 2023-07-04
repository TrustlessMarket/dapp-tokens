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

        const slot0 = await contract.connect(provider).slot0();

        const [token0, token1] = sortAddressPair(baseToken, quoteToken);

        let currentPrice = formatSqrtPriceX96ToPrice(slot0.sqrtPriceX96);
        let currentTick = slot0.tick;
        const rootCurrentTick = slot0.tick;

        console.log('slot0', compareString(token0.address, quoteToken.address));

        if (compareString(token0.address, quoteToken.address)) {
          currentPrice = new BigNumber(1).dividedBy(currentPrice).toString();
          currentTick = new BigNumber(-1).multipliedBy(currentTick).toNumber();
        }

        console.log(
          'slot0',
          currentPrice,
          currentTick,
          rootCurrentTick,
          token0,
          token1,
        );

        return {
          currentPrice,
          currentTick,
          rootCurrentTick,
          token0,
          token1,
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
