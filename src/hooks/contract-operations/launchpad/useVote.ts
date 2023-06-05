/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadPoolJson from '@/abis/LaunchpadPool.json';
import {TransactionEventType} from '@/enums/transaction';
import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {logErrorToServer} from '@/services/swap';
import {getContract, getDefaultGasPrice} from '@/utils';
import {useWeb3React} from '@web3-react/core';
import {useCallback} from 'react';
import web3 from 'web3';

interface IVoteLaunchpadParams {
  amount: string;
  launchpadAddress: string;
}

const useDepositPool: ContractOperationHook<IVoteLaunchpadParams, boolean> = () => {
  const { account, provider } = useWeb3React();
  const call = useCallback(
    async (params: IVoteLaunchpadParams): Promise<boolean> => {
      const { amount, launchpadAddress } = params;
      if (account && provider && launchpadAddress) {
        const contract = getContract(
          launchpadAddress,
          LaunchpadPoolJson,
          provider,
          account,
        );

        const transaction = await contract
          .connect(provider.getSigner())
          .vote(
            web3.utils.toWei(amount),
            {
              gasLimit: '250000',
              gasPrice: getDefaultGasPrice(),
            },
          );

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '250000'",
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
    transactionType: TransactionEventType.VOTE_LAUNCHPAD,
  };
};

export default useDepositPool;
