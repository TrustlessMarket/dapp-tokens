/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadPoolJson from '@/abis/LaunchpadPool.json';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract, getDefaultProvider } from '@/utils';
import { useCallback } from 'react';

export interface IIsAbleCloseProps {
  launchpad_address?: string;
}

const useIsAbleClose: ContractOperationHook<IIsAbleCloseProps, boolean> = () => {
  const provider = getDefaultProvider();
  const call = useCallback(
    async (params: IIsAbleCloseProps): Promise<boolean> => {
      const { launchpad_address } = params;
      if (provider && launchpad_address) {
        const contract = getContract(launchpad_address, LaunchpadPoolJson, provider);

        const transaction = await contract
          .connect(provider)
          .isAbleClose();

        return transaction;
      }
      return false;
    },
    [provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.NONE,
  };
};

export default useIsAbleClose;
