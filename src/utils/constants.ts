/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from 'ethers';

export const MaxUint128 = BigNumber.from(2).pow(128).sub(1);

export enum FeeAmount {
  LOWER = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

export const TICK_SPACINGS: { [amount in FeeAmount]: any } = {
  [FeeAmount.LOWER]: 1,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200,
};
