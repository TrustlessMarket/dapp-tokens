/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILaunchpad } from '@/interfaces/launchpad';
import { StyledIdoStatus } from './Launchpad.styled';
import InfoTooltip from '@/components/Swap/infoTooltip';
import React from 'react';

export enum LAUNCHPAD_STATUS {
  Draft = -1,
  Pending,
  Voting,
  NotPassed,
  Launching,
  Successful,
  Failed,
  Cancelled,
  PrepareLaunching,

  //FE define
  End,
}

interface LabelStatusMap {
  [name: string]: any;
}

export const LaunchpadLabelStatus: LabelStatusMap = {
  draft: {
    key: LAUNCHPAD_STATUS.Draft,
    value: 'draft',
    label: 'Draft',
  },
  pending: {
    key: LAUNCHPAD_STATUS.Pending,
    value: 'pending',
    label: 'Preparing to Vote',
  },
  voting: {
    key: LAUNCHPAD_STATUS.Voting,
    value: 'voting',
    label: (
      <InfoTooltip
        showIcon={true}
        label="This project is being voted on by the community. If you like this project, kindly demonstrate your support by voting."
        iconColor={'#95A4FC'}
      >
        Voting
      </InfoTooltip>
    ),
  },
  notpassed: {
    key: LAUNCHPAD_STATUS.NotPassed,
    value: 'notpassed',
    label: (
      <InfoTooltip
        showIcon={true}
        label="The project has yet to be approved by the communities votes."
        iconColor={'rgba(255, 71, 71, 1)'}
      >
        Voting Failed
      </InfoTooltip>
    ),
  },
  launching: {
    key: LAUNCHPAD_STATUS.Launching,
    value: 'launching',
    label: 'Funding',
  },
  successful: {
    key: LAUNCHPAD_STATUS.Successful,
    value: 'successful',
    label: (
      <InfoTooltip
        showIcon={true}
        label="This project has successfully achieved its funding goal and has now closed."
        iconColor={'rgba(4, 197, 127, 1)'}
      >
        Closed
      </InfoTooltip>
    ),
  },
  failed: {
    key: LAUNCHPAD_STATUS.Failed,
    value: 'failed',
    label: (
      <InfoTooltip
        showIcon={true}
        label="This project did not reach its funding target."
        iconColor={'rgba(255, 71, 71, 1)'}
      >
        Closed
      </InfoTooltip>
    ),
  },
  cancelled: {
    key: LAUNCHPAD_STATUS.Cancelled,
    value: 'cancelled',
    label: 'Cancelled',
  },
  preparelaunching: {
    key: LAUNCHPAD_STATUS.PrepareLaunching,
    value: 'preparelaunching',
    label: 'Preparing to Fund',
  },
  end: {
    key: LAUNCHPAD_STATUS.End,
    value: 'end',
    label: 'Closed',
  },
};

export const useLaunchPadStatus = ({ row }: { row?: ILaunchpad | undefined }) => {
  const state = row?.state;
  const startTime = row?.launchStart;
  const endTime = row?.launchEnd;

  let status = LaunchpadLabelStatus.draft;

  if (state === LAUNCHPAD_STATUS.Pending) {
    status = LaunchpadLabelStatus.pending;
  } else if (state === LAUNCHPAD_STATUS.Voting) {
    status = LaunchpadLabelStatus.voting;
  } else if (state === LAUNCHPAD_STATUS.NotPassed) {
    status = LaunchpadLabelStatus.notpassed;
  } else if (state === LAUNCHPAD_STATUS.Launching) {
    status = LaunchpadLabelStatus.launching;
  } else if (state === LAUNCHPAD_STATUS.Successful) {
    status = LaunchpadLabelStatus.successful;
  } else if (state === LAUNCHPAD_STATUS.Failed) {
    status = LaunchpadLabelStatus.failed;
    // } else if (
    //   moment(startTime).unix() <= moment().unix() &&
    //   moment().unix() < moment(endTime).unix()
    // ) {
    //   status = LabelStatus.starting;
    // }
    // else if (moment().unix() >= moment(endTime).unix()) {
    //   status = LaunchpadLabelStatus.end;
  } else if (state === LAUNCHPAD_STATUS.Cancelled) {
    status = LaunchpadLabelStatus.cancelled;
  } else if (state === LAUNCHPAD_STATUS.PrepareLaunching) {
    status = LaunchpadLabelStatus.preparelaunching;
  }

  return [status];
};

const LaunchpadStatus = ({ row }: { row: ILaunchpad }) => {
  const [status] = useLaunchPadStatus({ row });

  return <StyledIdoStatus className={status.value}>{status.label}</StyledIdoStatus>;
};

export default LaunchpadStatus;
