/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/state/hooks';
import { currentChainSelector, selectPnftExchange } from '@/state/pnftExchange';
import Side from '@/modules/ProposalDetail/result/side';
import { Box } from '@chakra-ui/react';
import styles from './styles.module.scss';
import cx from 'classnames';
import { getVoteResultLaunchpad } from '@/services/launchpad';
import { ILaunchpad } from '@/interfaces/launchpad';
import px2rem from '@/utils/px2rem';
import { LAUNCHPAD_STATUS } from '@/modules/Launchpad/Launchpad.Status';
import BuyForm from '@/modules/LaunchPadDetail/form';
import { IResourceChain } from '@/interfaces/chain';
import { useSelector } from 'react-redux';

const ProposalResult = ({ poolDetail }: { poolDetail: ILaunchpad }) => {
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const [voteResult, setVoteResult] = useState<any>();
  const currentChain: IResourceChain = useSelector(currentChainSelector);

  const getVoteResultProposalInfo = async () => {
    try {
      const response = await getVoteResultLaunchpad({
        pool_address: poolDetail?.launchpad,
        network: currentChain?.chain?.toLowerCase(),
      });
      setVoteResult(response);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (poolDetail?.launchpad) {
      getVoteResultProposalInfo();
    }
  }, [poolDetail?.launchpad, needReload]);

  return (
    <Box
      bgColor={'transparent'}
      paddingX={[4, 10]}
      paddingTop={[4, 10]}
      paddingBottom={[px2rem(30), px2rem(100)]}
      border={'1px solid #353945'}
    >
      {[LAUNCHPAD_STATUS.Voting, LAUNCHPAD_STATUS.NotPassed].includes(
        poolDetail?.state,
      ) && <BuyForm poolDetail={poolDetail} />}
      <Side
        title={'For'}
        totalVote={Number(poolDetail?.voteGoal)}
        data={voteResult}
        className={cx(styles.sideWrapper, styles.sideFor)}
      />
    </Box>
  );
};

export default ProposalResult;
