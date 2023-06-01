/* eslint-disable @typescript-eslint/no-explicit-any */

import {getVoteResultProposal} from "@/services/proposal";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAppSelector} from "@/state/hooks";
import {selectPnftExchange} from "@/state/pnftExchange";
import SectionContainer from "@/components/Swap/sectionContainer";
import Side from "@/modules/ProposalDetail/result/side";
import {Card, GridItem, SimpleGrid} from "@chakra-ui/react";
import styles from './styles.module.scss';
import cx from 'classnames';

const ProposalResult = () => {
  const router = useRouter();
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const [voteResult, setVoteResult] = useState<any>();

  console.log('voteResult', voteResult);

  const getVoteResultProposalInfo = async () => {
    try {
      const response = await getVoteResultProposal({
        proposal_id: router?.query?.proposal_id,
      });
      setVoteResult(response);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (router?.query?.proposal_id) {
      getVoteResultProposalInfo();
    }
  }, [
    router?.query?.proposal_id,
    needReload,
  ]);

  return (
    <SectionContainer>
      <SimpleGrid columns={2} gap={6}>
        <GridItem>
          <Card bgColor={"#1B1E26"} paddingX={6} paddingY={6}>
            <Side
              title={"For"}
              totalVote={voteResult?.forVote?.totalVoter + voteResult?.againstVote?.totalVoter}
              data={voteResult?.forVote}
              className={cx(styles.sideWrapper, styles.sideFor)}
            />
          </Card>
        </GridItem>
        <GridItem>
          <Card bgColor={"#1B1E26"} paddingX={6} paddingY={6}>
            <Side
              title={"Against"}
              totalVote={voteResult?.forVote?.totalVoter + voteResult?.againstVote?.totalVoter}
              data={voteResult?.againstVote}
              className={cx(styles.sideWrapper, styles.sideAgainst)}
            />
          </Card>
        </GridItem>
      </SimpleGrid>
    </SectionContainer>
  );
}

export default ProposalResult;