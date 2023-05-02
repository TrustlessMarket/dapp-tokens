import ERC20ABIJson from '@/abis/erc20.json';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract } from '@/utils';
import { formatEthPrice } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';

export interface IBalanceERC20TokenParams {
  erc20TokenAddress: string;
}

const useBalanceERC20Token: ContractOperationHook<
  IBalanceERC20TokenParams,
  string
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IBalanceERC20TokenParams): Promise<string> => {
      const { erc20TokenAddress } = params;
      if (account && provider && erc20TokenAddress) {
        const contract = getContract(erc20TokenAddress, ERC20ABIJson.abi, provider);

        const transaction = await contract
          .connect(provider.getSigner())
          .balanceOf(account);

        return formatEthPrice(transaction.toString());
      }
      return '0';
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useBalanceERC20Token;
