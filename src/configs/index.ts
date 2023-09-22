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
export const CHAIN_ID: string = process.env.NEXT_PUBLIC_CHAIN_ID!;
export const ETH_CHAIN_ID: string = process.env.NEXT_PUBLIC_ETH_CHAIN_ID!;
export const ALCHEMY_API_KEY: string = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;
export const ETHERSCAN_URL: string = process.env.NEXT_PUBLIC_ETHERSCAN_URL!;

// Contract configs
export const ARTIFACT_CONTRACT: string = process.env.NEXT_PUBLIC_ARTIFACT_CONTRACT!;
export const BNS_CONTRACT: string = process.env.NEXT_PUBLIC_BNS_CONTRACT!;
export const BFS_ADDRESS: string = process.env.NEXT_PUBLIC_BFS_CONTRACT!;
export const UNIV2_FACTORY_ADDRESS: string = process.env.NEXT_PUBLIC_UNIV2_FACTORY!;
export const UNIV2_ROUTER_ADDRESS: string = process.env.NEXT_PUBLIC_UNIV2_ROUTER!;
export const TM_ADDRESS: string = process.env.NEXT_PUBLIC_TM_ADDRESS!;
export const LAUNCHPAD_FACTORY_ADDRESS: string =
  process.env.NEXT_PUBLIC_LAUNCHPAD_FACTORY!;

// V3
export const UNIV3_FACTORY_ADDRESS: string = process.env.NEXT_PUBLIC_UNIV3_FACTORY!;
export const UNIV3_ROUTER_ADDRESS: string = process.env.NEXT_PUBLIC_UNIV3_ROUTER!;
export const UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS: string =
  process.env.NEXT_PUBLIC_UNIV3_NONFUNGBILE_POSITION_MANAGER!;
export const UNIV3_QUOTERV2_ADDRESS: string =
  process.env.NEXT_PUBLIC_UNIV3_QUOTERV2!;

export const TC_WEB_URL: string = process.env.NEXT_PUBLIC_TC_WEB_URL!;
export const TRANSFER_TX_SIZE = 1000!;

// Token configs

export const DEFAULT_FROM_ADDRESS = process.env.NEXT_PUBLIC_DEFAULT_FROM_ADDRESS!;
export const DEFAULT_TO_ADDRESS = process.env.NEXT_PUBLIC_DEFAULT_ADDRESS!;

export const MEMPOOL_URL = 'https://mempool.space';

// L2

export const L2_NETWORK_RPC: string = process.env.NEXT_PUBLIC_L2_RPC!;
export const L2_EXPLORER: string = process.env.NEXT_PUBLIC_L2_EXPLORER!;
export const L2_CHAIN_ID: string = process.env.NEXT_PUBLIC_L2_CHAIN_ID!;
export const L2_WBTC_ADDRESS: string = process.env.NEXT_PUBLIC_L2_WBTC!;
export const L2_ETH_ADDRESS: string = process.env.NEXT_PUBLIC_L2_ETH!;
export const L2_TM_ADDRESS: string = process.env.NEXT_PUBLIC_L2_TM_ADDRESS!;
export const L2_TC_ADDRESS: string = process.env.NEXT_PUBLIC_L2_TC_ADDRESS!;
export const L2_GM_ADDRESS: string = process.env.NEXT_PUBLIC_L2_GM_ADDRESS!;
export const L2_USDT_ADDRESS: string = process.env.NEXT_PUBLIC_L2_USDT_ADDRESS!;
export const L2_LAUNCHPAD_FACTORY_ADDRESS: string =
  process.env.NEXT_PUBLIC_L2_LAUNCHPAD_FACTORY!;

/* eslint-enable @typescript-eslint/no-non-null-assertion */
