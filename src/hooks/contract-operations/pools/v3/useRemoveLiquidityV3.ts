/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import NonfungiblePositionManagerJson from '@/abis/NonfungiblePositionManager.json';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS } from '@/configs';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { getContract } from '@/utils';
import { MaxUint128 } from '@/utils/constants';
import { getDeadline } from '@/utils/number';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import web3 from 'web3';

export interface IRemoveLiquidityV3 {
  tokenId?: number;
  liquidity: any;
  amount0Min: any;
  amount1Min: any;
}

const useRemoveLiquidityV3: ContractOperationHook<
  IRemoveLiquidityV3,
  boolean
> = () => {
  const { provider, account } = useWeb3React();

  const call = useCallback(
    async (params: IRemoveLiquidityV3): Promise<boolean> => {
      const { tokenId, liquidity, amount0Min, amount1Min } = params;
      if (provider) {
        const contract = getContract(
          UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS,
          NonfungiblePositionManagerJson,
          provider,
          account,
        );

        const transaction = await contract.connect(provider.getSigner(0)).multicall([
          contract.interface.encodeFunctionData('decreaseLiquidity', [
            tokenId,
            liquidity,
            web3.utils.toWei(amount0Min),
            web3.utils.toWei(amount1Min),
            getDeadline(),
          ]),
          contract.interface.encodeFunctionData('collect', [
            {
              tokenId,
              recipient: account,
              amount0Max: MaxUint128,
              amount1Max: MaxUint128,
            },
          ]),
        ]);

        store.dispatch(
          updateCurrentTransaction({
            id: transactionType.removeLiquidity,
            status: TransactionStatus.pending,
            infoTexts: {
              pending: 'Transaction submitting...',
            },
          }),
        );

        return transaction;
      }

      return false;
    },
    [provider, account],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useRemoveLiquidityV3;
