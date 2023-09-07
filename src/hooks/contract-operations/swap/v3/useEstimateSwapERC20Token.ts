import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {useWeb3React} from '@web3-react/core';
import {useCallback} from 'react';
import {getContract} from '@/utils';
import {UNIV3_QUOTERV2_ADDRESS} from '@/configs';
import Web3 from 'web3';
import {TransactionEventType} from '@/enums/transaction';
import QuoterV2Json from "@/abis/QuoterV2.json";
import {encodePath} from "@/utils/path";
import web3 from "web3";

export interface IEstimateSwapERC20Token {
  addresses: string[];
  fees: number[];
  amount: string;
}

const useEstimateSwapERC20Token: ContractOperationHook<
  IEstimateSwapERC20Token,
  number
> = () => {
  const { provider } = useWeb3React();

  const call = useCallback(
    async (params: IEstimateSwapERC20Token): Promise<number> => {
      const { addresses, fees, amount } = params;
      if (provider) {
        const contract = getContract(
          UNIV3_QUOTERV2_ADDRESS,
          QuoterV2Json,
          provider,
        );

        try {
          const transaction = await contract
              .connect(provider)
              .callStatic
              .quoteExactInput(
                  encodePath(addresses, fees),
                  Web3.utils.toWei(amount, 'ether')
              );

          return Number(web3.utils.fromWei(transaction.amountOut.toString()));
        }
        catch(err) {
          return  -1
        }
      }

      return 0;
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
