import UniswapV2Router from '@/abis/UniswapV2Router.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { APP_ENV, UNIV2_ROUTER_ADDRESS, WALLET_URL } from '@/configs';
import { ERROR_CODE } from '@/constants/error';
import { CONTRACT_METHOD_IDS } from '@/constants/methodId';
import { MaxUint256 } from '@/constants/url';
import { TransactionEventType } from '@/enums/transaction';
import useBitcoin from '@/hooks/useBitcoin';
import useCheckTxsBitcoin from '@/hooks/useCheckTxsBitcoin';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { logErrorToServer, scanTrx } from '@/services/swap';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import { compareString, getContract, getDefaultGasPrice } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
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
  const { getUnInscribedTransactionDetailByAddress, getTCTxByHash } = useBitcoin();
  const { call: checkTxsBitcoin } = useCheckTxsBitcoin();

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

        let isPendingTx = false;

        const unInscribedTxIDs = await getUnInscribedTransactionDetailByAddress(
          account,
        );

        for await (const unInscribedTxID of unInscribedTxIDs) {
          const _getTxDetail = await getTCTxByHash(unInscribedTxID.Hash);
          const _inputStart = _getTxDetail.input.slice(0, 10);

          if (compareString(CONTRACT_METHOD_IDS.REMOVE_LIQUID, _inputStart)) {
            isPendingTx = true;
          }
        }

        if (isPendingTx) {
          throw Error(ERROR_CODE.PENDING);
        }

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
              gasLimit: '250000',
              gasPrice: getDefaultGasPrice(),
            },
          );

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '250000'",
        });

        store.dispatch(
          updateCurrentTransaction({
            status: TransactionStatus.pending,
            id: transactionType.createPoolApprove,
            hash: transaction.hash,
            infoTexts: {
              pending: `Please go to the trustless wallet and click on <a style="color: ${colors.bluePrimary}" href="${WALLET_URL}" target="_blank" >"Process Transaction"</a> for Bitcoin to complete this process.`,
            },
          }),
        );

        checkTxsBitcoin({
          txHash: transaction.hash,
          fnAction: () =>
            store.dispatch(
              updateCurrentTransaction({
                status: TransactionStatus.pending,
                id: transactionType.createPoolApprove,
                hash: transaction.hash,
                infoTexts: {
                  pending: `Transaction confirmed. Please wait for it to be processed on the Bitcoin. Note that it may take up to 10 minutes for a block confirmation on the Bitcoin blockchain.`,
                },
              }),
            ),
        });

        if (compareString(APP_ENV, 'production')) {
          await scanTrx({
            tx_hash: transaction.hash,
          });
        }

        return transaction;
      }

      return false;
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useRemoveLiquidity;
