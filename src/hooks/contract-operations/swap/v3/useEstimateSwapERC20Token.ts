import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {useWeb3React} from '@web3-react/core';
import {useCallback} from 'react';
import {getContract} from '@/utils';
import {UNIV3_QUOTERV2_ADDRESS} from '@/configs';
import Web3 from 'web3';
import {TransactionEventType} from '@/enums/transaction';
import QuoterV2Json from "@/abis/QuoterV2.json";
import {encodePath} from "@/utils/path";
import {FeeAmount} from "@/utils/constants";

export interface IEstimateSwapERC20Token {
  addresses: string[];
  amount: string;
}

const useEstimateSwapERC20Token: ContractOperationHook<
  IEstimateSwapERC20Token,
  boolean
> = () => {
  const { provider } = useWeb3React();

  const call = useCallback(
    async (params: IEstimateSwapERC20Token): Promise<boolean> => {
      const { addresses, amount } = params;
      if (provider) {
        const contract = getContract(
          UNIV3_QUOTERV2_ADDRESS,
          QuoterV2Json,
          provider,
        );

        const transaction = await contract
          .connect(provider)
          .quoteExactInput(
            encodePath(addresses, Array(addresses.length).fill(FeeAmount.MEDIUM)),
            Web3.utils.toWei(amount, 'ether')
          );

        return transaction;
      }

      return false;
    },
    [provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useEstimateSwapERC20Token;
