/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILaunchpad } from '@/interfaces/launchpad';
import { StyledIdoStatus } from './Launchpad.styled';
import moment from 'moment';

export enum LAUNCHPAD_STATUS {
  Pending,
  Created,
  Completed,
  Cancelled,
  Failed,
  Closed,
  Starting,
  End,
}

export const LabelStatus = {
  upcoming: {
    key: LAUNCHPAD_STATUS.Pending,
    value: 'upcoming',
    label: 'Upcoming',
  },
  starting: {
    key: LAUNCHPAD_STATUS.Created,
    value: 'crowing-funding',
    label: 'Funding',
  },
  success: {
    key: LAUNCHPAD_STATUS.Completed,
    value: 'success',
    label: 'Success',
  },
  cancelled: {
    key: LAUNCHPAD_STATUS.Cancelled,
    value: 'cancelled',
    label: 'Closed',
  },
  failed: {
    key: LAUNCHPAD_STATUS.Failed,
    value: 'failed',
    label: 'Closed',
  },
  closed: {
    key: LAUNCHPAD_STATUS.Closed,
    value: 'closed',
    label: 'Closed',
  },
  end: {
    key: LAUNCHPAD_STATUS.End,
    value: 'ending',
    label: 'Closed',
  },
};

export const useLaunchPadStatus = ({ row }: { row: ILaunchpad }) => {
  const state = row?.state;
  const startTime = row?.startTime;
  const endTime = row?.endTime;

  let status = LabelStatus.upcoming;

  if (state === LAUNCHPAD_STATUS.Completed) {
    status = LabelStatus.success;
  } else if (state === LAUNCHPAD_STATUS.Failed) {
    status = LabelStatus.failed;
  } else if (state === LAUNCHPAD_STATUS.Closed) {
    status = LabelStatus.closed;
  } else if (state === LAUNCHPAD_STATUS.Created) {
    status = LabelStatus.starting;
  } else if (state === LAUNCHPAD_STATUS.Cancelled) {
    status = LabelStatus.cancelled;
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
