/* eslint-disable @typescript-eslint/no-explicit-any */
import ERC20ABIJson from '@/abis/erc20.json';
import { CONTRACT_METHOD_IDS } from '@/constants/methodId';
import { TransactionEventType } from '@/enums/transaction';
import useBitcoin from '@/hooks/useBitcoin';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { compareString, getContract, isSupportedChain } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import web3 from 'web3';
import web3Eth from 'web3-eth-abi';

export interface IBalanceERC20TokenParams {
  erc20TokenAddress: string;
}

const useBalanceERC20Token: ContractOperationHook<
  IBalanceERC20TokenParams,
  string
> = () => {
  const { account, chainId, provider } = useWeb3React();
  const isConnected = isSupportedChain(chainId);
  const {
    getPendingInscribeTxsDetail,
    getUnInscribedTransactionDetailByAddress,
    getTCTxByHash,
  } = useBitcoin();

  const call = useCallback(
    async (params: IBalanceERC20TokenParams): Promise<string> => {
      const { erc20TokenAddress } = params;
      if (account && provider && erc20TokenAddress && isConnected) {
        const contract = getContract(erc20TokenAddress, ERC20ABIJson.abi, provider);

        const [transaction, pendingTXDs, unInscribedTxIDs] = await Promise.all([
          contract.connect(provider.getSigner()).balanceOf(account),
          getPendingInscribeTxsDetail(account),
          getUnInscribedTransactionDetailByAddress(account),
        ]);

        let balance = transaction.toString();

        const txs = unInscribedTxIDs
          .map((v) => v.Hash)
          .concat(pendingTXDs.map((v) => v.TCHash));

        for await (const pendingTXD of txs) {
          const tCTxByHash = await getTCTxByHash(pendingTXD);
          const startHex = tCTxByHash.input.slice(0, 10);
          if (
            [CONTRACT_METHOD_IDS.ADD_LIQUID, CONTRACT_METHOD_IDS.SWAP].includes(
              startHex.toLowerCase(),
            )
          ) {
            const _input = tCTxByHash.input.slice(10);
            if (
              compareString(CONTRACT_METHOD_IDS.ADD_LIQUID, startHex.toLowerCase())
            ) {
              const value: any = web3Eth.decodeParameters(
                [
                  'address',
                  'address',
                  'uint256',
                  'uint256',
                  'uint256',
                  'uint256',
                  'address',
                  'uint256',
                ],
                _input,
              );

              for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                  const element = value[key];
                  if (compareString(element, erc20TokenAddress)) {
                    balance = new BigNumber(balance)
                      .minus(value[`${Number(key) + 2}`])
                      .toFixed();
                  }
                }
              }
            } else {
              const value = web3Eth.decodeParameters(
                ['uint256', 'uint256', 'address[]', 'address', 'uint256'],
                _input,
              );
              const to_token = value['2'] as string[];

              if (compareString(to_token[0], erc20TokenAddress.toString())) {
                balance = new BigNumber(balance).minus(value['0']).toFixed();
              }
            }
          }
        }

        return web3.utils.fromWei(balance);
      }
      return '0';
    },
    [account, provider, isConnected],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useBalanceERC20Token;
