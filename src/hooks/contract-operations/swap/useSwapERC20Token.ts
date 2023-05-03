import UniswapV2RouterJson from '@/abis/UniswapV2Router.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { APP_ENV, TRANSFER_TX_SIZE, UNIV2_ROUTER_ADDRESS } from '@/configs';
import { MaxUint256 } from '@/constants/url';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { scanTrx } from '@/services/token-explorer';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { compareString, getContract } from '@/utils';
import { formatBTCPrice } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useCallback, useContext } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';
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
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: ISwapERC20TokenParams): Promise<boolean> => {
      const { addresses, address, amount, amountOutMin } = params;
      if (account && provider) {
        const contract = getContract(
          UNIV2_ROUTER_ADDRESS,
          UniswapV2RouterJson,
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
          console.log('estimatedFee', estimatedFee);

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
          .swapExactTokensForTokens(
            Web3.utils.toWei(amount, 'ether'),
            Web3.utils.toWei(amountOutMin, 'ether'),
            addresses,
            address,
            MaxUint256,
            {
              gasLimit: '500000',
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

        store.dispatch(
          updateCurrentTransaction({
            status: TransactionStatus.pending,
            id: transactionType.swapToken,
            hash: transaction.hash,
            infoTexts: {
              pending: `Transaction confirmed. Please wait for it to be processed on the Bitcoin. Note that it may take up to 10 minutes for a block confirmation on the Bitcoin blockchain.`,
            },
          }),
        );

        // await transaction.wait();

        await scanTrx({
          tx_hash: transaction.hash,
        });

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

export default useSwapERC20Token;
