/* eslint-disable @typescript-eslint/no-unused-vars */
import GovernorJson from '@/abis/Gevernor.json';
import {GOVERNOR_ADDRESS} from '@/configs';
import {getConnector} from '@/connection';
import {TransactionEventType} from '@/enums/transaction';
import useTCWallet from '@/hooks/useTCWallet';
import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {logErrorToServer} from '@/services/swap';
import {compareString, getDefaultGasPrice, getDefaultProvider, getFunctionABI} from '@/utils';
import {ethers} from 'ethers';
import {useCallback} from 'react';
import {CONTRACT_METHOD_IDS} from "@/constants/methodId";
import {ERROR_CODE} from "@/constants/error";
import useBitcoin from "@/hooks/useBitcoin";

interface ICastVoteParams {
  proposalId: string;
  weight: string;
  support?: string;
  signature?: string;
}

const useCastVoteProposal: ContractOperationHook<ICastVoteParams, boolean> = () => {
  const { tcWalletAddress: account } = useTCWallet();
  const provider = getDefaultProvider();
  const connector = getConnector();
  const { getUnInscribedTransactionDetailByAddress, getTCTxByHash } = useBitcoin();

  const call = useCallback(
    async (params: ICastVoteParams): Promise<boolean> => {
      const { proposalId, weight, support, signature } = params;
      if (account && provider) {
        let isPendingTx = false;

        const unInscribedTxIDs = await getUnInscribedTransactionDetailByAddress(
          account,
        );

        for await (const unInscribedTxID of unInscribedTxIDs) {
          const _getTxDetail = await getTCTxByHash(unInscribedTxID.Hash);

          const _inputStart = _getTxDetail.input.slice(0, 10);

          if (compareString(CONTRACT_METHOD_IDS.CAST_VOTE, _inputStart)) {
            isPendingTx = true;
          }
        }

        if (isPendingTx) {
          throw Error(ERROR_CODE.PENDING);
        }

        const functionABI = getFunctionABI(GovernorJson, 'castVote');

        const ContractInterface = new ethers.utils.Interface(functionABI.abi);

        const encodeAbi = ContractInterface.encodeFunctionData('castVote', [
          proposalId,
          weight,
          support,
          signature || Buffer.from([]),
        ]);

        const transaction = await connector.requestSign({
          target: '_blank',
          calldata: encodeAbi,
          to: GOVERNOR_ADDRESS,
          value: '',
          redirectURL: window.location.href,
          isInscribe: true,
          gasLimit: '150000',
          gasPrice: getDefaultGasPrice(),
          functionType: functionABI.functionType,
          functionName: functionABI.functionName,
          from: account,
        });

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '150000'",
        });

        return transaction;
      }
      return false;
    },
    [account],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.VOTE_PROPOSAL,
  };
};

export default useCastVoteProposal;
