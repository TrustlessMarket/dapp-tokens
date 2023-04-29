import ERC20ABIJson from '@/abis/erc20.json';
import { UNIV2_ROUTER_ADDRESS } from '@/configs';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';

export interface IIsApproveERC20TokenParams {
  erc20TokenAddress: string;
}

const useIsApproveERC20Token: ContractOperationHook<
  IIsApproveERC20TokenParams,
  boolean
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IIsApproveERC20TokenParams): Promise<boolean> => {
      const { erc20TokenAddress } = params;
      if (account && provider && erc20TokenAddress) {
        const contract = getContract(erc20TokenAddress, ERC20ABIJson.abi, provider);

        const transaction = await contract
          .connect(provider.getSigner())
          .allowance(account, UNIV2_ROUTER_ADDRESS);

        return Number(transaction.toString()) !== 0;
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

export default useIsApproveERC20Token;
