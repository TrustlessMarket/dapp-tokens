import UniswapV2FactoryJson from '@/abis/UniswapV2Factory.json';
import { UNIV2_FACTORY_ADDRESS } from '@/configs';
import { NULL_ADDRESS } from '@/constants/url';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { IToken } from '@/interfaces/token';
import { getContract, sortAddressPair } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';

export interface IGetPairParams {
  tokenA: IToken;
  tokenB: IToken;
}

const useGetPair: ContractOperationHook<IGetPairParams, string> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IGetPairParams): Promise<string> => {
      const { tokenA, tokenB } = params;
      if (account && provider) {
        const contract = getContract(
          UNIV2_FACTORY_ADDRESS,
          UniswapV2FactoryJson,
          provider,
          account,
        );
        const [token0, token1] = sortAddressPair(tokenA, tokenB);
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
          .getPair(token0.address, token1.address);

        return transaction;
      }

      return NULL_ADDRESS;
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
