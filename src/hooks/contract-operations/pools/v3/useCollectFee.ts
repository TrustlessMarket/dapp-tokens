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
import {CollectFeeeById} from 'trustless-swap-sdk'

export interface ICollectFeeV3 {
  tokenId?: number;
}

const useCollectFeeV3: ContractOperationHook<ICollectFeeV3, boolean> = () => {
  const { provider, account } = useWeb3React();

  const call = useCallback(
    async (params: ICollectFeeV3): Promise<boolean> => {
      const { tokenId } = params;
      if (provider && account) {


          await CollectFeeeById(tokenId)

        store.dispatch(
          updateCurrentTransaction({
            id: transactionType.collectFee,
            status: TransactionStatus.pending,
            infoTexts: {
              pending: 'Transaction confirmed. Please wait for it to be processed.',
            },
          }),
        );

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

export default useCollectFeeV3;
