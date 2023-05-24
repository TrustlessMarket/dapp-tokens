/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledIdoStatus } from './Launchpad.styled';

export enum LAUNCHPAD_STATUS {
  Created,
  Completed,
  Failed,
  Closed,
}

export const LabelStatus = {
  upcoming: {
    value: 'upcoming',
    label: 'Upcoming',
  },
  starting: {
    value: 'crowing-funding',
    label: 'Crowing',
  },
  end: {
    value: 'ending',
    label: 'Ending',
  },
  success: {
    value: 'success',
    label: 'Success',
  },
  failed: {
    value: 'failed',
    label: 'Failed',
  },
};

export const useLaunchPad = ({ row }: { row: any }) => {
  //
};

const LaunchpadStatus = ({ row }: { row: any }) => {
  const state = row.state;
  const startTime = row.startTime;
  const endTime = row.endTime;
  const status = LabelStatus.upcoming;

  return <StyledIdoStatus className={status.value}>{status.label}</StyledIdoStatus>;
};

export default LaunchpadStatus;
