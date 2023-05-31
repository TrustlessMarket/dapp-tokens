/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {StyledIdoStatus} from './Proposal.styled';
import {IProposal} from "@/interfaces/proposal";
import moment from "moment/moment";

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
  const state = row?.state;
  const startTime = row?.voteStart;
  const endTime = row?.voteEnd;

  let status = LabelStatus.pending;

  if (state === PROPOSAL_STATUS.Active) {
    status = LabelStatus.active;
  } else if (state === PROPOSAL_STATUS.Canceled) {
    status = LabelStatus.canceled;
  } else if (state === PROPOSAL_STATUS.Defeated) {
    status = LabelStatus.defeated;
  } else if (state === PROPOSAL_STATUS.Succeeded) {
    status = LabelStatus.succeeded;
  } else if (state === PROPOSAL_STATUS.Queued) {
    status = LabelStatus.queued;
  } else if (state === PROPOSAL_STATUS.Expired) {
    status = LabelStatus.expired;
  } else if (state === PROPOSAL_STATUS.Executed) {
    status = LabelStatus.executed;
  } else if (
    moment(startTime).unix() <= moment().unix() &&
    moment().unix() < moment(endTime).unix()
  ) {
    status = LabelStatus.active;
  } else if (
    moment().unix() >= moment(endTime).unix() ||
    state === PROPOSAL_STATUS.Closed
  ) {
    status = LabelStatus.closed;
  }

  return [status];
};

const ProposalStatus = ({ row }: { row: IProposal }) => {
  const [status] = useProposalStatus({ row });

  return <StyledIdoStatus className={status.value}>{status.label}</StyledIdoStatus>;
};

export default ProposalStatus;
