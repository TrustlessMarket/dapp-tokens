/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NULL_ADDRESS } from '@/constants/url';
import { compareString, formatCurrency } from '@/utils';
import { FeeAmount, MaxUint128 } from '@/utils/constants';
import { amountDesiredChanged } from '@/utils/utilities';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { isNumber } from 'lodash';

export const isPool = (address: string): boolean => {
  if (address && !compareString(address, NULL_ADDRESS)) {
    return true;
  }
  return false;
};

export const checkBalanceIsApprove = (required: any = 0, amount: any = 0) => {
  if (Number(amount) > 0) {
    return new BigNumber(required).minus(amount).toNumber() >= 0;
  }

  return true;
};

export const validateBaseAmount = (_amount: any, values: any) => {
  const baseTokenBalance: string = values?.baseTokenBalance || '0';

  if (new BigNumber(_amount).gt(baseTokenBalance)) {
    return `Max amount is ${formatCurrency(baseTokenBalance)}`;
  }

  return undefined;
};

export const validateQuoteAmount = (_amount: any, values: any) => {
  const quoteTokenBalance: string = values?.quoteTokenBalance || '0';

  if (new BigNumber(_amount).gt(quoteTokenBalance)) {
    return `Max amount is ${formatCurrency(quoteTokenBalance)}`;
  }

  return undefined;
};

export const feeTiers = [
  {
    value: FeeAmount.LOWER,
    title: FeeAmount.LOWER / 10000 / 2,
    desc: 'Best for very stable pairs.',
  },
  {
    value: FeeAmount.LOW,
    title: FeeAmount.LOW / 10000 / 2,
    desc: 'Best for most pairs.',
  },
  {
    value: FeeAmount.MEDIUM,
    title: FeeAmount.MEDIUM / 10000 / 2,
    desc: 'Best for stable pairs.',
  },
  {
    value: FeeAmount.HIGH,
    title: FeeAmount.HIGH / 10000 / 2,
    desc: 'Best for exotic pairs.',
  },
];

export const validateMinRangeAmount = (_amount: any, values: any) => {
  const minPrice = values?.minPrice;
  const maxPrice = values?.maxPrice;

  if (new BigNumber(minPrice).gte(maxPrice)) {
    return `Min price less than ${formatCurrency(maxPrice)}`;
  }

  return undefined;
};

export const validateMaxRangeAmount = (_amount: any, values: any) => {
  const minPrice = values?.minPrice;
  const maxPrice = values?.maxPrice;

  if (new BigNumber(maxPrice).lt(minPrice)) {
    return `Max price greater than ${formatCurrency(minPrice)}`;
  }

  return undefined;
};

export const handleChangeAmount = (
  type: 'baseAmount' | 'quoteAmount',
  { _amount, currentTick, tickLower, tickUpper }: any,
) => {
  try {
    console.log('currentTick', currentTick);

    const [baseAmount, quoteAmount] = amountDesiredChanged(
      currentTick,
      tickLower,
      tickUpper,
      type === 'baseAmount' ? ethers.utils.parseEther(_amount) : MaxUint128,
      type === 'quoteAmount' ? ethers.utils.parseEther(_amount) : MaxUint128,
    );
    return ethers.utils.formatEther(
      type === 'baseAmount' ? quoteAmount : baseAmount,
    );
  } catch (error) {
    console.log('error', error);

    return 0;
  }
};

export const allowStep = (values: any) => {
  let step = 0;

  if (
    Boolean(values?.baseToken) &&
    Boolean(values?.quoteToken) &&
    !compareString(values?.baseToken?.address, values?.quoteToken?.address)
  ) {
    step = 1;
  }
  if (
    Boolean(values?.baseToken) &&
    Boolean(values?.quoteToken) &&
    !compareString(values?.baseToken?.address, values?.quoteToken?.address) &&
    Boolean(values?.fee)
  ) {
    step = 2;
  }
  if (
    Boolean(values?.baseToken) &&
    Boolean(values?.quoteToken) &&
    !compareString(values?.baseToken?.address, values?.quoteToken?.address) &&
    Boolean(values?.fee) &&
    (isNumber(values?.tickUpper) || isNumber(values?.tickLower))
  ) {
    step = 3;
  }
  if (
    Boolean(values?.baseToken) &&
    Boolean(values?.quoteToken) &&
    !compareString(values?.baseToken?.address, values?.quoteToken?.address) &&
    Boolean(values?.fee) &&
    (isNumber(values?.tickUpper) || isNumber(values?.tickLower)) &&
    (isNumber(values?.baseAmount) || isNumber(values?.quoteAmount))
  ) {
    step = 4;
  }

  return step;
};
