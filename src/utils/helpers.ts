/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_GAS_PRICE, TOKEN_ICON_DEFAULT } from '@/constants/common';
import tokenIcons from '@/constants/tokenIcons';
import { IToken } from '@/interfaces/token';
import { getAddress } from '@ethersproject/address';
import BigNumber from 'bignumber.js';
import { isEmpty, random } from 'lodash';
import camelCase from 'lodash/camelCase';
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
  const config: any = {
    notation: 'compact',
    compactDisplay: 'short',
    maximumSignificantDigits: 3,
    maximumFractionDigits: 2,
  };
  const result = new Intl.NumberFormat('en-US', config);
  return result.format(value);
};

export const getDefaultGasPrice = () => {
  return random(35, 45) * DEFAULT_GAS_PRICE;
};

export const getLiquidityRatio = (ratio: any) => {
  return new BigNumber(web3.utils.toWei(ratio).toString()).dividedBy(10000);
};

export const calcLaunchpadInitialPrice = ({
  launchpadBalance,
  liquidityBalance,
  liquidityRatioArg,
}: {
  launchpadBalance: string;
  liquidityBalance: string;
  liquidityRatioArg: string;
}) => {
  let price = '0';
  if (launchpadBalance && liquidityBalance) {
    price = new BigNumber(launchpadBalance)
      .multipliedBy(new BigNumber(liquidityRatioArg).dividedBy(100))
      .dividedBy(liquidityBalance)
      .toString();
  }
  return price;
};

export const getTokenIconUrl = (token: IToken | any) => {
  let url = TOKEN_ICON_DEFAULT;
  if (token?.thumbnail) {
    url = token?.thumbnail;
  } else if (tokenIcons?.[token?.symbol?.toLowerCase()]) {
    url = tokenIcons?.[token?.symbol?.toLowerCase()];
  }
  return url;
};
