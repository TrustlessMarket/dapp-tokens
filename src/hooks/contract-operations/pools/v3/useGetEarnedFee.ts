/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import NonfungiblePositionManagerJson from '@/abis/NonfungiblePositionManager.json';
import {UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS} from '@/configs';
import {TransactionEventType} from '@/enums/transaction';
import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {getContract} from '@/utils';
import {MaxUint128} from '@/utils/constants';
import {useWeb3React} from '@web3-react/core';
import {useCallback} from 'react';
import web3 from "web3";

export interface ICollectFeeV3 {
  tokenId?: number;
}

const useGetEarnedFeeV3: ContractOperationHook<ICollectFeeV3, number[]> = () => {
  const { provider, account } = useWeb3React();

  const call = useCallback(
    async (params: ICollectFeeV3): Promise<number[]> => {
      const { tokenId } = params;
      if (provider && account) {
        const contract = getContract(
          UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS,
          NonfungiblePositionManagerJson,
          provider,
          account,
        );

        const transaction = await contract.callStatic.collect({
          tokenId,
          recipient: account,
          amount0Max: MaxUint128,
          amount1Max: MaxUint128,
        });

        return [
          Number(web3.utils.fromWei(transaction.amount0.toString())),
          Number(web3.utils.fromWei(transaction.amount1.toString()))
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
