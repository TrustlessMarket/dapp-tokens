/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CHAIN_ID,
  ETH_CHAIN_ID,
  L2_CHAIN_ID,
  L2_EXPLORER,
  L2_NETWORK_RPC,
  TC_EXPLORER,
  TC_NETWORK_RPC,
} from '@/configs';
import { isProduction } from '@/utils/commons';

export enum SupportedChainId {
  ETH = Number(ETH_CHAIN_ID),
  POLYGON_MUMBAI = 80001,
  TRUSTLESS_COMPUTER = Number(CHAIN_ID),
  L2 = Number(L2_CHAIN_ID),
}

export const NETWORK_TO_CHAIN_ID: any = {
  eth: SupportedChainId.ETH,
  tc: SupportedChainId.TRUSTLESS_COMPUTER,
};

export const CHAIN_ID_TO_NETWORK: any = {
  [SupportedChainId.ETH]: 'eth',
  [SupportedChainId.TRUSTLESS_COMPUTER]: 'tc',
};

export const TRUSTLESS_COMPUTER_CHAIN_INFO = {
  name: `Trustless Computer ${isProduction() ? '' : 'Testnet'}`,
  title: '',
  chain: 'TC',
  icon: 'https://cdn.trustless.domains/icons/ic-penguin.svg',
  rpc: [TC_NETWORK_RPC],
  faucets: [],
  nativeCurrency: {
    name: 'JUICE',
    symbol: 'TC',
    decimals: 18,
  },
  infoURL: 'https://trustless.computer',
  shortName: 'TC',
  chainId: SupportedChainId.TRUSTLESS_COMPUTER,
  networkId: SupportedChainId.TRUSTLESS_COMPUTER,
  slip44: 0,
  explorers: [
    {
      name: 'Trustless computer explorer',
      url: TC_EXPLORER,
      standard: 'EIP3091',
    },
  ],
  ens: {
    registry: '',
  },
};

export const L2_CHAIN_INFO = {
  name: `NOS ${isProduction() ? '' : 'Testnet'}`,
  title: '',
  chain: 'NOS',
  icon: 'https://cdn.trustless.domains/icons/nos2.svg',
  rpc: [L2_NETWORK_RPC],
  faucets: [],
  nativeCurrency: {
    name: 'NOS',
    symbol: 'TC',
    decimals: 18,
  },
  infoURL: 'https://trustless.computer',
  shortName: 'NOS',
  chainId: SupportedChainId.L2,
  networkId: SupportedChainId.L2,
  slip44: 0,
  explorers: [
    {
      name: 'Trustless Computer L2 explorer',
      url: L2_EXPLORER,
      standard: 'EIP3091',
    },
  ],
  ens: {
    registry: '',
  },
};
