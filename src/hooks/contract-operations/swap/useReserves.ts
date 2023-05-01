import UniswapV2PairJson from '@/abis/UniswapV2Pair.json';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';

export interface IGetReservesParams {
  address: string;
}

const useGetReserves: ContractOperationHook<
  IGetReservesParams,
  {
    _reserve0: string;
    _reserve1: string;
  }
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (
      params: IGetReservesParams,
    ): Promise<{
      _reserve0: string;
      _reserve1: string;
    }> => {
      const { address } = params;
      if (account && provider && address) {
        const contract = getContract(address, UniswapV2PairJson, provider, account);
        // console.log({
        //   tcTxSizeByte: TRANSFER_TX_SIZE,
        //   feeRatePerByte: feeRate.fastestFee,
        //   erc20TokenAddress,
        // });
        // const estimatedFee = TC_SDK.estimateInscribeFee({
        //   tcTxSizeByte: TRANSFER_TX_SIZE,
        //   feeRatePerByte: feeRate.fastestFee,
        // });
        // const balanceInBN = new BigNumber(btcBalance);
        // if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
        //   throw Error(
        //     `Your balance is insufficient. Please top up at least ${formatBTCPrice(
        //       estimatedFee.totalFee.toString(),
        //     )} BTC to pay network fee.`,
        //   );
        // }

        const transaction = await contract
          .connect(provider.getSigner())
          .getReserves();

        console.log('transaction', transaction);

        return {
          _reserve0: transaction[0].toString(),
          _reserve1: transaction[1].toString(),
        };
      }

      return {
        _reserve0: '0',
        _reserve1: '0',
      };
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useGetReserves;
