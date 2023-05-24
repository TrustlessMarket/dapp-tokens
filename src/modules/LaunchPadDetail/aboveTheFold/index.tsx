/* eslint-disable @typescript-eslint/no-explicit-any */
import {useLaunchPadStatus} from "@/modules/Launchpad/Launchpad.Status";
import LaunchpadUpComing from "@/modules/LaunchPadDetail/aboveTheFold/upComing";
import LaunchpadStarting from "@/modules/LaunchPadDetail/aboveTheFold/starting";

const AboveTheFold = ({poolDetail}: any) => {
  const [status] = useLaunchPadStatus({ row: poolDetail });

  console.log('statusstatusstatus', status);

  return (
    status?.value === 'upcoming' ? (
      <LaunchpadUpComing poolDetail={poolDetail}/>
    ) : (
      <LaunchpadStarting poolDetail={poolDetail}/>
    )
  )
};

export default AboveTheFold;