/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IToken {
  btcPrice?: number | string;
  ownerSupply?: string | number;
  toBalance?: string | number;
  fromBalance?: string | number;
  id: string;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  address: string;
  totalSupply?: any;
  owner?: string;
  deployedAtBlock?: number;
  slug?: string;
  symbol: string;
  name: string;
  price?: number | string;
  usdPrice?: number;
  usdVolume?: number;
  usdTotalVolume?: number;
  usdMarketCap?: number;
  percent?: any;
  percent7Day?: any;
  volume?: number;
  thumbnail?: string;
  description?: string;
  fromAddress?: string;
  toAddress?: string;
  social?: Social;
  index?: number;
  balance?: string;
  decimal?: number | string;
  network?: string;
  baseTokenSymbol?: string;
  status?: string;
  verifyCode?: string;
  chart?: [];
}

export interface Social {
  website?: string;
  discord?: string;
  twitter?: string;
  telegram?: string;
  medium?: string;
  instagram?: string;
}
