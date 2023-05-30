/* eslint-disable @typescript-eslint/no-unused-vars */
import GevernorJson from '@/abis/Gevernor.json';
import {TransactionEventType} from '@/enums/transaction';
import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {logErrorToServer} from '@/services/swap';
import {getContract, getDefaultProvider} from '@/utils';
import {useWeb3React} from '@web3-react/core';
import {useCallback} from 'react';
import web3 from 'web3';
import {GOVERNOR_ADDRESS} from "@/configs";

interface ICastVoteParams {
  proposalId: string;
  weight: string;
  support?: string;
  signature?: string;
}

const useCastVoteProposal: ContractOperationHook<ICastVoteParams, boolean> = () => {
  const { account } = useWeb3React();
  const provider = getDefaultProvider();

  const call = useCallback(
    async (params: ICastVoteParams): Promise<boolean> => {
      const { proposalId, weight, support, signature } = params;
      if (account && provider) {
        const contract = getContract(
          GOVERNOR_ADDRESS,
          GevernorJson,
          provider,
          account,
        );

        const transaction = await contract
          .connect(provider.getSigner())
          .castVote(
            proposalId,
            web3.utils.toWei(weight),
            support,
            signature || Buffer.from([]),
            {
              gasLimit: '250000',
              // gasPrice: getDefaultGasPrice(),
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
    transactionType: TransactionEventType.VOTE_PROPOSAL,
  };
};

export default useCastVoteProposal;
