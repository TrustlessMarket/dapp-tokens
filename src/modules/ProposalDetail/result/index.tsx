/* eslint-disable @typescript-eslint/no-explicit-any */

import {getVoteResultProposal} from "@/services/proposal";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAppSelector} from "@/state/hooks";
import {selectPnftExchange} from "@/state/pnftExchange";
import SectionContainer from "@/components/Swap/sectionContainer";

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
      ProposalResult
    </SectionContainer>
  );
}

export default ProposalResult;