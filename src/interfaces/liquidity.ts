import {IToken} from "@/interfaces/token";

export interface ILiquidity {
  id: string;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  apr?: string;
  volume?: string;
  token0Obj?: IToken;
  token1Obj: IToken
}
