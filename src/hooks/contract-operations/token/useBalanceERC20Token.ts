import ERC20ABIJson from '@/abis/erc20.json';
import {TransactionEventType} from '@/enums/transaction';
import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {getContract} from '@/utils';
import {formatAmountBigNumber} from '@/utils/format';
import {useWeb3React} from '@web3-react/core';
import {useCallback} from 'react';

export interface IBalanceERC20TokenParams {
  erc20TokenAddress: string;
}

const useBalanceERC20Token: ContractOperationHook<
  IBalanceERC20TokenParams,
  string
> = () => {
  const { account, provider } = useWeb3React();

  const call = useCallback(
    async (params: IBalanceERC20TokenParams): Promise<string> => {
      const { erc20TokenAddress } = params;
      if (account && provider && erc20TokenAddress) {
        const contract = getContract(erc20TokenAddress, ERC20ABIJson.abi, provider);

        const transaction = await contract
          .connect(provider.getSigner())
          .balanceOf(account);

        console.log('useBalanceERC20Token', transaction.toString());

        return formatAmountBigNumber(transaction.toString(), 18).toString();
      }
      return '0';
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useBalanceERC20Token;
