/* eslint-disable @typescript-eslint/no-unused-vars */
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import LaunchpadPoolJson from '@/abis/LaunchpadPool.json';
import web3 from 'web3';
import BigNumber from 'bignumber.js';
import { logErrorToServer } from '@/services/swap';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { TransactionStatus } from '@/interfaces/walletTransaction';

interface IDepositPoolParams {
  amount: string;
  launchpadAddress: string;
  boostRatio?: string;
  signature?: string;
}

const useDepositPool: ContractOperationHook<IDepositPoolParams, boolean> = () => {
  const { account, provider } = useWeb3React();
  const call = useCallback(
    async (params: IDepositPoolParams): Promise<boolean> => {
      const { amount, launchpadAddress, boostRatio, signature } = params;
      if (account && provider && launchpadAddress) {
        const contract = getContract(
          launchpadAddress,
          LaunchpadPoolJson,
          provider,
          account,
        );

        const transaction = await contract
          .connect(provider.getSigner())
          .deposit(
            web3.utils.fromWei(amount),
            new BigNumber(boostRatio || 0).multipliedBy(10000).toString(),
            signature,
            {
              gasLimit: '150000',
              // gasPrice: getDefaultGasPrice(),
            },
          );

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '150000'",
        });

        // store.dispatch(
        //   updateCurrentTransaction({
        //     id: transactionType.createLaunchpad,
        //     status: TransactionStatus.pending,
        //     hash: transaction.hash,
        //     infoTexts: {
        //       pending: `Deposit for launchpad pool ${launchpadAddress}`,
        //     },
        //   }),
        // );

        return transaction;
      }
      return false;
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.DEPOSIT_LAUNCHPAD,
  };
};

export default useDepositPool;
