/* eslint-disable @typescript-eslint/no-unused-vars */
import GovernorJson from '@/abis/Gevernor.json';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { logErrorToServer } from '@/services/swap';
import { getContract, getDefaultGasPrice, getDefaultProvider } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { GOVERNOR_ADDRESS } from '@/configs';

interface IDefeatParams {
  proposalId: string;
}

const useDefeatProposal: ContractOperationHook<IDefeatParams, boolean> = () => {
  const { account } = useWeb3React();
  const provider = getDefaultProvider();

  const call = useCallback(
    async (params: IDefeatParams): Promise<boolean> => {
      const { proposalId } = params;
      if (account && provider) {
        const contract = getContract(
          GOVERNOR_ADDRESS,
          GovernorJson,
          provider,
          account,
        );

        const transaction = await contract
          .connect(provider.getSigner())
          .execute(proposalId, {
            gasLimit: '250000',
            gasPrice: getDefaultGasPrice(),
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

export default useDefeatProposal;