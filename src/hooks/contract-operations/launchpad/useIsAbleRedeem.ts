/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadPoolJson from '@/abis/LaunchpadPool.json';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract, getDefaultProvider } from '@/utils';
import { useCallback } from 'react';

export interface IIsAbleRedeemProps {
  owner_address?: string;
  launchpad_address?: string;
}

const useIsAbleRedeem: ContractOperationHook<IIsAbleRedeemProps, boolean> = () => {
  const provider = getDefaultProvider();
  const call = useCallback(
    async (params: IIsAbleRedeemProps): Promise<boolean> => {
      const { owner_address, launchpad_address } = params;
      if (provider && owner_address && launchpad_address) {
        const contract = getContract(launchpad_address, LaunchpadPoolJson, provider);

        const transaction = await contract
          .connect(provider)
          .isAbleRedeem(owner_address);

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

export default useIsAbleRedeem;
