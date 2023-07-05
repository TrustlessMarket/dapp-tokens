/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadFactoryJson from '@/abis/LaunchpadFactory.json';
// import LaunchpadFactoryL2Json from '@/abis/lau';
import { TransactionEventType } from '@/enums/transaction';
import { IResourceChain } from '@/interfaces/chain';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { getContract, getDefaultProvider, getLaunchPadAddress } from '@/utils';
import { useCallback } from 'react';

export interface ConfigLaunchpadResponse {
  protocolRatio: string;
  rewardVoteRatio: string;
  lpTokenReleaseDuration: string;
}

const useGetConfigLaunchpad: ContractOperationHook<
  any,
  ConfigLaunchpadResponse
> = () => {
  const provider = getDefaultProvider();

  const currentChain: IResourceChain =
    useAppSelector(selectPnftExchange).currentChain;

  const call = useCallback(async (): Promise<ConfigLaunchpadResponse> => {
    if (provider) {
      const contract = getContract(
        getLaunchPadAddress(),
        LaunchpadFactoryJson,
        provider,
      );

      const transaction = await contract.connect(provider).getLaunchpadConfigs();

      return {
        protocolRatio: transaction['protocolRatio'].toString(),
        rewardVoteRatio: transaction['rewardVoteRatio'].toString(),
        lpTokenReleaseDuration: transaction['lpTokenReleaseDuration'].toString(),
      };
    }
    return {
      protocolRatio: '0',
      rewardVoteRatio: '0',
      lpTokenReleaseDuration: '0',
    };
  }, [provider]);

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.NONE,
  };
};

export default useGetConfigLaunchpad;
