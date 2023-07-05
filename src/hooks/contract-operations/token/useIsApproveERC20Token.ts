import ERC20ABIJson from '@/abis/erc20.json';
import { SupportedChainId } from '@/constants/chains';
import { CONTRACT_METHOD_IDS } from '@/constants/methodId';
import { TransactionEventType } from '@/enums/transaction';
import useBitcoin from '@/hooks/useBitcoin';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { compareString, getContract, isSupportedChain } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { maxBy } from 'lodash';
import { useCallback } from 'react';
import web3Eth from 'web3-eth-abi';

export interface IIsApproveERC20TokenParams {
  erc20TokenAddress: string;
  address: string;
}

const useIsApproveERC20Token: ContractOperationHook<
  IIsApproveERC20TokenParams,
  string
> = () => {
  const { account, chainId, provider } = useWeb3React();
  const isConnected = isSupportedChain(chainId);
  const { getUnInscribedTransactionDetailByAddress, getTCTxByHash } = useBitcoin();

  const call = useCallback(
    async (params: IIsApproveERC20TokenParams): Promise<string> => {
      const { erc20TokenAddress, address } = params;
      if (account && provider && erc20TokenAddress && isConnected && address) {
        const contract = getContract(erc20TokenAddress, ERC20ABIJson.abi, provider);

        let amountApprove = '0';

        if (compareString(chainId, SupportedChainId.TRUSTLESS_COMPUTER)) {
          const [unInscribedTxIDs, transaction] = await Promise.all([
            getUnInscribedTransactionDetailByAddress(account),
            contract.connect(provider.getSigner()).allowance(account, address),
          ]);

          amountApprove = transaction.toString();

          const txPendingForTokenAddress = unInscribedTxIDs.filter((v) =>
            compareString(v.To, erc20TokenAddress),
          );
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
        } else {
          const [transaction] = await Promise.all([
            contract.connect(provider.getSigner()).allowance(account, address),
          ]);

          amountApprove = transaction.toString();
        }

        return amountApprove;
      }
      return '0';
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useIsApproveERC20Token;
