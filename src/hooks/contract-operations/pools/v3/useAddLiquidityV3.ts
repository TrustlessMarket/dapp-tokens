/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import NonfungiblePositionManagerJson from '@/abis/NonfungiblePositionManager.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS } from '@/configs';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { IToken } from '@/interfaces/token';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { isPool } from '@/modules/PoolsV2/utils';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { compareString, getContract, sortAddressPair } from '@/utils';
import { getDeadline } from '@/utils/number';
import { formatPriceToPriceSqrt } from '@/utils/utilities';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import web3 from 'web3';
import { scanTrx } from '@/services/swap-v3';

export interface IAddLiquidityV3 {
  tokenA: IToken;
  tokenB: IToken;
  amountADesired: any;
  amountBDesired: any;
  lowerTick: any;
  upperTick: any;
  fee: any;
  amount0Min: any;
  amount1Min: any;
  currentPrice: any;
  poolAddress: any;
}

const useAddLiquidityV3: ContractOperationHook<IAddLiquidityV3, boolean> = () => {
  const { provider, account } = useWeb3React();

  const call = useCallback(
    async (params: IAddLiquidityV3): Promise<boolean> => {
      let {
        tokenA,
        tokenB,
        fee,
        amountADesired,
        amountBDesired,
        lowerTick,
        upperTick,
        amount0Min,
        amount1Min,
        currentPrice,
        poolAddress,
      } = params;
      if (provider) {
        const contract = getContract(
          UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS,
          NonfungiblePositionManagerJson,
          provider,
          account,
        );

        let [token0, token1] = sortAddressPair(tokenA, tokenB);

        const isRevert = !compareString(token0.address, tokenA.address);

        if (isRevert) {
          [amountADesired, amountBDesired] = [amountBDesired, amountADesired];
          [lowerTick, upperTick] = [-upperTick, -lowerTick];
        }

        let transaction;

        if (isPool(poolAddress)) {
          transaction = await contract.connect(provider.getSigner(0)).mint({
            token0: token0.address,
            token1: token1.address,
            fee: fee.toString(),
            tickLower: lowerTick.toString(),
            tickUpper: upperTick.toString(),
            amount0Desired: web3.utils.toWei(amountADesired),
            amount1Desired: web3.utils.toWei(amountBDesired),
            amount0Min: web3.utils.toWei(amount0Min),
            amount1Min: web3.utils.toWei(amount1Min),
            recipient: account,
            deadline: getDeadline(),
          });
        } else {
          transaction = await contract.connect(provider.getSigner(0)).multicall([
            contract.interface.encodeFunctionData(
              'createAndInitializePoolIfNecessary',
              [
                token0.address,
                token1.address,
                fee,
                formatPriceToPriceSqrt(currentPrice),
              ],
            ),
            contract.interface.encodeFunctionData('mint', [
              {
                token0: token0.address,
                token1: token1.address,
                fee: fee.toString(),
                tickLower: lowerTick.toString(),
                tickUpper: upperTick.toString(),
                amount0Desired: web3.utils.toWei(amountADesired),
                amount1Desired: web3.utils.toWei(amountBDesired),
                amount0Min: web3.utils.toWei(amount0Min),
                amount1Min: web3.utils.toWei(amount1Min),
                recipient: account,
                deadline: getDeadline(),
              },
            ]),
          ]);
        }

        store.dispatch(
          updateCurrentTransaction({
            id: transactionType.createPool,
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

export default useAddLiquidityV3;
