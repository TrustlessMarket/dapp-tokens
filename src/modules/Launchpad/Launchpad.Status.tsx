/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILaunchpad } from '@/interfaces/launchpad';
import { StyledIdoStatus } from './Launchpad.styled';
import moment from 'moment';

export enum LAUNCHPAD_STATUS {
  Pending,
  Voting,
  NotPassed,
  Launching,
  Successful,
  Failed,

  //FE define
  End,
}

export const LabelStatus = {
  pending: {
    key: LAUNCHPAD_STATUS.Pending,
    value: 'pending',
    label: 'Voting Preparation',
  },
  voting: {
    key: LAUNCHPAD_STATUS.Voting,
    value: 'voting',
    label: 'Voting',
  },
  notpassed: {
    key: LAUNCHPAD_STATUS.NotPassed,
    value: 'notpassed',
    label: 'Closed',
  },
  launching: {
    key: LAUNCHPAD_STATUS.Launching,
    value: 'launching',
    label: 'Funding',
  },
  successful: {
    key: LAUNCHPAD_STATUS.Successful,
    value: 'successful',
    label: 'Closed',
  },
  failed: {
    key: LAUNCHPAD_STATUS.Failed,
    value: 'failed',
    label: 'Closed',
  },
  end: {
    key: LAUNCHPAD_STATUS.End,
    value: 'end',
    label: 'Closed',
  },
};

export const useLaunchPadStatus = ({ row }: { row: ILaunchpad }) => {
  const state = row?.state;
  const startTime = row?.startTime;
  const endTime = row?.endTime;

  let status = LabelStatus.pending;

  if (state === LAUNCHPAD_STATUS.Voting) {
    status = LabelStatus.voting;
  } else if (state === LAUNCHPAD_STATUS.NotPassed) {
    status = LabelStatus.notpassed;
  } else if (state === LAUNCHPAD_STATUS.Launching) {
    status = LabelStatus.launching;
  } else if (state === LAUNCHPAD_STATUS.Successful) {
    status = LabelStatus.successful;
  } else if (state === LAUNCHPAD_STATUS.Failed) {
    status = LabelStatus.failed;
  // } else if (
  //   moment(startTime).unix() <= moment().unix() &&
  //   moment().unix() < moment(endTime).unix()
  // ) {
  //   status = LabelStatus.starting;
  } else if (moment().unix() >= moment(endTime).unix() && row?.proposalId) {
    status = LabelStatus.end;
  }

  return [status];

  //
};

const LaunchpadStatus = ({ row }: { row: ILaunchpad }) => {
  const [status] = useLaunchPadStatus({ row });

  return <StyledIdoStatus className={status.value}>{status.label}</StyledIdoStatus>;
};

export default LaunchpadStatus;
