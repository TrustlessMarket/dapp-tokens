/* eslint-disable @typescript-eslint/no-explicit-any */
import { NULL_ADDRESS } from '@/constants/url';
import { compareString, formatCurrency } from '@/utils';
import BigNumber from 'bignumber.js';

export const getUniTickSpacing = () => {
  return 60;
};

export const getUniFee = () => {
  // fee 0.3%
  return 3000;
};

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
