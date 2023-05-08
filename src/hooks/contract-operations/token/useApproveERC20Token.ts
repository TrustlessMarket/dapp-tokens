import ERC20ABIJson from '@/abis/erc20.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { MaxUint256 } from '@/constants/url';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { logErrorToServer } from '@/services/swap';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { getContract } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';

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

        const transaction = await contract
          .connect(provider.getSigner())
          .approve(address, MaxUint256, {
            gasLimit: '100000',
          });

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '100000'",
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

        // await transaction.wait();

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
