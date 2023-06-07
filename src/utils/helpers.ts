/* eslint-disable @typescript-eslint/no-explicit-any */
import { IToken } from '@/interfaces/token';
import { getAddress } from '@ethersproject/address';
import BigNumber from 'bignumber.js';
import camelCase from 'lodash/camelCase';
import { formatCurrency } from './string';
import { isEmpty, random } from 'lodash';
import { DEFAULT_GAS_PRICE } from '@/constants/common';
import web3 from 'web3';

export function isAddress(value: string): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export const shortCryptoAddress = (address = '', toLength?: number) => {
  if (toLength) {
    if (address.length <= toLength) return address;
    const x = Math.floor(toLength / 2);
    return `${address?.substr(0, x)}...${address?.substr(address?.length - x)}`;
  }
  if (address.length <= 16) return address;
  return `${address?.substr(0, 8)}...${address?.substr(address?.length - 8)}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const camelCaseKeys = (obj: any): any => {
  if (Boolean(obj) && !isEmpty(obj) && Array.isArray(obj)) {
    return obj.map((v) => camelCaseKeys(v));
  }
  if (Boolean(obj) && obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelCaseKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
};

export const sortAddressPair = (
  tokenA: IToken,
  tokenB: IToken,
): [IToken, IToken] => {
  const { token0, token1 } =
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
      ? { token0: tokenA, token1: tokenB }
      : { token0: tokenB, token1: tokenA };
  return [token0, token1];
};

export const abbreviateNumber = (value: any) => {
  const formatValue = new BigNumber(value).toNumber();
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (formatValue >= si[i].value) {
      break;
    }
  }
  return (
    formatCurrency((formatValue / si[i].value).toFixed(2).replace(rx, '$1')) +
    si[i].symbol
  );
};

export const getDefaultGasPrice = () => {
  return random(35, 45) * DEFAULT_GAS_PRICE;
};

export const getLiquidityRatio = (ratio: any) => {
  return new BigNumber(web3.utils.toWei(ratio).toString()).dividedBy(10000);
};
