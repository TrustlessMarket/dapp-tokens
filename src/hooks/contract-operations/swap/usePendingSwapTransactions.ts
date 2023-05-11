/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import {TransactionEventType} from '@/enums/transaction';
import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {compareString, sortAddressPair} from '@/utils';
import {useWeb3React} from '@web3-react/core';
import {useCallback} from 'react';
import Web3 from 'web3';
import useBitcoin from "@/hooks/useBitcoin";
import web3Eth from "web3-eth-abi";
import {getTokenDetail} from "@/services/token-explorer";

export interface IPendingSwapTransactionsParams {

}

const usePendingSwapTransactions: ContractOperationHook<
  IPendingSwapTransactionsParams,
  string
> = () => {
  const { account, provider } = useWeb3React();
  const { getUnInscribedTransactionDetailByAddress, getTCTxByHash } = useBitcoin();

  const funcSwapHash = '0x38ed1739';

  const call = useCallback(
    async ({}): Promise<any> => {
      if (account && provider) {

        const unInscribedTxIDs = await getUnInscribedTransactionDetailByAddress(
          account,
        );

        const response = [];

        for await (const unInscribedTxID of unInscribedTxIDs) {
          const _getTxDetail = await getTCTxByHash(unInscribedTxID.Hash);
          const _inputStart = _getTxDetail.input.slice(0, 10);

          if (compareString(funcSwapHash, _inputStart)) {
            const _input = _getTxDetail.input.slice(10);
            const value = web3Eth.decodeParameters(['uint256', 'uint256', 'address[]', 'address', 'uint256'], _input);

            const amountIn = Web3.utils.fromWei(value['0'], 'ether');
            const path = value['2'];

            const [token0, token1] = sortAddressPair({address: path[0]}, {address: path[path.length - 1]});

            let amount0_in = '0';
            let amount1_in = '0';
            const amount0_out = '0';
            const amount1_out = '0';

            if(compareString(path[0], token0.address)) {
              amount0_in = amountIn;
            } else {
              amount1_in = amountIn;
            }

            console.log('token0', token0);
            console.log('token1', token1);

            const [token0_obj, token1_obj] = await Promise.all([
              getTokenDetail(token0.address),
              getTokenDetail(token1.address)
            ]);

            // console.log('token0_obj, token1_obj', token0_obj, token1_obj);

            response.push({
              // amountIn: value['0'],
              // amountOutMin: value['1'],
              path: value['2'],
              to: value['3'],
              // deadline: value['4'],
              created_at: null,
              amount0_in,
              amount1_in,
              amount0_out,
              amount1_out,
              pair: {
                token0_obj,
                token1_obj,
                token0: token0_obj.address,
                token1: token1_obj.address,
              },
              price: "0",
              tx_hash: null,
              status: 'pending'
            })
          }
        }

        return response;
      }
      return [];
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default usePendingSwapTransactions;
