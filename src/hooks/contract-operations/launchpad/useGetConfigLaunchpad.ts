/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadFactoryJson from '@/abis/LaunchpadFactory.json';
import { LAUNCHPAD_FACTORY_ADDRESS } from '@/configs';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract, getDefaultProvider } from '@/utils';
import { useCallback } from 'react';

export interface ConfigLaunchpadResponse {
  protocolRatio: string;
  liquidityPriceMultiple: string;
  lpTokenReleaseDuration: string;
}

const useGetConfigLaunchpad: ContractOperationHook<
  any,
  ConfigLaunchpadResponse
> = () => {
  const provider = getDefaultProvider();
  const call = useCallback(async (): Promise<ConfigLaunchpadResponse> => {
    if (provider) {
      const contract = getContract(
        LAUNCHPAD_FACTORY_ADDRESS,
        LaunchpadFactoryJson,
        provider,
      );

      const transaction = await contract.connect(provider).getLaunchpadConfigs();

      return {
        protocolRatio: transaction[0].toString(),
        liquidityPriceMultiple: transaction[1].toString(),
        lpTokenReleaseDuration: transaction[2].toString(),
      };
    }
    return {
      protocolRatio: '0',
      liquidityPriceMultiple: '0',
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
