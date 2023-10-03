import ERC20ABIJson from '@/abis/erc20.json';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { SupportedChainId } from '@/constants/chains';
import { MaxUint256 } from '@/constants/url';
import { TransactionEventType } from '@/enums/transaction';
import { IResourceChain } from '@/interfaces/chain';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { logErrorToServer } from '@/services/swap';
import store from '@/state';
import { useAppSelector } from '@/state/hooks';
import { currentChainSelector, updateCurrentTransaction } from '@/state/pnftExchange';
import { compareString, getContract, getDefaultGasPrice, getGasFee } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';

export interface IApproveERC20TokenParams {
  address: string;
  erc20TokenAddress: string;
}

const useApproveERC20Token: ContractOperationHook<
  IApproveERC20TokenParams,
  boolean
> = () => {
  const { account, provider } = useWeb3React();

  const currentChain: IResourceChain = useAppSelector(currentChainSelector);

  const call = useCallback(
    async (params: IApproveERC20TokenParams): Promise<boolean> => {
      const { address, erc20TokenAddress } = params;

      if (account && provider && erc20TokenAddress) {
        const contract = getContract(
          erc20TokenAddress,
          ERC20ABIJson.abi,
          provider,
          account,
        );

        const transaction = await contract.connect(provider.getSigner()).approve(
          address,
          MaxUint256,
          compareString(currentChain?.chainId, SupportedChainId.TRUSTLESS_COMPUTER)
            ? {
              gasLimit: '150000',
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
          message: 'gasLimit: \'150000\'',
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

        if (
          !compareString(currentChain.chainId, SupportedChainId.TRUSTLESS_COMPUTER)
        ) {
          await transaction.wait();
        }

        return transaction;
      }

      return false;
    },
    [account, provider, currentChain],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useApproveERC20Token;
