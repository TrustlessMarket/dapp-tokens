import UniswapV2Router from '@/abis/UniswapV2Router.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { APP_ENV, UNIV2_ROUTER_ADDRESS } from '@/configs';
import { MaxUint256 } from '@/constants/url';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { logErrorToServer, scanTrx } from '@/services/swap';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { compareString, getContract } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';
import Web3 from 'web3';

export interface IAddLiquidityParams {
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

const useAddLiquidity: ContractOperationHook<IAddLiquidityParams, boolean> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IAddLiquidityParams): Promise<boolean> => {
      const {
        tokenA,
        tokenB,
        amountAMin,
        amountADesired,
        amountBDesired,
        amountBMin,
        // to,
      } = params;

      if (account && provider && tokenA && tokenB) {
        const contract = getContract(
          UNIV2_ROUTER_ADDRESS,
          UniswapV2Router,
          provider,
          account,
        );

        // const [amountApproveA, amountApproveB] = await Promise.all([
        //   isApproveERC20Token({
        //     address: UNIV2_ROUTER_ADDRESS,
        //     erc20TokenAddress: tokenA,
        //   }),
        //   isApproveERC20Token({
        //     address: UNIV2_ROUTER_ADDRESS,
        //     erc20TokenAddress: tokenB,
        //   }),
        // ]);

        // console.log('amountApproveA', amountApproveA);
        // console.log('amountApproveB', amountApproveB);

        // let isPendingTx = false;

        // const unInscribedTxIDs = await getUnInscribedTransactionDetailByAddress(
        //   account,
        // );

        // for await (const unInscribedTxID of unInscribedTxIDs) {
        //   const _getTxDetail = await getTCTxByHash(unInscribedTxID.Hash);
        //   const _inputStart = _getTxDetail.input.slice(0, 10);

        //   if (compareString(funcLiquidHex, _inputStart)) {
        //     isPendingTx = true;
        //   }
        // }

        // if (isPendingTx) {
        //   throw Error(ERROR_CODE.PENDING);
        // }

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
          .addLiquidity(
            tokenA,
            tokenB,
            Web3.utils.toWei(amountADesired, 'ether'),
            Web3.utils.toWei(amountBDesired, 'ether'),
            Web3.utils.toWei(amountAMin, 'ether'),
            Web3.utils.toWei(amountBMin, 'ether'),
            account,
            MaxUint256,
            {
              gasLimit: '1000000',
            },
          );

        // TC_SDK.signTransaction({
        //   method: `${DAppType.ERC20} - ${TransactionEventType.CREATE}`,
        //   hash: transaction.hash,
        //   dappURL: window.location.origin,
        //   isRedirect: true,
        //   target: '_blank',
        //   isMainnet: isProduction(),
        // });

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '1000000'",
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

        // await transaction.wait();

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
    transactionType: TransactionEventType.ADD_POOL,
  };
};

export default useAddLiquidity;
