/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { getDeadline } from '@/utils/number';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import web3 from 'web3';
import { scanTrx } from '@/services/swap-v3';
import {decreaseLiquidity,getWalletAddress,geSignerAddress} from 'trustless-swap-sdk'

export interface IRemoveLiquidityV3 {
  tokenId?: number;
  liquidity: any;
  amount0Min: any;
  amount1Min: any;
}

const useRemoveLiquidityV3: ContractOperationHook<
  IRemoveLiquidityV3,
  boolean
> = () => {
  const { provider, account } = useWeb3React();

  const call = useCallback(
    async (params: IRemoveLiquidityV3): Promise<boolean> => {
      const { tokenId, liquidity, amount0Min, amount1Min } = params;
      if (provider) {

          console.log("getWalletAddress",await  getWalletAddress())

          // alert(geSignerAddress)
          console.log("geSignerAddress",await geSignerAddress())
          const transaction = await  decreaseLiquidity(tokenId,web3.utils.toWei(liquidity),web3.utils.toWei(amount0Min),web3.utils.toWei(amount1Min),getDeadline())

        store.dispatch(
          updateCurrentTransaction({
            id: transactionType.removeLiquidity,
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

export default useRemoveLiquidityV3;
