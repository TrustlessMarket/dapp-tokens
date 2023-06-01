/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import FiledButton from '@/components/Swap/button/filedButton';
import {ROUTE_PATH} from '@/constants/route-path';
import {Box, Grid, GridItem, Heading, Spinner, Text,} from '@chakra-ui/react';
import AboveTheFold from '@/modules/ProposalDetail/aboveTheFold';
import {useAppSelector} from '@/state/hooks';
import {selectPnftExchange} from '@/state/pnftExchange';
import {colors} from '@/theme/colors';
import cx from 'classnames';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import styles from './styles.module.scss';
import {getDetailProposal} from "@/services/proposal";
import {IProposal} from "@/interfaces/proposal";
import IdoDescription from "@/modules/LaunchPadDetail/description";
import IdoFaqs from "@/modules/LaunchPadDetail/faqs";
import SectionContainer from "@/components/Swap/sectionContainer";
import Intro from "@/modules/LaunchPadDetail/aboveTheFold/intro";

const IdoDetailContainer = () => {
  const router = useRouter();
  const [proposalDetail, setProposalDetail] = useState<IProposal | any>(undefined);
  const needReload = useAppSelector(selectPnftExchange).needReload;

  console.log('proposalDetail', proposalDetail);

  const [loading, setLoading] = useState(true);

  const getPoolInfo = async () => {
    try {
      const response: any = await Promise.all([
        getDetailProposal({
          proposal_id: router?.query?.proposal_id as string,
        }),
      ]);
      setProposalDetail(response[0]);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router?.query?.proposal_id) {
      getPoolInfo();
    }
  }, [router?.query?.proposal_id, needReload]);

  if (loading) {
    return (
      <BodyContainer className={cx(styles.wrapper, styles.loadingContainer)}>
        <Spinner color={colors.white}/>
      </BodyContainer>
    );
  }

  if (!proposalDetail) {
    return (
      <BodyContainer className={cx(styles.wrapper, styles.loadingContainer)}>
        <Text style={{color: colors.white}}>Opps... This proposal not found!</Text>
        <Box mt={6}/>
        <FiledButton
          onClick={() => router.replace(ROUTE_PATH.LAUNCHPAD)}
          btnSize="h"
        >
          Back to Proposal
        </FiledButton>
      </BodyContainer>
    );
  }

  return (
    <Box className={styles.wrapper}>
      <AboveTheFold proposalDetail={proposalDetail}/>
      <SectionContainer>
        <Heading as={'h6'} color={"#FFFFFF"}>Description</Heading>
        <Grid templateColumns={['1fr']}>
          <GridItem>
            <Intro poolDetail={proposalDetail?.userPool}/>
          </GridItem>
          {/*<GridItem>
          <Card bgColor={"#2E2E2E"} paddingX={6} paddingY={6}>
            <BuyForm proposalDetail={proposalDetail}/>
          </Card>
        </GridItem>*/}
        </Grid>
        <Box mt={4}>
          <IdoDescription poolDetail={proposalDetail?.userPool}/>
        </Box>
        <Heading as={'h6'} color={"#FFFFFF"} mt={12}>Faqs</Heading>
        <IdoFaqs poolDetail={proposalDetail?.userPool}/>
      </SectionContainer>
    </Box>
  );
};

export default IdoDetailContainer;
