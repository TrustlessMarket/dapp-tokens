import UniswapV2Router from '@/abis/UniswapV2Router.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { APP_ENV, UNIV2_ROUTER_ADDRESS } from '@/configs';
import { getConnector } from '@/connection';
import { ERROR_CODE } from '@/constants/error';
import { CONTRACT_METHOD_IDS } from '@/constants/methodId';
import { MaxUint256 } from '@/constants/url';
import { TransactionEventType } from '@/enums/transaction';
import useBitcoin from '@/hooks/useBitcoin';
import useTCWallet from '@/hooks/useTCWallet';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { logErrorToServer, scanTrx } from '@/services/swap';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import {
  compareString,
  getDefaultGasPrice,
  getDefaultProvider,
  getFunctionABI,
} from '@/utils';
import { ethers } from 'ethers';
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
  const { tcWalletAddress: account } = useTCWallet();
  const provider = getDefaultProvider();
  const connector = getConnector();
  const { getUnInscribedTransactionDetailByAddress, getTCTxByHash } = useBitcoin();

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
        const functionABI = getFunctionABI(UniswapV2Router, 'removeLiquidity');

        const ContractInterface = new ethers.utils.Interface(functionABI.abi);

        const encodeAbi = ContractInterface.encodeFunctionData('removeLiquidity', [
          tokenA,
          tokenB,
          liquidValue,
          Web3.utils.toWei(amountAMin, 'ether'),
          Web3.utils.toWei(amountBMin, 'ether'),
          account,
          MaxUint256,
        ]);

        const transaction = await connector.requestSign({
          target: '_blank',
          calldata: encodeAbi,
          to: UNIV2_ROUTER_ADDRESS,
          value: '',
          redirectURL: window.location.href,
          isInscribe: true,
          gasLimit: '250000',
          gasPrice: getDefaultGasPrice(),
          functionType: functionABI.functionType,
          functionName: functionABI.functionName,
          isExecuteTransaction: false,
          from: account,
        });

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
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useRemoveLiquidity;
