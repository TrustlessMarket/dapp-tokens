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
import web3 from "web3";

export interface IEstimateSwapERC20Token {
  addresses: string[];
  amount: string;
}

const useEstimateSwapERC20Token: ContractOperationHook<
  IEstimateSwapERC20Token,
  string
> = () => {
  const { provider } = useWeb3React();

  const call = useCallback(
    async (params: IEstimateSwapERC20Token): Promise<string> => {
      const { addresses, amount } = params;
      if (provider) {
        const contract = getContract(
          UNIV3_QUOTERV2_ADDRESS,
          QuoterV2Json,
          provider,
        );

        const fees = Array(addresses.length - 1).fill(FeeAmount.MEDIUM);

        const transaction = await contract
          .connect(provider)
          .callStatic
          .quoteExactInput(
            encodePath(addresses, fees),
            Web3.utils.toWei(amount, 'ether')
          );

        return web3.utils.fromWei(transaction.amountOut.toString());
      }

      return "0";
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
