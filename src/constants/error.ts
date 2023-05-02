/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const ERROR_CODE = {
  PENDING: '0',
  INSUFFICIENT_BALANCE: '1',
  ACTION_REJECTED: 'ACTION_REJECTED',
  COMMON: 'COMMON',
  ERROR_MINUS_32603: '-32603',
};

export const ERRORS = {
  ACTION_REJECTED: 'user rejected transaction',
  COMMON: `There's something wrong! Try again!`,
  NOT_ENOUGH_GAS: `Not enough ETH to pay gas fee.`,
  TOO_MANY_REQUEST: `Too many requests. Please wait some minutes, refresh and try again.`,
  MAX_FEE_PER_GAS: 'Max fee per gas less than block base fee. Please try again.',
  HIGH_GAS_FEE: 'Gas fee is too high. Please try again later.',
  NOT_ENOUGH_COLLATERAL_BALANCE: `Not enough ETH in collateral balance to pay gas fee.`,
  YOUR_BALANCE_BTN_INSUFFICIENT: `Your balance is insufficient`,
};

export const getMessageError = (e: any, option: any) => {
  let title = '';

  if (
    e?.code === ERROR_CODE.ACTION_REJECTED ||
    (e?.code === 4001 && e?.message?.includes('denied message'))
  ) {
    title = '';
  } else if (
    e?.code?.toString() === ERROR_CODE.ERROR_MINUS_32603 &&
    e?.data?.code?.toString() === '-32000'
  ) {
    title = '';
  } else if (e?.message?.includes(ERRORS.YOUR_BALANCE_BTN_INSUFFICIENT)) {
    title = e?.message;
  } else {
    title = ERRORS[`COMMON`];
  }
  return title;
};

export function toastError(toast: any, e: any, option?: any) {
  console.log('toastError', e);
  const title: string = getMessageError(e, option);

  if (title) {
    toast({
      message: title,
    });
  }

  return null;
}
