/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import NonfungiblePositionManagerJson from '@/abis/NonfungiblePositionManager.json';
import { UNIV3_FACTORY_ADDRESS } from '@/configs';
import { NULL_ADDRESS } from '@/constants/url';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { IToken } from '@/interfaces/token';
import { compareString, getContract, sortAddressPair } from '@/utils';
import { encodePriceSqrt } from '@/utils/utilities';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';

export interface IGetPairParams {
  tokenA: IToken;
  tokenB: IToken;
  amountADesired: any;
  amountBDesired: any;
  lowerTick: any;
  upperTick: any;
  fee: any;
}

const useAddLiquidity: ContractOperationHook<IGetPairParams, string> = () => {
  const { provider, account } = useWeb3React();

  const call = useCallback(
    async (params: IGetPairParams): Promise<string> => {
      let {
        tokenA,
        tokenB,
        fee,
        amountADesired,
        amountBDesired,
        lowerTick,
        upperTick,
      } = params;
      if (provider) {
        const contract = getContract(
          UNIV3_FACTORY_ADDRESS,
          NonfungiblePositionManagerJson,
          provider,
          account,
        );
        let [token0, token1] = sortAddressPair(tokenA, tokenB);

        const isRevert = !compareString(token0.address, tokenA.address);

        if (isRevert) {
          [token0, token1] = [token1, token0];
          [amountADesired, amountBDesired] = [amountBDesired, amountADesired];
          [lowerTick, upperTick] = [-upperTick, -lowerTick];
        }

        const transaction = await contract
          .connect(provider.getSigner(0))
          .createAndInitializePoolIfNecessary(
            token0.address,
            token1.address,
            fee,
            encodePriceSqrt('2000', 1),
          );

        return transaction;
      }

      return NULL_ADDRESS;
    },
    [provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useAddLiquidity;
