/* eslint-disable @typescript-eslint/no-explicit-any */
import { CHAIN_ID, ETH_CHAIN_ID, TC_EXPLORER, TC_NETWORK_RPC } from '@/configs';

export enum SupportedChainId {
  ETH = Number(ETH_CHAIN_ID),
  POLYGON_MUMBAI = 80001,
  TRUSTLESS_COMPUTER = Number(CHAIN_ID),
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
  name: 'Trustless Computer',
  title: '',
  chain: 'TC',
  icon: 'https://cdn.trustless.computer/icons/wallet_logo.svg',
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
