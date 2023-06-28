import { IToken } from '../token';

export interface IPosition {
  id?: number;
  userAddress?: string;
  user_id?: number;
  pair_id?: number;
  pair?: Pair;
  token_id?: number;
  nonce?: string;
  opperator?: string;
  token0_address?: string;
  token1_address?: string;
  fee?: string;
  tick_lower?: number;
  tick_upper?: number;
  liquidity?: string;
  fee_growth_inside0_last_x128?: string;
  fee_growth_inside1_last_x128?: string;
  tokens_owed0?: string;
  tokens_owed1?: string;
}

export interface Pair {
  id?: number;
  contract_address?: string;
  timestamp?: Date;
  token0?: string;
  token1?: string;
  pair?: string;
  log_index?: number;
  token0_obj?: IToken;
  token1_obj?: IToken;
  reserve0?: string;
  reserve1?: string;
  base_token_symbol?: string;
  apr?: number;
  fee?: string;
  tick?: number;
  price?: string;
}
