/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from 'bignumber.js';

export const checkLines = (str: string) => str.split(/\r\n|\r|\n/).length;

export const checkForHttpRegex = (str: string) => {
  const httpsRegex = /^(http|https):\/\//;
  return httpsRegex.test(str);
};

export const isBase64String = (str: string): boolean => {
  try {
    window.atob(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const isNumeric = (str: never | string) => {
  return /^\d+$/.test(str);
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const stringToBuffer = (str: string): Buffer => {
  return Buffer.from(str);
};

export const compareString = (a: unknown, b: unknown) => {
  return a?.toString?.()?.toLowerCase?.() === b?.toString?.()?.toLowerCase?.();
};

export function formatCurrency(value: any = 0, decimalNumber = 6) {
  if (isNaN(Number(value))) return 0;
  return new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 4,
  }).format(value);
  // return new BigNumber(value)
  //   .decimalPlaces(decimalNumber, 1)
  //   .toFormat(decimalNumber)
  //   .replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1');
}
