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
import { getContract, getGasFee } from '@/utils';
import { getDeadline } from '@/utils/number';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import web3 from 'web3';
import { scanTrx } from '@/services/swap-v3';

export interface IIncreaseLiquidityV3 {
  tokenId: number;
  amount0Desired: any;
  amount1Desired: any;
  amount0Min: any;
  amount1Min: any;
}

const useIncreaseLiquidityV3: ContractOperationHook<
  IIncreaseLiquidityV3,
  boolean
> = () => {
  const { provider, account } = useWeb3React();

  const call = useCallback(
    async (params: IIncreaseLiquidityV3): Promise<boolean> => {
      const { tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min } =
        params;
      if (provider) {
        const contract = getContract(
          UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS,
          NonfungiblePositionManagerJson,
          provider,
          account,
        );

        const transaction = await contract
          .connect(provider.getSigner(0))
          .increaseLiquidity(
            {
              tokenId,
              amount0Desired: web3.utils.toWei(amount0Desired),
              amount1Desired: web3.utils.toWei(amount1Desired),
              amount0Min: web3.utils.toWei(amount0Min),
              amount1Min: web3.utils.toWei(amount1Min),
              deadline: getDeadline(),
            },
            {
              gasPrice: getGasFee(),
            },
          );

        store.dispatch(
          updateCurrentTransaction({
            id: transactionType.increaseLiquidity,
            status: TransactionStatus.pending,
            infoTexts: {
              pending: 'Transaction confirmed. Please wait for it to be processed.',
            },
          }),
        );

        await scanTrx({
          tx_hash: transaction.hash,
        });

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

export default useIncreaseLiquidityV3;
