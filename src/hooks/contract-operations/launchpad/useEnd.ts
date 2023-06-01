/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadPoolJson from '@/abis/LaunchpadPool.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { logErrorToServer } from '@/services/swap';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { getContract, getDefaultGasPrice } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';

interface IEndLaunchPoolParams {
  launchpadAddress: string;
}

const useEndLaunchPad: ContractOperationHook<IEndLaunchPoolParams, boolean> = () => {
  const { account, provider } = useWeb3React();
  const call = useCallback(
    async (params: IEndLaunchPoolParams): Promise<boolean> => {
      const { launchpadAddress } = params;
      if (account && provider && launchpadAddress) {
        const contract = getContract(
          launchpadAddress,
          LaunchpadPoolJson,
          provider,
          account,
        );

        const transaction = await contract.connect(provider.getSigner()).end({
          gasLimit: '1000000',
          gasPrice: getDefaultGasPrice(),
        });

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '1000000'",
        });

        store.dispatch(
          updateCurrentTransaction({
            id: transactionType.depositLaunchpad,
            status: TransactionStatus.pending,
            hash: transaction.hash,
            infoTexts: {
              pending: `Transaction confirmed. Please wait for it to be processed on the Bitcoin. Note that it may take up to 10 minutes for a block confirmation on the Bitcoin blockchain.`,
            },
          }),
        );

        return transaction;
      }
      return false;
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.END_LAUNCHPAD,
  };
};

export default useEndLaunchPad;
