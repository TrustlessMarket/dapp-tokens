import ERC20ABIJson from '@/abis/erc20.json';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract, isConnectedTrustChain } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import web3 from 'web3';

export interface IBalanceERC20TokenParams {
  erc20TokenAddress: string;
}

const useBalanceERC20Token: ContractOperationHook<
  IBalanceERC20TokenParams,
  string
> = () => {
  const { account, provider } = useWeb3React();
  const isConnected = isConnectedTrustChain();

  const call = useCallback(
    async (params: IBalanceERC20TokenParams): Promise<string> => {
      const { erc20TokenAddress } = params;
      if (account && provider && erc20TokenAddress && isConnected) {
        const contract = getContract(erc20TokenAddress, ERC20ABIJson.abi, provider);

        const transaction = await contract
          .connect(provider.getSigner())
          .balanceOf(account);

        return web3.utils.fromWei(transaction.toString());
      }
      return '0';
    },
    [account, provider, isConnected],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useBalanceERC20Token;
