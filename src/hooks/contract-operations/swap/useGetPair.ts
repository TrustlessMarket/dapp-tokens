import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import UniswapV2FactoryJson from '@/abis/UniswapV2Factory.json';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';
import { AssetsContext } from '@/contexts/assets-context';
import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';
import { formatBTCPrice } from '@/utils/format';
import { getContract } from '@/utils';
import { TRANSFER_TX_SIZE } from '@/configs';
import { TransactionEventType } from '@/enums/transaction';

export interface IGetPairParams {
  address0: string;
  address1: string;
  erc20TokenAddress: string;
}

const useGetPair: ContractOperationHook<IGetPairParams, boolean> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IGetPairParams): Promise<boolean> => {
      const { address0, address1, erc20TokenAddress } = params;
      if (account && provider && erc20TokenAddress) {
        const contract = getContract(
          erc20TokenAddress,
          UniswapV2FactoryJson,
          provider,
          account,
        );
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
          .getPair(address0, address1);

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

export default useGetPair;
