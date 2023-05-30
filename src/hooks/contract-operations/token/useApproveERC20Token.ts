import ERC20ABIJson from '@/abis/erc20.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { getConnector } from '@/connection';
import { MaxUint256 } from '@/constants/url';
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

export interface IApproveERC20TokenParams {
  address: string;
  erc20TokenAddress: string;
}

const useApproveERC20Token: ContractOperationHook<
  IApproveERC20TokenParams,
  boolean
> = () => {
  const { tcWalletAddress: account } = useTCWallet();
  const provider = getDefaultProvider();
  const connector = getConnector();

  const call = useCallback(
    async (params: IApproveERC20TokenParams): Promise<boolean> => {
      const { address, erc20TokenAddress } = params;

      if (account && provider && erc20TokenAddress) {
        const functionABI = getFunctionABI(ERC20ABIJson.abi, 'approve');

        const ContractInterface = new ethers.utils.Interface(functionABI.abi);

        const encodeAbi = ContractInterface.encodeFunctionData('approve', [
          address,
          MaxUint256,
        ]);

        const transaction = await connector.requestSign({
          target: '_blank',
          calldata: encodeAbi,
          to: erc20TokenAddress,
          value: '',
          redirectURL: window.location.href,
          isInscribe: false,
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

        store.dispatch(
          updateCurrentTransaction({
            id: transactionType.createPoolApprove,
            status: TransactionStatus.pending,
            hash: transaction.hash,
            infoTexts: {
              pending: `Approving for ${address}`,
            },
          }),
        );

        return transaction;
      }

      return false;
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useApproveERC20Token;
