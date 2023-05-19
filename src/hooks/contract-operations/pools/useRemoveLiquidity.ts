import UniswapV2Router from '@/abis/UniswapV2Router.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { APP_ENV, TRANSFER_TX_SIZE, UNIV2_ROUTER_ADDRESS } from '@/configs';
import { ERROR_CODE } from '@/constants/error';
import { MaxUint256 } from '@/constants/url';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import useBitcoin from '@/hooks/useBitcoin';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { logErrorToServer, scanTrx } from '@/services/swap';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { compareString, getContract } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';
import Web3 from 'web3';

export interface IRemoveLiquidParams {
  tokenA: string;
  tokenB: string;
  amountAMin: string;
  amountBMin: string;
  liquidValue: string;
}

const useRemoveLiquidity: ContractOperationHook<
  IRemoveLiquidParams,
  boolean
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);
  const { getUnInscribedTransactionDetailByAddress, getTCTxByHash } = useBitcoin();

  const funcRemoveLiquidHex = '0xbaa2abde';

  const call = useCallback(
    async (params: IRemoveLiquidParams): Promise<boolean> => {
      const {
        tokenA,
        tokenB,
        amountAMin,
        amountBMin,
        liquidValue,
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

        let isPendingTx = false;

        const unInscribedTxIDs = await getUnInscribedTransactionDetailByAddress(
          account,
        );

        for await (const unInscribedTxID of unInscribedTxIDs) {
          console.log('unInscribedTxID', unInscribedTxID);

          const _getTxDetail = await getTCTxByHash(unInscribedTxID.Hash);
          const _inputStart = _getTxDetail.input.slice(0, 10);

          console.log('_inputStart', _inputStart);

          if (compareString(funcRemoveLiquidHex, _inputStart)) {
            isPendingTx = true;
          }
        }

        if (isPendingTx) {
          throw Error(ERROR_CODE.PENDING);
        }

        // if (compareString(APP_ENV, 'production')) {
        //   const estimatedFee = TC_SDK.estimateInscribeFee({
        //     tcTxSizeByte: TRANSFER_TX_SIZE,
        //     feeRatePerByte: feeRate.fastestFee,
        //   });
        //   const balanceInBN = new BigNumber(btcBalance);
        //   if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
        //     throw Error(
        //       `Your balance is insufficient. Please top up at least ${formatBTCPrice(
        //         estimatedFee.totalFee.toString(),
        //       )} BTC to pay network fee.`,
        //     );
        //   }
        // }

        const transaction = await contract
          .connect(provider.getSigner())
          .removeLiquidity(
            tokenA,
            tokenB,
            liquidValue,
            Web3.utils.toWei(amountAMin, 'ether'),
            Web3.utils.toWei(amountBMin, 'ether'),
            account,
            MaxUint256,
            {
              gasLimit: '500000',
            },
          );

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '500000'",
        });

        store.dispatch(
          updateCurrentTransaction({
            status: TransactionStatus.pending,
            id: transactionType.createPoolApprove,
            hash: transaction.hash,
            infoTexts: {
              pending: `Transaction confirmed. Please wait for it to be processed on the Bitcoin. Note that it may take up to 10 minutes for a block confirmation on the Bitcoin blockchain.`,
            },
          }),
        );

        if (compareString(APP_ENV, 'production')) {
          await scanTrx({
            tx_hash: transaction.hash,
          });
        }

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

export default useRemoveLiquidity;
