import UniswapV2Router from '@/abis/UniswapV2Router.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { APP_ENV, TRANSFER_TX_SIZE, UNIV2_ROUTER_ADDRESS } from '@/configs';
import { MaxUint256 } from '@/constants/url';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { compareString, getContract } from '@/utils';
import { formatBTCPrice, formatEthPriceSubmit } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useCallback, useContext } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';

export interface IGetReservesParams {
  tokenA: string;
  amountADesired: string;
  amountAMin: string;
  decimalA?: string;
  tokenB: string;
  amountBDesired: string;
  amountBMin: string;
  decimalB?: string;
  //   to: string;
}

const useAddLiquidity: ContractOperationHook<IGetReservesParams, boolean> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IGetReservesParams): Promise<boolean> => {
      const {
        tokenA,
        tokenB,
        amountAMin,
        amountADesired,
        amountBDesired,
        amountBMin,
        // to,
      } = params;

      if (account && provider) {
        const contract = getContract(
          UNIV2_ROUTER_ADDRESS,
          UniswapV2Router,
          provider,
          account,
        );
        console.log({
          tcTxSizeByte: TRANSFER_TX_SIZE,
          feeRatePerByte: feeRate.fastestFee,
        });

        if (compareString(APP_ENV, 'production')) {
          const estimatedFee = TC_SDK.estimateInscribeFee({
            tcTxSizeByte: TRANSFER_TX_SIZE,
            feeRatePerByte: feeRate.fastestFee,
          });
          const balanceInBN = new BigNumber(btcBalance);
          if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
            throw Error(
              `Your balance is insufficient. Please top up at least ${formatBTCPrice(
                estimatedFee.totalFee.toString(),
              )} BTC to pay network fee.`,
            );
          }
        }

        const transaction = await contract
          .connect(provider.getSigner())
          .addLiquidity(
            tokenA,
            tokenB,
            formatEthPriceSubmit(amountADesired),
            formatEthPriceSubmit(amountBDesired),
            formatEthPriceSubmit(amountAMin),
            formatEthPriceSubmit(amountBMin),
            account,
            MaxUint256,
          );

        store.dispatch(
          updateCurrentTransaction({
            status: TransactionStatus.pending,
            id: transactionType.createPool,
            infoTexts: {
              pending: `Adding liquidity...`,
            },
          }),
        );

        await transaction.wait();

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

export default useAddLiquidity;
