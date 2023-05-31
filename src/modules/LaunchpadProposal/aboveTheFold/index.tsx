/* eslint-disable @typescript-eslint/no-explicit-any */
import ProposalStarting from '@/modules/LaunchpadProposal/aboveTheFold/starting';
import BodyContainer from '@/components/Swap/bodyContainer';
import styles from '@/modules/LaunchpadProposal/aboveTheFold/styles.module.scss';
import {useProposalStatus} from "@/modules/Launchpad/Proposal.Status";
import {IProposal} from "@/interfaces/proposal";
import {GridItem, SimpleGrid, Stat, StatLabel, StatNumber} from "@chakra-ui/react";
import {formatCurrency} from "@/utils";
import Card from "@/components/Swap/card";
import React from "react";

const AboveTheFold = ({ proposalDetail }: IProposal | any) => {
  const [status] = useProposalStatus({ row: proposalDetail });
  const poolDetail = proposalDetail?.userPool;
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
        <SimpleGrid columns={2} spacingX={6}>
          <GridItem>
            <Stat>
              <StatLabel>Rewards</StatLabel>
              <StatNumber>{formatCurrency(poolDetail?.launchpadBalance)} {poolDetail?.launchpadToken?.symbol}</StatNumber>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Funding Goal</StatLabel>
              <StatNumber>
                {formatCurrency(poolDetail?.goalBalance || 0)} {poolDetail?.liquidityToken?.symbol}
              </StatNumber>
            </Stat>
          </GridItem>
          {/*<GridItem>
            <Stat>
              <StatLabel>Starts in</StatLabel>
              <StatNumber>
                <Text>{Number(days) > 0 && `${days}d :`} {hours}h : {minutes}m : {seconds}s</Text>
              </StatNumber>
            </Stat>
          </GridItem>*/}
        </SimpleGrid>
      </Card>
    </BodyContainer>
  );
};

export default AboveTheFold;
