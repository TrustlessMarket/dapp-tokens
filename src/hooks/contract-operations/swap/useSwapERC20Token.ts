import UniswapV2RouterJson from '@/abis/UniswapV2Router.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { UNIV2_ROUTER_ADDRESS } from '@/configs';
import { getConnector } from '@/connection';
import { ERROR_CODE } from '@/constants/error';
import { CONTRACT_METHOD_IDS } from '@/constants/methodId';
import { MaxUint256 } from '@/constants/url';
import { TransactionEventType } from '@/enums/transaction';
import useBitcoin from '@/hooks/useBitcoin';
import useTCWallet from '@/hooks/useTCWallet';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { logErrorToServer } from '@/services/swap';
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

export interface ISwapERC20TokenParams {
  addresses: string[];
  address?: string | undefined;
  amount: string;
  amountOutMin: string;
}

const useSwapERC20Token: ContractOperationHook<
  ISwapERC20TokenParams,
  boolean
> = () => {
  const { tcWalletAddress: account } = useTCWallet();
  const provider = getDefaultProvider();
  const connector = getConnector();
  const { getUnInscribedTransactionDetailByAddress, getTCTxByHash } = useBitcoin();

  const call = useCallback(
    async (params: ISwapERC20TokenParams): Promise<boolean> => {
      const { addresses, address, amount, amountOutMin } = params;
      if (account && provider) {
        const functionABI = getFunctionABI(
          UniswapV2RouterJson,
          'swapExactTokensForTokens',
        );

        const ContractInterface = new ethers.utils.Interface(functionABI.abi);

        const encodeAbi = ContractInterface.encodeFunctionData(
          'swapExactTokensForTokens',
          [
            Web3.utils.toWei(amount, 'ether'),
            Web3.utils.toWei(amountOutMin, 'ether'),
            addresses,
            address,
            MaxUint256,
          ],
        );

        let isPendingTx = false;

        const unInscribedTxIDs = await getUnInscribedTransactionDetailByAddress(
          account,
        );

        for await (const unInscribedTxID of unInscribedTxIDs) {
          const _getTxDetail = await getTCTxByHash(unInscribedTxID.Hash);
          const _inputStart = _getTxDetail.input.slice(0, 10);

          if (compareString(CONTRACT_METHOD_IDS.SWAP, _inputStart)) {
            isPendingTx = true;
          }
        }

        if (isPendingTx) {
          throw Error(ERROR_CODE.PENDING);
        }

        const gasLimit = 50000 + addresses.length * 100000;

        const transaction = await await connector.requestSign({
          target: '_blank',
          calldata: encodeAbi,
          to: UNIV2_ROUTER_ADDRESS,
          value: '',
          redirectURL: window.location.href,
          isInscribe: true,
          gasLimit,
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
          message: `gasLimit: '${gasLimit}'`,
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

export default useSwapERC20Token;
