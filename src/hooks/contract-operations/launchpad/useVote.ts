/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadPoolJson from '@/abis/LaunchpadPool.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { TC_WEB_URL } from '@/configs';
import { TransactionEventType } from '@/enums/transaction';
import useCheckTxsBitcoin from '@/hooks/useCheckTxsBitcoin';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { logErrorToServer } from '@/services/swap';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import { getContract, getDefaultGasPrice } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import web3 from 'web3';

interface IVoteLaunchpadParams {
  amount: string;
  launchpadAddress: string;
}

const useVoteLaunchpad: ContractOperationHook<
  IVoteLaunchpadParams,
  boolean
> = () => {
  const { account, provider } = useWeb3React();
  const { call: checkTxsBitcoin } = useCheckTxsBitcoin();

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
          .vote(web3.utils.toWei(amount), {
            gasLimit: '250000',
            gasPrice: getDefaultGasPrice(),
          });

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '250000'",
        });

        store.dispatch(
          updateCurrentTransaction({
            status: TransactionStatus.pending,
            id: transactionType.votingProposal,
            hash: transaction.hash,
            infoTexts: {
              pending: `Please go to the trustless wallet and click on <a style="color: ${colors.bluePrimary}" href="${TC_WEB_URL}" target="_blank" >"Process Transaction"</a> for Bitcoin to complete this process.`,
            },
          }),
        );

        checkTxsBitcoin({
          txHash: transaction.hash,
          fnAction: () =>
            store.dispatch(
              updateCurrentTransaction({
                id: transactionType.votingProposal,
                status: TransactionStatus.pending,
                hash: transaction.hash,
                infoTexts: {
                  pending: `Transaction confirmed. Please wait for it to be processed on the Bitcoin. Note that it may take up to 10 minutes for a block confirmation on the Bitcoin blockchain.`,
                },
              }),
            ),
        });

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

export default useVoteLaunchpad;
