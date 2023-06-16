import ERC20ABIJson from '@/abis/erc20.json';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract, getDefaultProvider, isSupportedChain } from '@/utils';
import { formatAmountBigNumber } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';

export interface IInfoERC20TokenParams {
  erc20TokenAddress: string;
}

export interface IInfoERC20TokenResponse {
  balance?: string;
  name: string;
  address: string;
  decimals: string;
  totalSupply: string;
  symbol: string;
}

const useInfoERC20Token: ContractOperationHook<
  IInfoERC20TokenParams,
  IInfoERC20TokenResponse
> = () => {
  const { account, chainId } = useWeb3React();
  const isTrustChain = isSupportedChain(chainId);

  const provider = getDefaultProvider();

  const call = useCallback(
    async (params: IInfoERC20TokenParams): Promise<IInfoERC20TokenResponse> => {
      const { erc20TokenAddress } = params;
      if (provider && erc20TokenAddress) {
        const contract = getContract(erc20TokenAddress, ERC20ABIJson.abi, provider);

        const [name, decimals, symbol, totalSupply] = await Promise.all([
          contract.connect(provider).name(),
          contract.connect(provider).decimals(),
          contract.connect(provider).symbol(),
          contract.connect(provider).totalSupply(),
        ]);

        let balance = '0';

        if (account && isTrustChain) {
          const resBalance = await contract
            .connect(provider.getSigner())
            .balanceOf(account);
          balance = formatAmountBigNumber(resBalance.toString(), decimals);
        }

        return {
          balance,
          name,
          symbol,
          totalSupply: formatAmountBigNumber(totalSupply.toString(), decimals),
          decimals,
          address: erc20TokenAddress,
        };
      }
      return {
        balance: '0',
        name: '',
        symbol: '',
        totalSupply: '0',
        decimals: '',
        address: '',
      };
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useInfoERC20Token;
