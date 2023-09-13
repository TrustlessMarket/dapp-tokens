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
import { scanTrx } from '@/services/swap-v3';
import {removePosition} from "trustless-swap-sdk";

export interface IRemovePositionV3 {
  tokenId?: number;
}

const useRemovePositionV3: ContractOperationHook<
  IRemovePositionV3,
  boolean
> = () => {
  const { provider, account } = useWeb3React();

  const call = useCallback(
    async (params: IRemovePositionV3): Promise<boolean> => {
      const { tokenId } = params;
      if (provider && account) {
          const transaction = await  removePosition(tokenId)


store.dispatch(
  updateCurrentTransaction({
    id: transactionType.removePoolApprove,
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

export default useRemovePositionV3;
