import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import UniswapV2RouterJson from '@/abis/UniswapV2Router.json';
import {useWeb3React} from '@web3-react/core';
import {useCallback, useContext} from 'react';
import {AssetsContext} from '@/contexts/assets-context';
import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';
import {formatBTCPrice} from '@/utils/format';
import {getContract} from '@/utils';
import {TRANSFER_TX_SIZE} from '@/configs';
import Web3 from 'web3';
import {TransactionEventType} from '@/enums/transaction';

export interface ISwapERC20TokenParams {
  addresses: string[];
  amount: string;
  erc20TokenAddress: string;
}

const useEstimateSwapERC20Token: ContractOperationHook<ISwapERC20TokenParams, boolean> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: ISwapERC20TokenParams): Promise<boolean> => {
      const { addresses, amount, erc20TokenAddress } = params;
      if (account && provider && erc20TokenAddress) {
        const contract = getContract(erc20TokenAddress, UniswapV2RouterJson.abi, provider, account);
        console.log({
          tcTxSizeByte: TRANSFER_TX_SIZE,
          feeRatePerByte: feeRate.fastestFee,
          erc20TokenAddress,
        });
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

        const transaction = await contract
          .connect(provider.getSigner())
          .getAmountsOut(Web3.utils.toWei(amount, 'ether'), addresses);

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

export default useEstimateSwapERC20Token;
