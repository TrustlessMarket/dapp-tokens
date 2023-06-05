/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import LaunchpadPoolJson from '@/abis/LaunchpadPool.json';
import { CONTRACT_METHOD_IDS } from '@/constants/methodId';
import { TransactionEventType } from '@/enums/transaction';
import useBitcoin from '@/hooks/useBitcoin';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { compareString, getContract, getDefaultProvider } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { maxBy } from 'lodash';
import { useCallback } from 'react';

export interface IIsAbleEndProps {
  launchpad_address?: string;
}

const useIsAbleEnd: ContractOperationHook<IIsAbleEndProps, boolean> = () => {
  const provider = getDefaultProvider();
  const { account } = useWeb3React();
  const { getUnInscribedTransactionDetailByAddress, getTCTxByHash } = useBitcoin();
  const call = useCallback(
    async (params: IIsAbleEndProps): Promise<boolean> => {
      const { launchpad_address } = params;
      if (provider && launchpad_address) {
        const contract = getContract(launchpad_address, LaunchpadPoolJson, provider);

        let transaction = await contract.connect(provider).isAbleEnd();

        if (!transaction && account) {
          const [unInscribedTxIDs] = await Promise.all([
            getUnInscribedTransactionDetailByAddress(account),
          ]);

          const txPendingForTokenAddress = unInscribedTxIDs.filter((v) =>
            compareString(v.To, launchpad_address),
          );
          const txDetail = maxBy(txPendingForTokenAddress, 'Nonce');
          if (txDetail) {
            const _txtDetail = await getTCTxByHash(txDetail.Hash);
            const _inputStart = _txtDetail.input.slice(0, 10);
            if (compareString(CONTRACT_METHOD_IDS.END_LAUNCHPAD, _inputStart)) {
              transaction = false;
            }
          }
        }

        return transaction;
      }
      return false;
    },
    [provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.NONE,
  };
};

export default useIsAbleEnd;
