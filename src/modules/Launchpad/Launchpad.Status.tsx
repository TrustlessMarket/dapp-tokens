/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILaunchpad } from '@/interfaces/launchpad';
import { StyledIdoStatus } from './Launchpad.styled';
import moment from 'moment';

export enum LAUNCHPAD_STATUS {
  Created,
  Completed,
  Failed,
  Closed,
  Starting,
  End,
}

export const LabelStatus = {
  upcoming: {
    key: LAUNCHPAD_STATUS.Created,
    value: 'upcoming',
    label: 'Upcoming',
  },
  starting: {
    key: LAUNCHPAD_STATUS.Starting,
    value: 'crowing-funding',
    label: 'On going',
  },
  end: {
    key: LAUNCHPAD_STATUS.End,
    value: 'ending',
    label: 'Ending',
  },
  closed: {
    key: LAUNCHPAD_STATUS.Closed,
    value: 'closed',
    label: 'Closed',
  },
  success: {
    key: LAUNCHPAD_STATUS.Completed,
    value: 'success',
    label: 'Success',
  },
  failed: {
    key: LAUNCHPAD_STATUS.Failed,
    value: 'failed',
    label: 'Failed',
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
  } else if (
    moment(startTime).unix() <= moment().unix() &&
    moment().unix() < moment(endTime).unix()
  ) {
    status = LabelStatus.starting;
  } else if (moment().unix() >= moment(endTime).unix()) {
    status = LabelStatus.end;
  }

  console.log('status', status);

  return [status];

  //
};

const LaunchpadStatus = ({ row }: { row: ILaunchpad }) => {
  const [status] = useLaunchPadStatus({ row });

  return <StyledIdoStatus className={status.value}>{status.label}</StyledIdoStatus>;
};

export default LaunchpadStatus;
