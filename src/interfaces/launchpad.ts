import { LAUNCHPAD_STATUS } from '@/modules/Launchpad/Launchpad.Status';
import { IToken } from './token';

export interface ILaunchpad {
  id: string;
  launchpadToken: IToken;
  liquidityToken: IToken;
  startTime: string;
  endTime: string;
  creatorAddress: string;
  creatorRatio: string;
  launchpad: string;
  launchpadBalance: string;
  launchpadTokenAddress: string;
  liquidityBalance: string;
  liquidityRatio: string;
  goalBalance: string;
  liquidityTokenAddress: string;
  lpTokenReleaseTime: string;
  protocolRatio: string;
  state: LAUNCHPAD_STATUS;
  totalBoostValue: string;
  totalValue: string;
  totalValueUsd: string;
  txHash: string;
  description: string;
  qand_a: string;
}
