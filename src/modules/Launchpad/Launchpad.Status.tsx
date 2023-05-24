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
}

export const LabelStatus = {
  upcoming: {
    key: 0,
    value: 'upcoming',
    label: 'Upcoming',
  },
  starting: {
    key: 4,
    value: 'crowing-funding',
    label: 'Crowing',
  },
  end: {
    key: 1,
    value: 'ending',
    label: 'Ending',
  },
  success: {
    key: 3,
    value: 'success',
    label: 'Success',
  },
  failed: {
    key: 2,
    value: 'failed',
    label: 'Failed',
  },
};

export const useLaunchPadStatus = ({ row }: { row: ILaunchpad }) => {
  const state = row?.state;
  const startTime = row?.startTime;
  const endTime = row?.endTime;

  let status = LabelStatus.upcoming;

  if (state === LAUNCHPAD_STATUS.Failed) {
    status = LabelStatus.failed;
  } else if (
    moment(startTime).unix() <= moment().unix() &&
    moment().unix() < moment(endTime).unix()
  ) {
    status = LabelStatus.starting;
  } else if (moment().unix() >= moment(endTime).unix()) {
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
