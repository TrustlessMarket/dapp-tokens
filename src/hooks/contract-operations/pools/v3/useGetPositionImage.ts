/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import {  getDefaultProvider } from '@/utils';
import { useCallback } from 'react';
import {getPositionImage} from "trustless-swap-sdk";

export interface IGetPositionImageParams {
  tokenId?: number;
}

const useGetPositionImage: ContractOperationHook<
  IGetPositionImageParams,
  any
> = () => {
  const provider = getDefaultProvider();

  const call = useCallback(
    async (params: IGetPositionImageParams): Promise<any> => {
      const { tokenId } = params;
      if (provider && tokenId) {
        let transaction = await getPositionImage(tokenId);

        transaction = transaction.replace('data:application/json;base64,', '');
        const decodedString = Buffer.from(transaction, 'base64').toString('utf-8');

        return JSON.parse(decodedString).image;
      }

      return null;
    },
    [provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useGetPositionImage;
