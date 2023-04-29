import ERC20ABIJson from '@/abis/erc20.json';
import { TRANSFER_TX_SIZE } from '@/configs';
import { MaxUint256 } from '@/constants/url';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';

export interface IApproveERC20TokenParams {
  address: string;
  erc20TokenAddress: string;
}

const useApproveERC20Token: ContractOperationHook<
  IApproveERC20TokenParams,
  boolean
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IApproveERC20TokenParams): Promise<boolean> => {
      const { address, erc20TokenAddress } = params;
      if (account && provider && erc20TokenAddress) {
        const contract = getContract(
          erc20TokenAddress,
          ERC20ABIJson.abi,
          provider,
          account,
        );
        console.log({
          tcTxSizeByte: TRANSFER_TX_SIZE,
          feeRatePerByte: feeRate.fastestFee,
          erc20TokenAddress,
        });
        // const estimatedFee = TC_SDK.estimateInscribeFee({
        //   tcTxSizeByte: TRANSFER_TX_SIZE,
        //   feeRatePerByte: feeRate.fastestFee,
        // });
        // const balanceInBN = new BigNumber(btcBalance);
        // if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
        //   throw Error(
        //     `Your balance is insufficient. Please top up at least ${formatBTCPrice(
        //       estimatedFee.totalFee.toString(),
        //     )} BTC to pay network fee.`,
        //   );
        // }

        const transaction = await contract
          .connect(provider.getSigner())
          .approve(address, MaxUint256);

        return transaction;
      }

      return false;
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useApproveERC20Token;
