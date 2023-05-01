import { IToken } from '@/interfaces/token';
import { getAddress } from '@ethersproject/address';
import camelCase from 'lodash/camelCase';

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
  if (Array.isArray(obj)) {
    return obj.map((v) => camelCaseKeys(v));
  }
  if (obj !== null && obj.constructor === Object) {
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
