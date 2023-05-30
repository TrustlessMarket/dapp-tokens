/* eslint-disable @typescript-eslint/no-unused-vars */
import GovernorJson from '@/abis/Gevernor.json';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { logErrorToServer } from '@/services/swap';
import {
  getContract,
  getDefaultGasPrice,
  getDefaultProvider,
  getFunctionABI,
} from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { GOVERNOR_ADDRESS } from '@/configs';
import useTCWallet from '@/hooks/useTCWallet';
import { ethers } from 'ethers';
import { getConnector } from '@/connection';

interface IDefeatParams {
  proposalId: string;
}

const useDefeatProposal: ContractOperationHook<IDefeatParams, boolean> = () => {
  const { tcWalletAddress: account } = useTCWallet();
  const provider = getDefaultProvider();
  const connector = getConnector();

  const call = useCallback(
    async (params: IDefeatParams): Promise<boolean> => {
      const { proposalId } = params;
      if (account && provider) {
        const functionABI = getFunctionABI(GovernorJson, 'defeat');

        const ContractInterface = new ethers.utils.Interface(functionABI.abi);

        const encodeAbi = ContractInterface.encodeFunctionData('defeat', [
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

export default useDefeatProposal;
