import ERC20ABIJson from '@/abis/erc20.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { APP_ENV, TRANSFER_TX_SIZE } from '@/configs';
import { MaxUint256 } from '@/constants/url';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { compareString, getContract } from '@/utils';
import { isProduction } from '@/utils/commons';
import { formatBTCPrice } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useCallback, useContext } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';

export interface IApproveERC20TokenParams {
  address: string;
  erc20TokenAddress: string;
}

const useApproveERC20Token: ContractOperationHook<
  IApproveERC20TokenParams,
  boolean
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IApproveERC20TokenParams): Promise<boolean> => {
      const { address, erc20TokenAddress } = params;
      if (account && provider && erc20TokenAddress) {
        const contract = getContract(
          erc20TokenAddress,
          ERC20ABIJson.abi,
          provider,
          account,
        );
        console.log({
          tcTxSizeByte: TRANSFER_TX_SIZE,
          feeRatePerByte: feeRate.fastestFee,
          erc20TokenAddress,
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
          .approve(address, MaxUint256);

        TC_SDK.signTransaction({
          method: `${DAppType.ERC20} - ${TransactionEventType.CREATE}`,
          hash: transaction.hash,
          dappURL: window.location.origin,
          isRedirect: true,
          target: '_blank',
          isMainnet: isProduction(),
        });

        store.dispatch(
          updateCurrentTransaction({
            id: transactionType.createPoolApprove,
            status: TransactionStatus.pending,
            infoTexts: {
              pending: `Approving for ${address}`,
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

export default useApproveERC20Token;
