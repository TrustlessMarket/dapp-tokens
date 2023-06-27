import SwapRouterJson from '@/abis/SwapRouter.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { UNIV3_ROUTER_ADDRESS } from '@/configs';
import { MaxUint256 } from '@/constants/url';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { logErrorToServer, scanTrx } from '@/services/swap';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { getContract } from '@/utils';
import { encodePath } from '@/utils/path';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import Web3 from 'web3';

export interface ISwapERC20TokenParams {
  addresses: string[];
  fees: number[];
  address?: string | undefined;
  amount: string;
  amountOutMin: string;
}

const useSwapERC20Token: ContractOperationHook<
  ISwapERC20TokenParams,
  boolean
> = () => {
  const { account, provider } = useWeb3React();

  const call = useCallback(
    async (params: ISwapERC20TokenParams): Promise<boolean> => {
      const { addresses, fees, address, amount, amountOutMin } = params;
      if (account && provider) {
        const contract = getContract(
          UNIV3_ROUTER_ADDRESS,
          SwapRouterJson,
          provider,
          account,
        );

        // let isPendingTx = false;
        //
        // const unInscribedTxIDs = await getUnInscribedTransactionDetailByAddress(
        //   account,
        // );
        //
        // for await (const unInscribedTxID of unInscribedTxIDs) {
        //   const _getTxDetail = await getTCTxByHash(unInscribedTxID.Hash);
        //   const _inputStart = _getTxDetail.input.slice(0, 10);
        //
        //   if (compareString(CONTRACT_METHOD_IDS.SWAP, _inputStart)) {
        //     isPendingTx = true;
        //   }
        // }
        //
        // if (isPendingTx) {
        //   throw Error(ERROR_CODE.PENDING);
        // }

        // const gasLimit = 50000 + addresses.length * 100000;
        const data = {
          path: encodePath(addresses, fees),
          recipient: address,
          deadline: MaxUint256,
          amountIn: Web3.utils.toWei(amount, 'ether'),
          amountOutMinimum: Web3.utils.toWei(amountOutMin, 'ether'),
        };

        const transaction = await contract
          .connect(provider.getSigner())
          .exactInput(data, {
            // gasLimit,
            gasPrice: await provider.getGasPrice(),
          });

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          // message: `gasLimit: '${gasLimit}'`,
        });

        store.dispatch(
          updateCurrentTransaction({
            status: TransactionStatus.pending,
            id: transactionType.createPoolApprove,
            hash: transaction.hash,
            infoTexts: {
              pending: `Transaction confirmed. Please wait for it to be processed.`,
            },
          }),
        );

        // checkTxsBitcoin({
        //   txHash: transaction.hash,
        //   fnAction: () =>
        //     store.dispatch(
        //       updateCurrentTransaction({
        //         id: transactionType.createPoolApprove,
        //         status: TransactionStatus.pending,
        //         hash: transaction.hash,
        //         infoTexts: {
        //           pending: `Transaction confirmed. Please wait for it to be processed on the Bitcoin. Note that it may take up to 10 minutes for a block confirmation on the Bitcoin blockchain.`,
        //         },
        //       }),
        //     ),
        // });

        await scanTrx({
          tx_hash: transaction.hash,
        });

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
