/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadPoolJson from '@/abis/LaunchpadPool.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { getConnector } from '@/connection';
import { TransactionEventType } from '@/enums/transaction';
import useTCWallet from '@/hooks/useTCWallet';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { logErrorToServer } from '@/services/swap';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { getDefaultGasPrice, getDefaultProvider, getFunctionABI } from '@/utils';
import { ethers } from 'ethers';
import { useCallback } from 'react';

interface IClaimLaunchPoolParams {
  launchpadAddress: string;
}

const useClaimLaunchPad: ContractOperationHook<
  IClaimLaunchPoolParams,
  boolean
> = () => {
  const provider = getDefaultProvider();
  const connector = getConnector();
  const { tcWalletAddress: account } = useTCWallet();

  const call = useCallback(
    async (params: IClaimLaunchPoolParams): Promise<boolean> => {
      const { launchpadAddress } = params;
      if (account && provider && launchpadAddress) {
        const functionABI = getFunctionABI(LaunchpadPoolJson, 'redeem');

        const ContractInterface = new ethers.utils.Interface(functionABI.abi);

        const encodeAbi = ContractInterface.encodeFunctionData('redeem', []);

        const transaction = await connector.requestSign({
          target: '_blank',
          calldata: encodeAbi,
          to: launchpadAddress,
          value: '',
          redirectURL: window.location.href,
          isInscribe: true,
          gasLimit: '200000',
          gasPrice: getDefaultGasPrice(),
          functionType: functionABI.functionType,
          functionName: functionABI.functionName,
          from: account,
        });

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '200000'",
        });

        store.dispatch(
          updateCurrentTransaction({
            id: transactionType.depositLaunchpad,
            status: TransactionStatus.pending,
            hash: transaction.hash,
            infoTexts: {
              pending: `Transaction confirmed. Please wait for it to be processed on the Bitcoin. Note that it may take up to 10 minutes for a block confirmation on the Bitcoin blockchain.`,
            },
          }),
        );

        return transaction;
      }
      return false;
    },
    [account],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.END_LAUNCHPAD,
  };
};

export default useClaimLaunchPad;
