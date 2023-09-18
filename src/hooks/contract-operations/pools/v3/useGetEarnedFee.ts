/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {TransactionEventType} from '@/enums/transaction';
import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {useWeb3React} from '@web3-react/core';
import {useCallback} from 'react';
import web3 from "web3";
import {getEarnedFee} from "trustless-swap-sdk";
export interface ICollectFeeV3 {
  tokenId?: number;
}

const useGetEarnedFeeV3: ContractOperationHook<ICollectFeeV3, number[]> = () => {
  const { provider, account } = useWeb3React();

  const call = useCallback(
    async (params: ICollectFeeV3): Promise<number[]> => {
      const { tokenId } = params;
      if (provider && account) {


        const transaction = await getEarnedFee(tokenId);

        return [
          Number(web3.utils.fromWei(transaction[0])),
          Number(web3.utils.fromWei(transaction[1]))
        ];
      }

      return [0, 0];
    },
    [provider, account],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useGetEarnedFeeV3;
