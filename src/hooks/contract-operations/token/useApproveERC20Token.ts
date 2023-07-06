import ERC20ABIJson from '@/abis/erc20.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { MaxUint256 } from '@/constants/url';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { logErrorToServer } from '@/services/swap';
import store from '@/state';
import { selectPnftExchange, updateCurrentTransaction } from '@/state/pnftExchange';
import { compareString, getContract, getDefaultGasPrice, getGasFee } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';
import { useAppSelector } from '@/state/hooks';
import { IResourceChain } from '@/interfaces/chain';
import { SupportedChainId } from '@/constants/chains';

export interface IApproveERC20TokenParams {
  address: string;
  erc20TokenAddress: string;
}

const useApproveERC20Token: ContractOperationHook<
  IApproveERC20TokenParams,
  boolean
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const currentChain: IResourceChain =
    useAppSelector(selectPnftExchange).currentChain;

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
          compareString(currentChain.chainId, SupportedChainId.TRUSTLESS_COMPUTER)
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

        if (
          !compareString(currentChain.chainId, SupportedChainId.TRUSTLESS_COMPUTER)
        ) {
          await transaction.wait();
        }

        return transaction;
      }

      return false;
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useApproveERC20Token;
