/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadFactoryJson from '@/abis/LaunchpadFactory.json';
import { SupportedChainId } from '@/constants/chains';
import { TransactionEventType } from '@/enums/transaction';
import { IResourceChain } from '@/interfaces/chain';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { logErrorToServer } from '@/services/swap';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import {
  compareString,
  getContract,
  getDefaultGasPrice,
  getGasFee,
  getLaunchPadAddress,
} from '@/utils';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import web3 from 'web3';

export interface ICreateLaunchpadParams {
  launchpadTokenArg: string;
  liquidityTokenArg: string;
  liquidityRatioArg: string; // 100% = 1000000
  durationArg: string;
  launchpadBalance: string;
  goalBalance: string;
  thresholdBalance: string;
  liquidityBalance: string;
}

const useCreateLaunchpad: ContractOperationHook<
  ICreateLaunchpadParams,
  boolean
> = () => {
  const { account, provider } = useWeb3React();
  const currentChain: IResourceChain =
    useAppSelector(selectPnftExchange).currentChain;

  const call = useCallback(
    async (params: ICreateLaunchpadParams): Promise<boolean> => {
      const {
        launchpadTokenArg,
        liquidityTokenArg,
        liquidityRatioArg,
        durationArg,
        launchpadBalance,
        goalBalance,
        thresholdBalance,
        liquidityBalance,
      } = params;

      if (account && provider) {
        const contract = getContract(
          getLaunchPadAddress(),
          LaunchpadFactoryJson,
          provider,
          account,
        );

        const ratio = new BigNumber(Number(liquidityRatioArg))
          .multipliedBy(10000)
          .toString();

        const transaction = await contract
          .connect(provider.getSigner())
          .createLaunchpadPool(
            launchpadTokenArg,
            liquidityTokenArg,
            ratio,
            durationArg,
            web3.utils.toWei(launchpadBalance),
            web3.utils.toWei(liquidityBalance),
            web3.utils.toWei(goalBalance),
            web3.utils.toWei(thresholdBalance),
            compareString(currentChain.chainId, SupportedChainId.TRUSTLESS_COMPUTER)
              ? {
                  gasLimit: '1100000',
                  gasPrice: getDefaultGasPrice(),
                }
              : {
                  gasPrice: getGasFee(),
                },
          );

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '150000'",
        });

        return transaction;
      }

      return false;
    },
    [account, provider, currentChain],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE_LAUNCHPAD,
  };
};

export default useCreateLaunchpad;
