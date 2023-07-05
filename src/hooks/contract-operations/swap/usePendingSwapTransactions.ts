/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import {TransactionEventType} from '@/enums/transaction';
import useBitcoin from '@/hooks/useBitcoin';
import {ContractOperationHook, DAppType} from '@/interfaces/contract-operation';
import {IToken} from '@/interfaces/token';
import {getTokenDetail} from '@/services/token-explorer';
import {compareString, sortAddressPair} from '@/utils';
import {useWeb3React} from '@web3-react/core';
import {useCallback} from 'react';
import Web3 from 'web3';
import web3Eth from 'web3-eth-abi';
import {getTCTxDetailByHash} from "@/services/swap";
import {CONTRACT_METHOD_IDS} from "@/constants/methodId";
import {IResourceChain} from "@/interfaces/chain";
import {useSelector} from "react-redux";
import {selectPnftExchange} from "@/state/pnftExchange";

export interface IPendingSwapTransactionsParams {}

const usePendingSwapTransactions: ContractOperationHook<
  IPendingSwapTransactionsParams,
  string
> = () => {
  const { account, provider } = useWeb3React();
  const {
    getUnInscribedTransactionDetailByAddress,
    getTCTxByHash,
    getPendingInscribeTxsDetail,
  } = useBitcoin();
  const currentChain: IResourceChain = useSelector(selectPnftExchange).currentChain;

  const call = useCallback(
    async ({}): Promise<any> => {
      if (account && provider) {
        const [unInscribedTxIDs, pendingTxIds] = await Promise.all([
          getUnInscribedTransactionDetailByAddress(account),
          getPendingInscribeTxsDetail(account),
        ]);

        const response = [];

        for await (const unInscribedTxID of unInscribedTxIDs) {
          const [_getTxDetail, _getTxDetail2] = await Promise.all([
            getTCTxByHash(unInscribedTxID.Hash),
            getTCTxDetailByHash({tx_hash: unInscribedTxID.Hash})
          ]);

          const _inputStart = _getTxDetail.input.slice(0, 10);

          if (compareString(CONTRACT_METHOD_IDS.SWAP, _inputStart)) {
            const _input = _getTxDetail.input.slice(10);
            const value = web3Eth.decodeParameters(
              ['uint256', 'uint256', 'address[]', 'address', 'uint256'],
              _input,
            );

            const amountIn = Web3.utils.fromWei(value['0'], 'ether');
            const path = value['2'];

            const [token0, token1] = sortAddressPair(
              { address: path[0] } as IToken,
              { address: path[path.length - 1] } as IToken,
            );

            let amount0_in = '0';
            let amount1_in = '0';
            const amount0_out = '0';
            const amount1_out = '0';

            if (compareString(path[0], token0.address)) {
              amount0_in = amountIn;
            } else {
              amount1_in = amountIn;
            }

            const params = {network: currentChain?.chain?.toLowerCase()};
            const [token0_obj, token1_obj] = await Promise.all([
              getTokenDetail(token0.address, params),
              getTokenDetail(token1.address, params),
            ]);

            response.push({
              // amountIn: value['0'],
              // amountOutMin: value['1'],
              path: value['2'],
              to: value['3'],
              // deadline: value['4'],
              created_at: _getTxDetail2?.length > 0 ? _getTxDetail2[0].createdAt : null,
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
              price: '0',
              tx_hash: unInscribedTxID.Hash,
              status: 'pending',
            });
          }
        }

        for await (const pendingTxID of pendingTxIds) {
          const [_getTxDetail, _getTxDetail2] = await Promise.all([
            getTCTxByHash(pendingTxID.TCHash),
            getTCTxDetailByHash({tx_hash: pendingTxID.TCHash})
          ]);

          const _inputStart = _getTxDetail.input.slice(0, 10);

          if (compareString(CONTRACT_METHOD_IDS.SWAP, _inputStart)) {
            const _input = _getTxDetail.input.slice(10);
            const value = web3Eth.decodeParameters(
              ['uint256', 'uint256', 'address[]', 'address', 'uint256'],
              _input,
            );

            const amountIn = Web3.utils.fromWei(value['0'], 'ether');
            const path = value['2'];

            const [token0, token1] = sortAddressPair(
              {
                address: path[0],
                id: '',
                symbol: '',
                name: '',
              },
              {
                address: path[path.length - 1],
                id: '',
                symbol: '',
                name: '',
              },
            );

            let amount0_in = '0';
            let amount1_in = '0';
            const amount0_out = '0';
            const amount1_out = '0';

            if (compareString(path[0], token0.address)) {
              amount0_in = amountIn;
            } else {
              amount1_in = amountIn;
            }

            const params = {network: currentChain?.chain?.toLowerCase()};
            const [token0_obj, token1_obj] = await Promise.all([
              getTokenDetail(token0.address, params),
              getTokenDetail(token1.address, params),
            ]);

            // console.log('token0_obj, token1_obj', token0_obj, token1_obj);

            response.push({
              btc_hash: pendingTxID.Reveal.BTCHash,
              // amountIn: value['0'],
              // amountOutMin: value['1'],
              path: value['2'],
              to: value['3'],
              // deadline: value['4'],
              created_at: _getTxDetail2?.length > 0 ? _getTxDetail2[0].createdAt : null,
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
              price: '0',
              tx_hash: pendingTxID.TCHash,
              status: 'pending',
            });
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
