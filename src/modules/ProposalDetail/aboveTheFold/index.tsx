/* eslint-disable @typescript-eslint/no-explicit-any */
import ProposalStarting from '@/modules/ProposalDetail/aboveTheFold/starting';
import BodyContainer from '@/components/Swap/bodyContainer';
import styles from '@/modules/ProposalDetail/aboveTheFold/styles.module.scss';
import {IProposal} from "@/interfaces/proposal";
import Card from "@/components/Swap/card";
import React from "react";
import ProposalInfo from "@/modules/ProposalDetail/info";

const AboveTheFold = ({ proposalDetail }: IProposal | any) => {
  // const [status] = useProposalStatus({ row: proposalDetail });
  // const poolDetail = proposalDetail?.userPool;
  console.log('proposalDetail', proposalDetail);

  return (
    <BodyContainer className={styles.wrapper}>
      {/*{[PROPOSAL_STATUS.Pending].includes(status.key) ? (
        <ProposalPending proposalDetail={proposalDetail} />
      ) : (
        <ProposalStarting proposalDetail={proposalDetail} />
      )}*/}
      <ProposalStarting proposalDetail={proposalDetail} />
      <Card bgColor={"#1E1E22"} paddingX={6} paddingY={6} mt={6}>
        <ProposalInfo proposalDetail={proposalDetail}/>
      </Card>
    </BodyContainer>
  );
};

export default AboveTheFold;
