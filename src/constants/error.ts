/* eslint-disable @typescript-eslint/no-unused-vars */

import { TC_WEB_URL, WALLET_URL } from '@/configs';
import { DappsTabs } from '@/enums/tabs';
import { compareString } from '@/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const ERROR_CODE = {
  PENDING: '0',
  INSUFFICIENT_BALANCE: '1',
  ACTION_REJECTED: 'ACTION_REJECTED',
  COMMON: 'COMMON',
  ERROR_MINUS_32603: '-32603',
};

export const ERRORS = {
  ACTION_REJECTED: 'User rejected transaction',
  COMMON: `There's something wrong! Try again!`,
  NOT_ENOUGH_GAS: `Not enough TC to pay gas fee.`,
  TOO_MANY_REQUEST: `Too many requests. Please wait some minutes, refresh and try again.`,
  MAX_FEE_PER_GAS: 'Max fee per gas less than block base fee. Please try again.',
  HIGH_GAS_FEE: 'Gas fee is too high. Please try again later.',
  NOT_ENOUGH_COLLATERAL_BALANCE: `Not enough ETH in collateral balance to pay gas fee.`,
  YOUR_BALANCE_BTN_INSUFFICIENT: `Your balance is insufficient`,
  PENDING: '0',
};

export const getMessageError = (e: any, option: any) => {
  let title = e?.message;
  let url = null;
  let linkText = null;

  if (
    e?.code === ERROR_CODE.ACTION_REJECTED ||
    (e?.code === 4001 && e?.message?.includes('denied message'))
  ) {
    title = ERRORS.ACTION_REJECTED;
  } else if (
    e?.code?.toString() === ERROR_CODE.ERROR_MINUS_32603 &&
    e?.data?.code?.toString() === '-32000'
  ) {
    title = ERRORS.NOT_ENOUGH_GAS;
    url = `https://tcgasstation.com/`;
    linkText = 'Topup now';
  } else if (e?.message?.includes(ERRORS.YOUR_BALANCE_BTN_INSUFFICIENT)) {
    title = e?.message;
  } else if (compareString(e?.message, ERRORS.PENDING)) {
    title =
      'You have some pending transactions. Please complete all of them before moving on.';
    url = `${WALLET_URL}/?tab=${DappsTabs.TRANSACTION}`;
    linkText = 'Go to Wallet';
  }
  return { title, url, linkText };
};

export function toastError(toast: any, e: any, option?: any) {
  const { title, url, linkText } = getMessageError(e, option);

  if (title) {
    toast({
      message: title,
      url,
      linkText,
    });
  }

  return null;
}
