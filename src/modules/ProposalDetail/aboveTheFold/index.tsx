/* eslint-disable @typescript-eslint/no-explicit-any */
import ProposalStarting from '@/modules/ProposalDetail/aboveTheFold/starting';
import styles from '@/modules/ProposalDetail/aboveTheFold/styles.module.scss';
import Card from '@/components/Swap/card';
import React from 'react';
import ProposalInfo from '@/modules/ProposalDetail/info';
import ProposalResult from '@/modules/ProposalDetail/result';
import { Box } from '@chakra-ui/react';
import SectionContainer from '@/components/Swap/sectionContainer';
import { ILaunchpad } from '@/interfaces/launchpad';

const AboveTheFold = ({ poolDetail }: ILaunchpad | any) => {
  return (
    <>
      <Box className={styles.wrapper}>
        <ProposalStarting poolDetail={poolDetail} />
      </Box>
      <SectionContainer className={styles.wrapper}>
        <Box mt={6}>
          <ProposalResult poolDetail={poolDetail} />
        </Box>
        <Card bgColor={'#1E1E22'} paddingX={6} paddingY={6} mt={6}>
          <ProposalInfo poolDetail={poolDetail} />
        </Card>
      </SectionContainer>
    </>
  );
};

export default AboveTheFold;
