import ERC20ABIJson from '@/abis/erc20.json';
import { ERROR_CODE } from '@/constants/error';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import {
  ContractOperationHook,
  DAppType,
  DeployContractResponse,
} from '@/interfaces/contract-operation';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { ContractFactory } from 'ethers';
import { useCallback, useContext } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';

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
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: ICreateTokenParams): Promise<DeployContractResponse | null> => {
      if (account && provider) {
        const { name, symbol, maxSupply, selectFee } = params;

        const byteCode = ERC20ABIJson.bytecode;

        console.log({
          tcTxSizeByte: Buffer.byteLength(byteCode),
          feeRatePerByte: selectFee,
        });
        // TC_SDK.signTransaction({

        // });
        const estimatedFee = TC_SDK.estimateInscribeFee({
          tcTxSizeByte: Buffer.byteLength(byteCode),
          feeRatePerByte: selectFee,
        });

        const balanceInBN = new BigNumber(btcBalance);

        console.log('estimatedFee', estimatedFee.totalFee.toString());
        console.log('balanceInBN', balanceInBN.toString());

        if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
          throw Error(ERROR_CODE.INSUFFICIENT_BALANCE);
        }

        const factory = new ContractFactory(
          ERC20ABIJson.abi,
          ERC20ABIJson.bytecode,
          provider.getSigner(),
        );
        const contract = await factory.deploy(name, symbol, maxSupply);

        return {
          hash: contract.deployTransaction.hash,
          contractAddress: contract.address,
          deployTransaction: contract.deployTransaction,
        };
      }

      return null;
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useCreateToken;
