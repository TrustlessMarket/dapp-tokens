import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import UniswapV2RouterJson from '@/abis/UniswapV2Router.json';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';
import { AssetsContext } from '@/contexts/assets-context';
import { getContract } from '@/utils';
import { UNIV2_ROUTER_ADDRESS } from '@/configs';
import Web3 from 'web3';
import { TransactionEventType } from '@/enums/transaction';

export interface IEstimateSwapERC20Token {
  addresses: string[];
  amount: string;
}

const useEstimateSwapERC20Token: ContractOperationHook<
  IEstimateSwapERC20Token,
  boolean
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

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
          .connect(provider.getSigner())
          .getAmountsOut(Web3.utils.toWei(amount, 'ether'), addresses);

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

export default useEstimateSwapERC20Token;
