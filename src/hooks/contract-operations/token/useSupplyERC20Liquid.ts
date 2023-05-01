import ERC20ABIJson from '@/abis/erc20.json';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract } from '@/utils';
import { formatEthPrice } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';

export interface ISupplyERC20LiquidParams {
  liquidAddress: string;
}

export interface ISupplyERC20LiquidResponse {
  totalSupply: string;
  ownerSupply: string;
}

const useSupplyERC20Liquid: ContractOperationHook<
  ISupplyERC20LiquidParams,
  ISupplyERC20LiquidResponse
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (
      params: ISupplyERC20LiquidParams,
    ): Promise<ISupplyERC20LiquidResponse> => {
      const { liquidAddress } = params;
      if (provider && liquidAddress) {
        const contract = getContract(liquidAddress, ERC20ABIJson.abi, provider);

        const totalSupply = await contract
          .connect(provider.getSigner())
          .totalSupply();

        let ownerSupply = '0';

        if (account) {
          ownerSupply = await contract
            .connect(provider.getSigner())
            .balanceOf(account);
        }

        return {
          totalSupply: formatEthPrice(totalSupply.toString()),
          ownerSupply: formatEthPrice(ownerSupply.toString()),
        };
      }
      return {
        totalSupply: '0',
        ownerSupply: '0',
      };
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.NONE,
  };
};

export default useSupplyERC20Liquid;