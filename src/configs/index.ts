/* eslint-disable @typescript-eslint/no-non-null-assertion */

// App configs
export const APP_ENV: string = process.env.NEXT_PUBLIC_MODE!;
export const API_URL: string = process.env.NEXT_PUBLIC_API_URL!;
export const API_EXCHANGE_URL: string = process.env.NEXT_PUBLIC_API_EXCHANGE_URL!;
export const TC_NETWORK_RPC: string = process.env.NEXT_PUBLIC_TC_NETWORK_RPC!;
export const TC_EXPLORER: string = process.env.NEXT_PUBLIC_TC_EXPLORER!;
export const CDN_URL: string = process.env.NEXT_PUBLIC_CDN_URL!;
export const API_FAUCET: string = process.env.NEXT_PUBLIC_API_FAUCET!;
export const WALLET_URL: string = process.env.NEXT_PUBLIC_WALLET_URL!;
export const TRUSTLESS_MARKET_URL: string =
  process.env.NEXT_PUBLIC_TRUSTLESS_MARKET_URL!;

// Contract configs
export const ARTIFACT_CONTRACT: string = process.env.NEXT_PUBLIC_ARTIFACT_CONTRACT!;
export const BNS_CONTRACT: string = process.env.NEXT_PUBLIC_BNS_CONTRACT!;
export const BFS_ADDRESS: string = process.env.NEXT_PUBLIC_BFS_CONTRACT!;
export const UNIV2_FACTORY_ADDRESS: string = process.env.NEXT_PUBLIC_UNIV2_FACTORY!;
export const UNIV2_ROUTER_ADDRESS: string = process.env.NEXT_PUBLIC_UNIV2_ROUTER!;
export const TM_ADDRESS: string = process.env.NEXT_PUBLIC_TM_ADDRESS!;
export const LAUNCHPAD_FACTORY_ADDRESS: string =
  process.env.NEXT_PUBLIC_LAUNCHPAD_FACTORY!;
export const ERC721_MARKETPLACE_ADDRESS: string = process.env.NEXT_PUBLIC_ERC721_MARKETPLACE!;

export const TC_WEB_URL: string = process.env.NEXT_PUBLIC_TC_WEB_URL!;
export const TRANSFER_TX_SIZE = 1000!;

// Token configs

export const DEFAULT_FROM_ADDRESS = process.env.NEXT_PUBLIC_DEFAULT_FROM_ADDRESS!;
export const DEFAULT_TO_ADDRESS = process.env.NEXT_PUBLIC_DEFAULT_ADDRESS!;

export const MEMPOOL_URL = 'https://mempool.space';
/* eslint-enable @typescript-eslint/no-non-null-assertion */
