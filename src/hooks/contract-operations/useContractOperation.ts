/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupportedChainId } from '@/constants/chains';
import { ROUTE_PATH } from '@/constants/route-path';
import { IResourceChain } from '@/interfaces/chain';
import { ContractOperationHook } from '@/interfaces/contract-operation';
import { logErrorToServer } from '@/services/swap';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { getIsAuthenticatedSelector, getUserSelector } from '@/state/user/selector';
import {
  capitalizeFirstLetter,
  compareString,
  isSupportedChain,
  switchChain,
} from '@/utils';
import { isProduction } from '@/utils/commons';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import * as TC_SDK from 'trustless-computer-sdk';

interface IParams<P, R> {
  operation: ContractOperationHook<P, R>;
  inscribeable?: boolean;
  chainId?: SupportedChainId;
}

interface IContractOperationReturn<P, R> {
  run: (p: P) => Promise<R>;
}

const useContractOperation = <P, R>(
  args: IParams<P, R>,
): IContractOperationReturn<P, R> => {
  const {
    operation,
    chainId = SupportedChainId.TRUSTLESS_COMPUTER,
    inscribeable = true,
  } = args;
  const { call, dAppType, transactionType } = operation();
  const { chainId: walletChainId } = useWeb3React();
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const user = useSelector(getUserSelector);
  const router = useRouter();
  const currentChain: IResourceChain =
    useAppSelector(selectPnftExchange).currentChain;

  const checkAndSwitchChainIfNecessary = async (): Promise<void> => {
    if (!isSupportedChain(walletChainId)) {
      await switchChain(chainId);
    }
  };

  const run = async (params: P): Promise<R> => {
    try {
      // This function does not handle error
      // It delegates error to caller

      if (!isAuthenticated || !user?.walletAddress) {
        router.push(
          `${ROUTE_PATH.CONNECT_WALLET}?next=${encodeURIComponent(
            window.location.href,
          )}`,
        );
        throw Error('Please connect wallet to continue.');
      }

      // Check & switch network if necessary
      await checkAndSwitchChainIfNecessary();

      if (!inscribeable) {
        // Make TC transaction
        console.time('____metamaskCreateTxTime');
        const tx: R = await call({
          ...params,
        });
        console.timeEnd('____metamaskCreateTxTime');

        console.log('tcTX', tx);
        return tx;
      }

      const tx: any = await call({
        ...params,
      });

      if (compareString(currentChain.chainId, SupportedChainId.TRUSTLESS_COMPUTER)) {
        TC_SDK.signTransaction({
          method: `${transactionType} ${dAppType}`,
          hash: Object(tx).hash,
          dappURL: window.location.origin + window.location.pathname,
          isRedirect: true,
          target: '_blank',
          isMainnet: isProduction(),
        });
      }

      if (tx?.deployTransaction?.wait) {
        await tx.deployTransaction.wait();
      }

      if (tx.wait) {
        await tx.wait();
      }

      logErrorToServer({
        type: 'logs',
        error: JSON.stringify(tx),
        address: user?.walletAddress,
      });

      return tx;
    } catch (err) {
      logErrorToServer({
        type: 'error',
        error: JSON.stringify(err),
        address: user?.walletAddress,
      });
      if (Object(err).reason) {
        throw Error(capitalizeFirstLetter(Object(err).reason));
      }

      throw err;
    }
  };

  return {
    run,
  };
};

export default useContractOperation;
