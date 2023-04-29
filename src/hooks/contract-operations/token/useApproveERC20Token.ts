import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import ERC20ABIJson from '@/abis/erc20.json';
import {useWeb3React} from '@web3-react/core';
import {useCallback} from 'react';
import {getContract} from '@/utils';
import Web3 from 'web3';
import {TransactionEventType} from '@/enums/transaction';

export interface IApproveERC20TokenParams {
  address: string;
  amount: string;
  erc20TokenAddress: string;
}

const useApproveERC20Token: ContractOperationHook<IApproveERC20TokenParams, boolean> = () => {
  const { account, provider } = useWeb3React();

  const call = useCallback(
    async (params: IApproveERC20TokenParams): Promise<boolean> => {
      const { address, amount, erc20TokenAddress } = params;
      if (account && provider && erc20TokenAddress) {
        const contract = getContract(erc20TokenAddress, ERC20ABIJson.abi, provider, account);

        const transaction = await contract
          .connect(provider.getSigner())
          .approve(address, Web3.utils.toWei(amount, 'ether'));

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
