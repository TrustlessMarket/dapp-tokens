/* eslint-disable @typescript-eslint/no-explicit-any */
import ProposalStarting from '@/modules/ProposalDetail/aboveTheFold/starting';
import styles from '@/modules/ProposalDetail/aboveTheFold/styles.module.scss';
import {IProposal} from "@/interfaces/proposal";
import Card from "@/components/Swap/card";
import React from "react";
import ProposalInfo from "@/modules/ProposalDetail/info";
import ProposalResult from "@/modules/ProposalDetail/result";
import {Box} from "@chakra-ui/react";
import SectionContainer from "@/components/Swap/sectionContainer";

const AboveTheFold = ({ proposalDetail }: IProposal | any) => {
  // const [status] = useProposalStatus({ row: proposalDetail });
  // const poolDetail = proposalDetail?.userPool;
  return (
    <SectionContainer className={styles.wrapper}>
      {/*{[PROPOSAL_STATUS.Pending].includes(status.key) ? (
        <ProposalPending proposalDetail={proposalDetail} />
      ) : (
        <ProposalStarting proposalDetail={proposalDetail} />
      )}*/}
      <ProposalStarting proposalDetail={proposalDetail} />
      <Box mt={6}>
        <ProposalResult />
      </Box>
      <Card bgColor={"#1E1E22"} paddingX={6} paddingY={6} mt={6}>
        <ProposalInfo proposalDetail={proposalDetail}/>
      </Card>
    </SectionContainer>
  );
};

export default AboveTheFold;
