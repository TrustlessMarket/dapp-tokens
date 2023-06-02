/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadFactoryJson from '@/abis/LaunchpadFactory.json';
import { LAUNCHPAD_FACTORY_ADDRESS } from '@/configs';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { logErrorToServer } from '@/services/swap';
import { getContract, getDefaultGasPrice } from '@/utils';
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

      console.log('params', params);

      if (account && provider) {
        const contract = getContract(
          LAUNCHPAD_FACTORY_ADDRESS,
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
            {
              gasLimit: '1100000',
              gasPrice: getDefaultGasPrice(),
            },
          );

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '150000'",
        });

        // store.dispatch(
        //   updateCurrentTransaction({
        //     id: transactionType.createLaunchpad,
        //     status: TransactionStatus.pending,
        //     hash: transaction.hash,
        //     infoTexts: {
        //       pending: `Transaction confirmed. Please wait for it to be processed on the Bitcoin. Note that it may take up to 10 minutes for a block confirmation on the Bitcoin blockchain.`,
        //     },
        //   }),
        // );

        return transaction;
      }

      return false;
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE_LAUNCHPAD,
  };
};

export default useCreateLaunchpad;
