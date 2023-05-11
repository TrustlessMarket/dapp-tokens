/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledIdoStatus } from './IdoToken.styled';

export const status = {
  upcoming: 'upcoming',
  started: 'started',
  finished: 'finished',
};

const IdoTokenStatus = ({ row }: { row: any }) => {
  const status = row.status;
  return <StyledIdoStatus className={status}>{status}</StyledIdoStatus>;
};

export default IdoTokenStatus;
