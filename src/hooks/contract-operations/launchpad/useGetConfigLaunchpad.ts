/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadFactoryJson from '@/abis/LaunchpadFactory.json';
// import LaunchpadFactoryL2Json from '@/abis/lau';
import { L2_LAUNCHPAD_FACTORY_ADDRESS, LAUNCHPAD_FACTORY_ADDRESS } from '@/configs';
import { SupportedChainId } from '@/constants/chains';
import { TransactionEventType } from '@/enums/transaction';
import { IResourceChain } from '@/interfaces/chain';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { compareString, getContract, getDefaultProvider } from '@/utils';
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
      let contract = getContract(
        LAUNCHPAD_FACTORY_ADDRESS,
        LaunchpadFactoryJson,
        provider,
      );

      if (compareString(currentChain.chainId, SupportedChainId.L2)) {
        contract = getContract(
          L2_LAUNCHPAD_FACTORY_ADDRESS,
          LaunchpadFactoryJson,
          provider,
        );
      }

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
