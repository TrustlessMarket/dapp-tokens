import UniswapV2RouterJson from '@/abis/UniswapV2Router.json';
import { UNIV2_ROUTER_ADDRESS } from '@/configs';
import { TransactionEventType } from '@/enums/transaction';
import useTCWallet from '@/hooks/useTCWallet';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract, getDefaultProvider } from '@/utils';
import { useCallback } from 'react';
import Web3 from 'web3';

export interface IEstimateSwapERC20Token {
  addresses: string[];
  amount: string;
}

const useEstimateSwapERC20Token: ContractOperationHook<
  IEstimateSwapERC20Token,
  boolean
> = () => {
  const { tcWalletAddress: account } = useTCWallet();

  const provider = getDefaultProvider();

  const call = useCallback(
    async (params: IEstimateSwapERC20Token): Promise<boolean> => {
      const { addresses, amount } = params;
      if (account && provider) {
        const contract = getContract(
          UNIV2_ROUTER_ADDRESS,
          UniswapV2RouterJson,
          provider,
          account,
        );

        const transaction = await contract
          .connect(provider)
          .getAmountsOut(Web3.utils.toWei(amount, 'ether'), addresses);

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

export default useEstimateSwapERC20Token;
