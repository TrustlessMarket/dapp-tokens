/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import NonfungiblePositionManagerJson from '@/abis/NonfungiblePositionManager.json';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS } from '@/configs';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { getContract } from '@/utils';
import { MaxUint128 } from '@/utils/constants';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';

export interface ICollectFeeV3 {
  tokenId?: number;
}

const useCollectFeeV3: ContractOperationHook<ICollectFeeV3, boolean> = () => {
  const { provider, account } = useWeb3React();

  const call = useCallback(
    async (params: ICollectFeeV3): Promise<boolean> => {
      const { tokenId } = params;
      if (provider && account) {
        const contract = getContract(
          UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS,
          NonfungiblePositionManagerJson,
          provider,
          account,
        );

        const transaction = await contract.connect(provider.getSigner(0)).collect({
          tokenId,
          recipient: account,
          amount0Max: MaxUint128,
          amount1Max: MaxUint128,
        });

        store.dispatch(
          updateCurrentTransaction({
            id: transactionType.collectFee,
            status: TransactionStatus.pending,
            infoTexts: {
              pending: 'Transaction confirmed. Please wait for it to be processed.',
            },
          }),
        );

        return transaction;
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
