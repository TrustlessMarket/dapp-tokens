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
  percent?: number;
  percent7Day?: number;
  volume?: number;
  thumbnail?: string;
  description?: string;
  fromAddress?: string;
  toAddress?: string;
  social?: {
    website?: string;
    discord?: string;
    twitter?: string;
    telegram?: string;
    medium?: string;
    instagram?: string;
  };
  index?: number;
  balance?: string;
  decimal?: number | string;
  network?: string;
}
