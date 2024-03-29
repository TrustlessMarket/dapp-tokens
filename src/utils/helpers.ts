/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { L2_CHAIN_INFO, SupportedChainId } from '@/constants/chains';
import {
  DEFAULT_GAS_PRICE,
  L2_GASSTATION,
  TC_ADDRESS,
  TOKEN_ICON_DEFAULT,
  TRUSTLESS_GASSTATION,
  WBTC_ADDRESS,
  WETH_ADDRESS,
} from '@/constants/common';
import { CHAIN_INFO } from '@/constants/storage-key';
import tokenIcons from '@/constants/tokenIcons';
import { IResourceChain } from '@/interfaces/chain';
import { IToken } from '@/interfaces/token';
import store from '@/state';
import { getAddress } from '@ethersproject/address';
import BigNumber from 'bignumber.js';
import { isEmpty, random } from 'lodash';
import camelCase from 'lodash/camelCase';
import web3 from 'web3';
import { compareString } from './string';
import {
  L2_ETH_ADDRESS,
  L2_LAUNCHPAD_FACTORY_ADDRESS,
  L2_TM_ADDRESS,
  L2_WBTC_ADDRESS,
  LAUNCHPAD_FACTORY_ADDRESS,
  TM_ADDRESS,
} from '@/configs';

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
  tokenA?: IToken | any,
  tokenB?: IToken | any,
): [IToken | any, IToken | any] => {
  if (Boolean(tokenA?.address) && Boolean(tokenB?.address)) {
    const { token0, token1 } =
      tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
        ? { token0: tokenA, token1: tokenB }
        : { token0: tokenB, token1: tokenA };
    return [token0, token1];
  }
  return [tokenA, tokenB];
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

export const getExplorer = (
  address: string,
  type: 'address' | 'tx' = 'tx',
  chain?: string,
) => {
  const connectedChain: IResourceChain = getLocalStorageChainInfo();
  return `${chain || connectedChain.explorers[0].url}/${type}/${address}`;
};

export const getLocalStorageChainInfo = (): IResourceChain => {
  const chainInfo = localStorage.getItem(CHAIN_INFO);
  if (chainInfo) {
    const parseChainInfo = JSON.parse(chainInfo);
    return parseChainInfo;
  }
  return L2_CHAIN_INFO;
};

export const getLaunchPadAddress = () => {
  const currentChain: IResourceChain = store.getState().pnftExchange.currentChain;

  if (compareString(currentChain?.chainId, SupportedChainId.L2)) {
    return L2_LAUNCHPAD_FACTORY_ADDRESS;
  }
  return LAUNCHPAD_FACTORY_ADDRESS;
};

export const getWBTCAddress = () => {
  const currentChain: IResourceChain = store.getState().pnftExchange.currentChain;

  if (compareString(currentChain?.chainId, SupportedChainId.L2)) {
    return L2_WBTC_ADDRESS;
  }
  return WBTC_ADDRESS;
};

export const getTCAddress = () => {
  return TC_ADDRESS;
};

export const getWETHAddress = () => {
  const currentChain: IResourceChain = store.getState().pnftExchange.currentChain;

  if (compareString(currentChain?.chainId, SupportedChainId.L2)) {
    return L2_ETH_ADDRESS;
  }
  return WETH_ADDRESS;
};

export const getTMAddress = () => {
  const currentChain: IResourceChain = store.getState().pnftExchange.currentChain;

  if (compareString(currentChain?.chainId, SupportedChainId.L2)) {
    return L2_TM_ADDRESS;
  }
  return TM_ADDRESS;
};

export const getTCGasStationddress = () => {
  const currentChain: IResourceChain = store.getState().pnftExchange.currentChain;

  if (compareString(currentChain?.chainId, SupportedChainId.L2)) {
    return L2_GASSTATION;
  }
  return TRUSTLESS_GASSTATION;
};

export const isNativeToken = (tokenAddress: string) => {
  let isNative = false;
  if (compareString(tokenAddress, '0x8b485d217096cE20A09AF11D15ccCc63323C1469')) {
    isNative = true;
  } else if (
    compareString(tokenAddress, '0xaD771ED0F8C5df06D21A7eDA3b00acD6688dD532')
  ) {
    isNative = true;
  }
  return isNative;
};
