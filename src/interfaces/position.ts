import { IToken } from './token';

export interface IPosition {
  id?: number;
  userAddress?: string;
  userId?: number;
  pairId?: number;
  pair?: Pair;
  tokenId?: number;
  nonce?: string;
  opperator?: string;
  token0Address?: string;
  token1Address?: string;
  fee?: string;
  tickLower?: number;
  tickUpper?: number;
  liquidity?: string;
  feeGrowthInside0LastX128?: string;
  feeGrowthInside1LastX128?: string;
  tokensOwed0?: string;
  tokensOwed1?: string;
}

export interface Pair {
  id?: number;
  contractAddress?: string;
  timestamp?: Date;
  token0?: string;
  token1?: string;
  pair?: string;
  logIndex?: number;
  token0Obj?: IToken;
  token1Obj?: IToken;
  reserve0?: string;
  reserve1?: string;
  baseTokenSymbol?: string;
  apr?: number;
  fee?: string;
  tick?: number;
  price?: string;
  sqrtPriceX96?: string;
}
