/* eslint-disable @typescript-eslint/no-explicit-any */
import {PROPOSAL_STATUS} from "@/modules/Proposal/Proposal.Status";
import {ILaunchpad} from "@/interfaces/launchpad";

export interface IProposal {
  id: string;
  state: PROPOSAL_STATUS;
  userPool: ILaunchpad;
  voteStart: string;
  voteEnd: string;
  forVotes: string;
  againstVotes: string;
  description: string;
  proposalId: string;
  proposerAddress: string;
}
