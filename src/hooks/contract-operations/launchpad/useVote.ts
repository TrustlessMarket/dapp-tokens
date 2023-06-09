/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadPoolJson from '@/abis/LaunchpadPool.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { WALLET_URL } from '@/configs';
import { TransactionEventType } from '@/enums/transaction';
import useCheckTxsBitcoin from '@/hooks/useCheckTxsBitcoin';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { logErrorToServer } from '@/services/swap';
import store from '@/state';
import { selectPnftExchange, updateCurrentTransaction } from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import { compareString, getContract, getDefaultGasPrice, getGasFee } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import web3 from 'web3';
import { IResourceChain } from '@/interfaces/chain';
import { useAppSelector } from '@/state/hooks';
import { SupportedChainId } from '@/constants/chains';

interface IVoteLaunchpadParams {
  amount: string;
  launchpadAddress: string;
}

const useVoteLaunchpad: ContractOperationHook<IVoteLaunchpadParams, any> = () => {
  const { account, provider } = useWeb3React();
  const { call: checkTxsBitcoin } = useCheckTxsBitcoin();
  const currentChain: IResourceChain =
    useAppSelector(selectPnftExchange).currentChain;

  const call = useCallback(
    async (params: IVoteLaunchpadParams): Promise<any> => {
      const { amount, launchpadAddress } = params;
      if (account && provider && launchpadAddress) {
        const contract = getContract(
          launchpadAddress,
          LaunchpadPoolJson,
          provider,
          account,
        );

        const transaction = await contract.connect(provider.getSigner()).vote(
          web3.utils.toWei(amount),
          compareString(currentChain.chainId, SupportedChainId.TRUSTLESS_COMPUTER)
            ? {
                gasLimit: '250000',
                gasPrice: getDefaultGasPrice(),
              }
            : {
                gasPrice: getGasFee(),
              },
        );

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '250000'",
        });

        if (compareString(currentChain.chainId, SupportedChainId.L2)) {
          store.dispatch(
            updateCurrentTransaction({
              status: TransactionStatus.pending,
              id: transactionType.votingProposal,
              infoTexts: {
                pending:
                  'Transaction confirmed. Please wait for it to be processed.',
              },
            }),
          );
        } else {
          store.dispatch(
            updateCurrentTransaction({
              status: TransactionStatus.pending,
              id: transactionType.votingProposal,
              hash: transaction.hash,
              infoTexts: {
                pending: `Please go to the trustless wallet and click on <a style="color: ${colors.bluePrimary}" href="${WALLET_URL}" target="_blank" >"Process Transaction"</a> for Bitcoin to complete this process.`,
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
        }

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
