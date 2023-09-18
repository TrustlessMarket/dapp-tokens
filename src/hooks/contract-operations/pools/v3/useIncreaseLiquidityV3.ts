/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import web3 from 'web3';
import { scanTrx } from '@/services/swap-v3';
import {increaseLiquidity} from "trustless-swap-sdk";
import { getDeadline } from '@/utils/number';

export interface IIncreaseLiquidityV3 {
  tokenId: number;
  amount0Desired: any;
  amount1Desired: any;
  amount0Min: any;
  amount1Min: any;
}

const useIncreaseLiquidityV3: ContractOperationHook<
  IIncreaseLiquidityV3,
  boolean
> = () => {
  const { provider, account } = useWeb3React();

  const call = useCallback(
    async (params: IIncreaseLiquidityV3): Promise<boolean> => {
      const { tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min } =
        params;
      if (provider) {
          const transaction = await  increaseLiquidity(tokenId,web3.utils.toWei(amount0Desired),web3.utils.toWei(amount1Desired),web3.utils.toWei(amount0Min),web3.utils.toWei(amount1Min),getDeadline())

        store.dispatch(
          updateCurrentTransaction({
            id: transactionType.increaseLiquidity,
            status: TransactionStatus.pending,
            infoTexts: {
              pending: 'Transaction confirmed. Please wait for it to be processed.',
            },
          }),
        );

        await scanTrx({
          tx_hash: transaction[1].toString(),
        });
        console.log("transaction",transaction)
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

export default useIncreaseLiquidityV3;
