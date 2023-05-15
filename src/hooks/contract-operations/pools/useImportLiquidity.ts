import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';
import UniswapV2Pair from '@/abis/UniswapV2Pair.json';

export interface IImportLiquidityParams {
  poolAddress: string;
}

const useImportLiquidity: ContractOperationHook<
  IImportLiquidityParams,
  boolean
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);
  const call = useCallback(
    async (params: IImportLiquidityParams): Promise<boolean> => {
      const { poolAddress } = params;
      if (poolAddress && provider) {
        const contract = getContract(poolAddress, UniswapV2Pair, provider, account);

        const [token0, token1] = await Promise.all([
          contract.token0(),
          contract.token1(),
        ]);
        console.log(token0, token1);

        return true;
      }
      return true;
    },
    [account, provider, btcBalance, feeRate],
  );
  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useImportLiquidity;
