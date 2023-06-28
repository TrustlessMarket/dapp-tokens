import { IToken } from '@/interfaces/token';

export interface ILiquidity {
  id: string;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  apr?: string;
  volume?: string;
  token0Obj?: IToken;
  token1Obj?: IToken;
  reserve0?: string;
  reserve1?: string;
  usdVolume?: string;
  totalVolume?: string;
  usdTotalVolume?: string;
  pair?: string;
  liquidityUsd?: string;
  tick?: number;
  fee?: number;
}
