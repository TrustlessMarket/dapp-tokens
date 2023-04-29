import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import UniswapV2FactoryJson from '@/abis/UniswapV2Factory.json';
import {useWeb3React} from '@web3-react/core';
import {useCallback, useContext} from 'react';
import {AssetsContext} from '@/contexts/assets-context';
import {getContract} from '@/utils';
import {UNIV2_FACTORY_ADDRESS} from '@/configs';
import {TransactionEventType} from '@/enums/transaction';

export interface IGetPairParams {
  address0: string;
  address1: string;
}

const useGetPair: ContractOperationHook<IGetPairParams, boolean> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IGetPairParams): Promise<boolean> => {
      const { address0, address1 } = params;
      if (account && provider) {
        const contract = getContract(
          UNIV2_FACTORY_ADDRESS,
          UniswapV2FactoryJson,
          provider,
          account,
        );
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
