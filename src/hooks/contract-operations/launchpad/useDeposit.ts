/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadPoolJson from '@/abis/LaunchpadPool.json';
import { getConnector } from '@/connection';
import { TransactionEventType } from '@/enums/transaction';
import useTCWallet from '@/hooks/useTCWallet';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { logErrorToServer } from '@/services/swap';
import { getDefaultGasPrice, getDefaultProvider, getFunctionABI } from '@/utils';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import web3 from 'web3';

interface IDepositPoolParams {
  amount: string;
  launchpadAddress: string;
  boostRatio?: string;
  signature?: string;
}

const useDepositPool: ContractOperationHook<IDepositPoolParams, boolean> = () => {
  const provider = getDefaultProvider();
  const connector = getConnector();
  const { tcWalletAddress: account } = useTCWallet();

  const call = useCallback(
    async (params: IDepositPoolParams): Promise<boolean> => {
      const { amount, launchpadAddress, boostRatio, signature } = params;
      if (account && provider && launchpadAddress) {
        const functionABI = getFunctionABI(LaunchpadPoolJson, 'deposit');

        const ContractInterface = new ethers.utils.Interface(functionABI.abi);

        const encodeAbi = ContractInterface.encodeFunctionData('deposit', [
          web3.utils.toWei(amount),
          boostRatio,
          signature || Buffer.from([]),
        ]);

        const transaction = await connector.requestSign({
          target: '_blank',
          calldata: encodeAbi,
          to: launchpadAddress,
          value: '',
          redirectURL: window.location.href,
          isInscribe: true,
          gasLimit: '250000',
          gasPrice: getDefaultGasPrice(),
          functionType: functionABI.functionType,
          functionName: functionABI.functionName,
          isExecuteTransaction: false,
          from: account,
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
    [account],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.DEPOSIT_LAUNCHPAD,
  };
};

export default useDepositPool;
