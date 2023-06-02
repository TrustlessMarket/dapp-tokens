/* eslint-disable @typescript-eslint/no-unused-vars */
import GevernorJson from '@/abis/Gevernor.json';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { logErrorToServer } from '@/services/swap';
import { compareString, getContract, getDefaultProvider } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { GOVERNOR_ADDRESS } from '@/configs';
import useBitcoin from '@/hooks/useBitcoin';
import { CONTRACT_METHOD_IDS } from '@/constants/methodId';
import { ERROR_CODE } from '@/constants/error';

interface IExecuteParams {
  proposalId: string;
}

const useExecuteProposal: ContractOperationHook<IExecuteParams, boolean> = () => {
  const { account } = useWeb3React();
  const provider = getDefaultProvider();
  const { getUnInscribedTransactionDetailByAddress, getTCTxByHash } = useBitcoin();

  const call = useCallback(
    async (params: IExecuteParams): Promise<boolean> => {
      const { proposalId } = params;
      if (account && provider && proposalId) {
        let isPendingTx = false;

        const unInscribedTxIDs = await getUnInscribedTransactionDetailByAddress(
          account,
        );

        for await (const unInscribedTxID of unInscribedTxIDs) {
          const _getTxDetail = await getTCTxByHash(unInscribedTxID.Hash);

          const _inputStart = _getTxDetail.input.slice(0, 10);

          if (compareString(CONTRACT_METHOD_IDS.EXECUTE_VOTE, _inputStart)) {
            isPendingTx = true;
          }
        }

        if (isPendingTx) {
          throw Error(ERROR_CODE.PENDING);
        }

        const contract = getContract(
          GOVERNOR_ADDRESS,
          GevernorJson,
          provider,
          account,
        );

        const transaction = await contract
          .connect(provider.getSigner())
          .execute(proposalId, {
            gasLimit: '250000',
            // gasPrice: getDefaultGasPrice(),
          });

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
    transactionType: TransactionEventType.VOTE_PROPOSAL,
  };
};

export default useExecuteProposal;