/* eslint-disable @typescript-eslint/no-explicit-any */
import NonfungiblePositionManagerJson from '@/abis/NonfungiblePositionManager.json';
import { UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS } from '@/configs';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract, getDefaultProvider } from '@/utils';
import { useCallback } from 'react';

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
        const contract = getContract(
          UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS,
          NonfungiblePositionManagerJson,
          provider,
        );

        let transaction = await contract.connect(provider).tokenURI(tokenId);

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
