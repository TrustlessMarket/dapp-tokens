import UniswapV2PairJson from '@/abis/UniswapV2Pair.json';
import {TransactionEventType} from '@/enums/transaction';
import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {getContract} from '@/utils';
import {useWeb3React} from '@web3-react/core';
import {useCallback} from 'react';
import {ethers} from "ethers";

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
  const { account, provider: defaultProvider } = useWeb3React();

  let provider = defaultProvider;
  if(!provider) {
    provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
  }

  const call = useCallback(
    async (
      params: IGetReservesParams,
    ): Promise<{
      _reserve0: string;
      _reserve1: string;
    }> => {
      const { address } = params;
      if (provider && address) {
        const contract = getContract(address, UniswapV2PairJson, provider, account);

        const transaction = await contract
          .connect(provider.getSigner())
          .getReserves();

        console.log('useGetReserves', transaction);

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
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useGetReserves;
