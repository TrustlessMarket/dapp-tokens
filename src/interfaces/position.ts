import { IToken } from '@/interfaces/token';
import {ILiquidity} from "@/interfaces/liquidity";

export interface IPosition {
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
  pair?: ILiquidity;
}
