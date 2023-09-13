/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { IToken } from '@/interfaces/token';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { isPool } from '@/modules/PoolsV2/utils';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { compareString, sortAddressPair } from '@/utils';
import { getDeadline } from '@/utils/number';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import web3 from 'web3';
import { scanTrx } from '@/services/swap-v3';
import {addLiquidityIncludeCreatePool} from 'trustless-swap-sdk'

export interface IAddLiquidityV3 {
    tokenA: IToken;
    tokenB: IToken;
    amountADesired: any;
    amountBDesired: any;
    lowerTick: any;
    upperTick: any;
    fee: any;
    amount0Min: any;
    amount1Min: any;
    currentPrice: any;
    poolAddress: any;
}

const useAddLiquidityV3: ContractOperationHook<IAddLiquidityV3, boolean> = () => {
    const { provider, account } = useWeb3React();

    const call = useCallback(
        async (params: IAddLiquidityV3): Promise<boolean> => {
            let {
                tokenA,
                tokenB,
                fee,
                amountADesired,
                amountBDesired,
                lowerTick,
                upperTick,
                amount0Min,
                amount1Min,
                currentPrice,
                poolAddress,
            } = params;
            if (provider) {

                let [token0, token1] = sortAddressPair(tokenA, tokenB);

                const isRevert = !compareString(token0.address, tokenA.address);


                if (isRevert) {
                    [amountADesired, amountBDesired] = [amountBDesired, amountADesired];
                    [amount0Min, amount1Min] = [amount1Min, amount0Min];
                    [lowerTick, upperTick] = [-upperTick, -lowerTick];
                }
                const transaction =await addLiquidityIncludeCreatePool(!isPool(poolAddress),fee.toString(),token0.address,token1.address,
                   amountADesired,amountBDesired,lowerTick.toString(),upperTick.toString(),
                    web3.utils.toWei(amount0Min),web3.utils.toWei(amount1Min),currentPrice,getDeadline())


         store.dispatch(
             updateCurrentTransaction({
                 id: transactionType.createPool,
                 status: TransactionStatus.pending,
                 infoTexts: {
                     pending: 'Transaction confirmed. Please wait for it to be processed.',
                 },
             }),
         );

         await scanTrx({
             tx_hash: transaction[1].toString(),
         });

         return true;
     }

     return false;
 },
 [provider, account],
);

return {
 call: call,
 dAppType: DAppType.ERC20,
 transactionType: TransactionEventType.CREATE,
};
};

export default useAddLiquidityV3;
