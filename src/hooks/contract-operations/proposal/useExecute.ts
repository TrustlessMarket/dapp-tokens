/* eslint-disable @typescript-eslint/no-unused-vars */
import GovernorJson from '@/abis/Gevernor.json';
import { GOVERNOR_ADDRESS } from '@/configs';
import { getConnector } from '@/connection';
import { TransactionEventType } from '@/enums/transaction';
import useTCWallet from '@/hooks/useTCWallet';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { logErrorToServer } from '@/services/swap';
import { getDefaultGasPrice, getDefaultProvider, getFunctionABI } from '@/utils';
import { ethers } from 'ethers';
import { useCallback } from 'react';

interface IExecuteParams {
  proposalId: string;
}

const useExecuteProposal: ContractOperationHook<IExecuteParams, boolean> = () => {
  const { tcWalletAddress: account } = useTCWallet();
  const provider = getDefaultProvider();
  const connector = getConnector();

  const call = useCallback(
    async (params: IExecuteParams): Promise<boolean> => {
      const { proposalId } = params;
      if (account && provider && proposalId) {
        const functionABI = getFunctionABI(GovernorJson, 'execute');

        const ContractInterface = new ethers.utils.Interface(functionABI.abi);

        const encodeAbi = ContractInterface.encodeFunctionData('execute', [
          proposalId,
        ]);

        const transaction = await connector.requestSign({
          target: '_blank',
          calldata: encodeAbi,
          to: GOVERNOR_ADDRESS,
          value: '',
          redirectURL: window.location.href,
          isInscribe: true,
          gasLimit: '250000',
          gasPrice: getDefaultGasPrice(),
          functionType: functionABI.functionType,
          functionName: functionABI.functionName,
          from: account,
        });

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '250000'",
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

export default useExecuteProposal;
