import UniswapV2Router from '@/abis/UniswapV2Router.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { APP_ENV, UNIV2_ROUTER_ADDRESS } from '@/configs';
import { getConnector } from '@/connection';
import { MaxUint256 } from '@/constants/url';
import { TransactionEventType } from '@/enums/transaction';
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

export interface IAddLiquidityParams {
  tokenA: string;
  amountADesired: string;
  amountAMin: string;
  decimalA?: string;
  tokenB: string;
  amountBDesired: string;
  amountBMin: string;
  decimalB?: string;
  isPaired: boolean;
}

const useAddLiquidity: ContractOperationHook<IAddLiquidityParams, boolean> = () => {
  const { tcWalletAddress: account } = useTCWallet();
  const provider = getDefaultProvider();
  const connector = getConnector();

  const call = useCallback(
    async (params: IAddLiquidityParams): Promise<boolean> => {
      const {
        tokenA,
        tokenB,
        amountAMin,
        amountADesired,
        amountBDesired,
        amountBMin,
        isPaired,
      } = params;

      if (account && provider && tokenA && tokenB && connector) {
        const functionABI = getFunctionABI(UniswapV2Router, 'addLiquidity');

        const ContractInterface = new ethers.utils.Interface(functionABI.abi);

        const encodeAbi = ContractInterface.encodeFunctionData('addLiquidity', [
          tokenA,
          tokenB,
          Web3.utils.toWei(amountADesired, 'ether'),
          Web3.utils.toWei(amountBDesired, 'ether'),
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
          gasLimit: isPaired ? '300000' : '800000',
          gasPrice: getDefaultGasPrice(),
          functionType: functionABI.functionType,
          functionName: functionABI.functionName,
          isExecuteTransaction: false,
          from: account,
        });

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
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.ADD_POOL,
  };
};

export default useAddLiquidity;
