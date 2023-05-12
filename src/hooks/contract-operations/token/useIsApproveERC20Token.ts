import ERC20ABIJson from '@/abis/erc20.json';
import { CONTRACT_METHOD_IDS } from '@/constants/methodId';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import useBitcoin from '@/hooks/useBitcoin';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { compareString, getContract } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { maxBy } from 'lodash';
import { useCallback, useContext } from 'react';
import web3Eth from 'web3-eth-abi';

export interface IIsApproveERC20TokenParams {
  erc20TokenAddress: string;
  address: string;
}

const useIsApproveERC20Token: ContractOperationHook<
  IIsApproveERC20TokenParams,
  string
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);
  const { getUnInscribedTransactionDetailByAddress, getTCTxByHash } = useBitcoin();

  const call = useCallback(
    async (params: IIsApproveERC20TokenParams): Promise<string> => {
      const { erc20TokenAddress, address } = params;
      if (account && provider && erc20TokenAddress) {
        const contract = getContract(erc20TokenAddress, ERC20ABIJson.abi, provider);

        const [unInscribedTxIDs, transaction] = await Promise.all([
          getUnInscribedTransactionDetailByAddress(account),
          contract.connect(provider.getSigner()).allowance(account, address),
        ]);

        const txPendingForTokenAddress = unInscribedTxIDs.filter((v) =>
          compareString(v.To, erc20TokenAddress),
        );

        let amountApprove = transaction.toString();

        const txDetail = maxBy(txPendingForTokenAddress, 'Nonce');

        if (txDetail) {
          const _txtDetail = await getTCTxByHash(txDetail.Hash);
          const _inputStart = _txtDetail.input.slice(0, 10);
          if (compareString(CONTRACT_METHOD_IDS.APPROVE, _inputStart)) {
            const _input = _txtDetail.input.slice(10);
            const value = web3Eth.decodeParameters(['address', 'uint256'], _input);

            amountApprove = value['1'];
          }
        }

        return amountApprove;
      }
      return '0';
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useIsApproveERC20Token;
