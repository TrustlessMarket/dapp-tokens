/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadFactoryJson from '@/abis/LaunchpadFactory.json';
import { LAUNCHPAD_FACTORY_ADDRESS } from '@/configs';
import { getConnector } from '@/connection';
import { TransactionEventType } from '@/enums/transaction';
import useTCWallet from '@/hooks/useTCWallet';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { logErrorToServer } from '@/services/swap';
import { getDefaultGasPrice, getDefaultProvider, getFunctionABI } from '@/utils';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import web3 from 'web3';

export interface ICreateLaunchpadParams {
  launchpadTokenArg: string;
  liquidityTokenArg: string;
  liquidityRatioArg: string; // 100% = 1000000
  durationArg: string;
  launchpadBalance: string;
  goalBalance: string;
}

const useCreateLaunchpad: ContractOperationHook<
  ICreateLaunchpadParams,
  boolean
> = () => {
  const provider = getDefaultProvider();
  const connector = getConnector();
  const { tcWalletAddress: account } = useTCWallet();

  const call = useCallback(
    async (params: ICreateLaunchpadParams): Promise<boolean> => {
      const {
        launchpadTokenArg,
        liquidityTokenArg,
        liquidityRatioArg,
        durationArg,
        launchpadBalance,
        goalBalance,
      } = params;

      if (account && provider) {
        const functionABI = getFunctionABI(
          LaunchpadFactoryJson,
          'createLaunchpadPool',
        );

        const ContractInterface = new ethers.utils.Interface(functionABI.abi);

        const ratio = new BigNumber(Number(liquidityRatioArg))
          .multipliedBy(10000)
          .toString();

        const encodeAbi = ContractInterface.encodeFunctionData(
          'createLaunchpadPool',
          [
            launchpadTokenArg,
            liquidityTokenArg,
            ratio,
            durationArg,
            web3.utils.toWei(launchpadBalance),
            web3.utils.toWei(goalBalance),
          ],
        );

        const transaction = await connector.requestSign({
          target: '_blank',
          calldata: encodeAbi,
          to: LAUNCHPAD_FACTORY_ADDRESS,
          value: '',
          redirectURL: window.location.href,
          isInscribe: true,
          gasLimit: '1100000',
          gasPrice: getDefaultGasPrice(),
          functionType: functionABI.functionType,
          functionName: functionABI.functionName,
          isExecuteTransaction: false,
          from: account,
        });

        logErrorToServer({
          type: 'logs',
          address: account,
          error: JSON.stringify(transaction),
          message: "gasLimit: '1100000'",
        });

        return transaction;
      }

      return false;
    },
    [account],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE_LAUNCHPAD,
  };
};

export default useCreateLaunchpad;
