import UniswapV2FactoryJson from '@/abis/UniswapV2Factory.json';
import { UNIV2_FACTORY_ADDRESS } from '@/configs';
import { NULL_ADDRESS } from '@/constants/url';
import { TransactionEventType } from '@/enums/transaction';
import useTCWallet from '@/hooks/useTCWallet';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { IToken } from '@/interfaces/token';
import { getContract, getDefaultProvider, sortAddressPair } from '@/utils';
import { useCallback } from 'react';

export interface IGetPairParams {
  tokenA: IToken;
  tokenB: IToken;
}

const useGetPair: ContractOperationHook<IGetPairParams, string> = () => {
  const { tcWalletAddress: account } = useTCWallet();

  const provider = getDefaultProvider();

  const call = useCallback(
    async (params: IGetPairParams): Promise<string> => {
      const { tokenA, tokenB } = params;
      if (provider) {
        const contract = getContract(
          UNIV2_FACTORY_ADDRESS,
          UniswapV2FactoryJson,
          provider,
          account,
        );
        const [token0, token1] = sortAddressPair(tokenA, tokenB);

        const transaction = await contract
          .connect(provider)
          .getPair(token0.address, token1.address);

        return transaction;
      }

      return NULL_ADDRESS;
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useGetPair;
