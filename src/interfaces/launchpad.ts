/* eslint-disable @typescript-eslint/no-explicit-any */
import { LAUNCHPAD_STATUS } from '@/modules/Launchpad/Launchpad.Status';
import { IToken } from './token';
import { IProposal } from '@/interfaces/proposal';

export interface ILaunchpad {
  startTime: any;
  id: string;
  launchpadToken: IToken;
  liquidityToken: IToken;
  launchStart: string;
  launchEnd: string;
  creatorAddress: string;
  creatorRatio: string;
  launchpad: string;
  launchpadBalance: string;
  launchpadTokenAddress: string;
  liquidityBalance: string;
  liquidityRatio: string;
  goalBalance: string;
  thresholdBalance: string;
  liquidityTokenAddress: string;
  lpTokenReleaseTime: string;
  protocolRatio: string;
  state: LAUNCHPAD_STATUS;
  totalBoostValue: string;
  totalValue: string;
  totalValueUsd: string;
  txHash: string;
  description: string;
  qandA: string;
  video: string;
  image: string;
  boostUrl: string;
  duration: string;
  proposalId: string;
  userProposal: IProposal;
  voteStart: string;
  voteEnd: string;
  voteGoal: string;
  warningNote?: string;
}
