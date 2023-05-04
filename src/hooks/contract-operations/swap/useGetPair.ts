import UniswapV2FactoryJson from '@/abis/UniswapV2Factory.json';
import {UNIV2_FACTORY_ADDRESS} from '@/configs';
import {NULL_ADDRESS} from '@/constants/url';
import {TransactionEventType} from '@/enums/transaction';
import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {IToken} from '@/interfaces/token';
import {getContract, sortAddressPair} from '@/utils';
import {useWeb3React} from '@web3-react/core';
import {useCallback} from 'react';
import {ethers} from "ethers";

export interface IGetPairParams {
  tokenA: IToken;
  tokenB: IToken;
}

const useGetPair: ContractOperationHook<IGetPairParams, string> = () => {
  const { account, provider: defaultProvider } = useWeb3React();

  let provider = defaultProvider;
  if(!provider && window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
  }

  const call = useCallback(
    async (params: IGetPairParams): Promise<string> => {
      const { tokenA, tokenB } = params;
      if(provider) {
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

        console.log('useGetPair', transaction);

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
