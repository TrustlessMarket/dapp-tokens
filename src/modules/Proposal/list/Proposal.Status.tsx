/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {StyledIdoStatus} from './Proposal.styled';
import {IProposal} from "@/interfaces/proposal";

export enum PROPOSAL_STATUS {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
  Closed,
};

interface LabelStatusMap {
  [name: string]: any
}

export const LabelStatus : LabelStatusMap = {
  'pending': {
    key: PROPOSAL_STATUS.Pending,
    value: 'pending',
    label: 'Pending',
  },
  'active': {
    key: PROPOSAL_STATUS.Active,
    value: 'active',
    label: 'Active',
  },
  'canceled': {
    key: PROPOSAL_STATUS.Canceled,
    value: 'canceled',
    label: 'Canceled',
  },
  'defeated': {
    key: PROPOSAL_STATUS.Defeated,
    value: 'defeated',
    label: 'Defeated',
  },
  'succeeded': {
    key: PROPOSAL_STATUS.Succeeded,
    value: 'succeeded',
    label: 'Succeeded',
  },
  'queued': {
    key: PROPOSAL_STATUS.Queued,
    value: 'queued',
    label: 'Queued',
  },
  'expired': {
    key: PROPOSAL_STATUS.Expired,
    value: 'expired',
    label: 'Expired',
  },
  'executed': {
    key: PROPOSAL_STATUS.Executed,
    value: 'executed',
    label: 'Executed',
  },
  'closed': {
    key: PROPOSAL_STATUS.Closed,
    value: 'closed',
    label: 'Closed',
  },
};

export const useProposalStatus = ({ row }: { row: IProposal }) => {
  return [LabelStatus[PROPOSAL_STATUS[row?.state]?.toLowerCase()]];
};

const ProposalStatus = ({ row }: { row: IProposal }) => {
  const [status] = useProposalStatus({ row });

  return <StyledIdoStatus className={status.value}>{status.label}</StyledIdoStatus>;
};

export default ProposalStatus;
