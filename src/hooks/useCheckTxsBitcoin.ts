/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import useBitcoin from './useBitcoin';
import { compareString } from '@/utils';

interface ICheckTxsBitcoin {
  txHash: string;
  fnAction: () => any;
}

const useCheckTxsBitcoin: ContractOperationHook<ICheckTxsBitcoin, boolean> = () => {
  const { account, isActive, provider } = useWeb3React();

  const { getPendingInscribeTxsDetail } = useBitcoin();

  const call = useCallback(
    async (params: ICheckTxsBitcoin): Promise<boolean> => {
      const { txHash, fnAction } = params;
      if (account && fnAction && typeof fnAction === 'function') {
        const myInterval = setInterval(async () => {
          const [pendingTXDs] = await Promise.all([
            getPendingInscribeTxsDetail(account),
          ]);
          const tx = pendingTXDs.find((v) => compareString(v.TCHash, txHash));

          if (tx) {
            fnAction();
            clearInterval(myInterval);
          }
        }, 1000);

        return true;
      }
      return false;
    },
    [account, isActive, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.NONE,
  };
};

export default useCheckTxsBitcoin;
