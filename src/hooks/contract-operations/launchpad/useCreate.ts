import { LAUNCHPAD_FACTORY_ADDRESS } from '@/configs';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import LaunchpadFactoryJson from '@/abis/LaunchpadFactory.json';
import { logErrorToServer } from '@/services/swap';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import moment from 'moment';
import web3 from 'web3';
import BigNumber from 'bignumber.js';

export interface ICreateLaunchpadParams {
  launchpadTokenArg: string;
  liquidityTokenArg: string;
  liquidityRatioArg: string; // 100% = 1000000
  startTimeArg: string;
  endTimeArg: string;
  launchpadBalance: string;
  goalBalance: string;
  faq: string;
  description: string;
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
        startTimeArg,
        endTimeArg,
        launchpadBalance,
        goalBalance,
      } = params;

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
            moment(startTimeArg).unix(),
            moment(endTimeArg).unix(),
            web3.utils.toWei(launchpadBalance),
            web3.utils.toWei(goalBalance),
            {
              gasLimit: '1500000',
              // gasPrice: getDefaultGasPrice(),
            },
          );

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '150000'",
        });

        store.dispatch(
          updateCurrentTransaction({
            id: transactionType.createLaunchpad,
            status: TransactionStatus.pending,
            hash: transaction.hash,
            infoTexts: {
              pending: `Transaction confirmed. Please wait for it to be processed on the Bitcoin. Note that it may take up to 10 minutes for a block confirmation on the Bitcoin blockchain.`,
            },
          }),
        );

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
