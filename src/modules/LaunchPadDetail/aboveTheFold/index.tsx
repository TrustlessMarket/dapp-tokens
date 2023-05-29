/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLaunchPadStatus } from '@/modules/Launchpad/Launchpad.Status';
import LaunchpadUpComing from '@/modules/LaunchPadDetail/aboveTheFold/upComing';
import LaunchpadStarting from '@/modules/LaunchPadDetail/aboveTheFold/starting';
import BodyContainer from '@/components/Swap/bodyContainer';
import Usp from '@/modules/LaunchPadDetail/usp';
import styles from '@/modules/LaunchPadDetail/aboveTheFold/styles.module.scss';
import { ILaunchpad } from '@/interfaces/launchpad';

const AboveTheFold = ({ poolDetail }: ILaunchpad | any) => {
  const [status] = useLaunchPadStatus({ row: poolDetail });

  return (
    <BodyContainer className={styles.wrapper}>
      {status?.value === 'upcoming' ? (
        <LaunchpadUpComing poolDetail={poolDetail} />
      ) : (
        <LaunchpadStarting poolDetail={poolDetail} />
      )}
      <Usp />
    </BodyContainer>
  );
};

export default AboveTheFold;
