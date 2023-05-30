/* eslint-disable @typescript-eslint/no-explicit-any */
import ERC20ABIJson from '@/abis/erc20.json';
import { getConnector } from '@/connection';
import { TransactionEventType } from '@/enums/transaction';
import useTCWallet from '@/hooks/useTCWallet';
import {
  ContractOperationHook,
  DAppType,
  DeployContractResponse,
} from '@/interfaces/contract-operation';
import { getDefaultProvider } from '@/utils';
import { useCallback } from 'react';
import Web3 from 'web3';

export interface ICreateTokenParams {
  name: string;
  symbol: string;
  maxSupply: number;
  selectFee: number;
}

const useCreateToken: ContractOperationHook<
  ICreateTokenParams,
  DeployContractResponse | null
> = () => {
  const { tcWalletAddress: account } = useTCWallet();
  const provider = getDefaultProvider();
  const connector = getConnector();

  const call = useCallback(
    async (params: ICreateTokenParams): Promise<DeployContractResponse | null> => {
      if (account && provider) {
        const { name, symbol, maxSupply } = params;

        const web3 = new Web3();
        const ContractInterface = new web3.eth.Contract(ERC20ABIJson.abi as any);
        const encodeABI = ContractInterface.deploy({
          data: ERC20ABIJson.bytecode,
          arguments: [name, symbol, maxSupply],
        }).encodeABI();

        const factory = await connector.requestSign({
          target: '_blank',
          calldata: encodeABI,
          to: '',
          value: '',
          isInscribe: true,
          functionType: 'Contract Deployment',
          functionName: 'constructor(bytes32[])',
          from: account,
        });

        return {
          hash: factory.tcHash,
          contractAddress: '',
        };
      }

      return null;
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useCreateToken;
