import ERC20ABIJson from '@/abis/erc20.json';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';

export interface IIsApproveERC20TokenParams {
  erc20TokenAddress: string;
  address: string;
  amount?: string;
}

const useIsApproveERC20Token: ContractOperationHook<
  IIsApproveERC20TokenParams,
  string
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IIsApproveERC20TokenParams): Promise<string> => {
      const { erc20TokenAddress, address } = params;
      if (account && provider && erc20TokenAddress) {
        const contract = getContract(erc20TokenAddress, ERC20ABIJson.abi, provider);

        const transaction = await contract
          .connect(provider.getSigner())
          .allowance(account, address);

        return transaction;
      }
      return '';
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useIsApproveERC20Token;
