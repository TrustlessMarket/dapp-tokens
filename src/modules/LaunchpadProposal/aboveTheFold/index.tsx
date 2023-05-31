/* eslint-disable @typescript-eslint/no-explicit-any */
import ProposalPending from '@/modules/LaunchpadProposal/aboveTheFold/upComing';
import ProposalStarting from '@/modules/LaunchpadProposal/aboveTheFold/starting';
import BodyContainer from '@/components/Swap/bodyContainer';
import Usp from '@/modules/LaunchPadDetail/usp';
import styles from '@/modules/LaunchpadProposal/aboveTheFold/styles.module.scss';
import {PROPOSAL_STATUS, useProposalStatus} from "@/modules/Launchpad/Proposal.Status";
import {IProposal} from "@/interfaces/proposal";

const AboveTheFold = ({ proposalDetail }: IProposal | any) => {
  const [status] = useProposalStatus({ row: proposalDetail });

  return (
    <BodyContainer className={styles.wrapper}>
      {[PROPOSAL_STATUS.Pending].includes(status.key) ? (
        <ProposalPending proposalDetail={proposalDetail} />
      ) : (
        <ProposalStarting proposalDetail={proposalDetail} />
      )}
      <Usp />
    </BodyContainer>
  );
};

export default AboveTheFold;
