/* eslint-disable @typescript-eslint/no-explicit-any */
import UniswapV3PoolJson from '@/abis/UniswapV3Pool.json';
import {TransactionEventType} from '@/enums/transaction';
import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {getContract, getDefaultProvider,} from '@/utils';
import {useCallback} from 'react';
import {fetchTicksSurroundingPrice} from "@/utils/liquidity";
import {FeeAmount} from "@/utils/constants";
import {BigNumber} from "ethers";

export interface IGetPoolLiquidityParams {
  poolAddress: string;
}

const useGetPoolLiquidity: ContractOperationHook<IGetPoolLiquidityParams, any> = () => {
  const provider = getDefaultProvider();

  const call = useCallback(
    async (params: IGetPoolLiquidityParams): Promise<any> => {
      const { poolAddress } = params;
      if (provider && poolAddress) {
        const contract = getContract(poolAddress, UniswapV3PoolJson, provider);

        const pool = await contract.connect(provider);

        const slot0 = await pool.slot0();
        const fee: FeeAmount = await pool.fee();
        const liquidity: BigNumber = await pool.liquidity();
        const ticksProcessed = await fetchTicksSurroundingPrice(
          pool.address,
          fee,
          slot0.tick,
          liquidity,
          100,
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
