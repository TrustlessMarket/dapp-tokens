/* eslint-disable @typescript-eslint/no-explicit-any */
import {TransactionEventType} from '@/enums/transaction';
import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import { getDefaultProvider,} from '@/utils';
import {useCallback} from 'react';
import {fetchTicksSurroundingPrice} from "@/utils/liquidity";
import {FeeAmount} from "@/utils/constants";
import {BigNumber} from "ethers";
import {getPoolFromAddress} from "trustless-swap-sdk";

export interface IGetPoolLiquidityParams {
  poolAddress: string;
  numSurroundingTicks?: number;
}

const useGetPoolLiquidity: ContractOperationHook<IGetPoolLiquidityParams, any> = () => {
  const provider = getDefaultProvider();

  const call = useCallback(
    async (params: IGetPoolLiquidityParams): Promise<any> => {
      const { poolAddress, numSurroundingTicks = 300 } = params;
      if (provider && poolAddress) {

        const pool = await getPoolFromAddress(poolAddress);
        const slot0 = await pool.slot0();
        const fee: FeeAmount = await pool.fee();
        const liquidity: BigNumber = await pool.liquidity();
        const ticksProcessed = await fetchTicksSurroundingPrice(
          pool.address,
          fee,
          slot0.tick,
          liquidity,
          numSurroundingTicks,
        )

        return ticksProcessed;
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

export default useGetPoolLiquidity;
