export interface IToken {
  ownerSupply?: string | number;
  toBalance?: string | number;
  fromBalance?: string | number;
  id: string;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  address: string;
  totalSupply?: string;
  owner?: string;
  deployedAtBlock?: number;
  slug?: string;
  symbol: string;
  name: string;
  price?: number;
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
}
