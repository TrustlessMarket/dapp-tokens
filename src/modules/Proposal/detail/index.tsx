/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import FiledButton from '@/components/Swap/button/filedButton';
import {ROUTE_PATH} from '@/constants/route-path';
import {Box, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text,} from '@chakra-ui/react';
import AboveTheFold from '@/modules/LaunchPadDetail/aboveTheFold';
import {useAppSelector} from '@/state/hooks';
import {selectPnftExchange} from '@/state/pnftExchange';
import {colors} from '@/theme/colors';
import cx from 'classnames';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import styles from './styles.module.scss';
import {getDetailProposal} from "@/services/proposal";
import {IProposal} from "@/interfaces/proposal";
import IdoDescription from "@/modules/LaunchPadDetail/description";
import IdoFaqs from "@/modules/LaunchPadDetail/faqs";

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
          onClick={() => router.replace(ROUTE_PATH.PROPOSAL)}
          btnSize="h"
        >
          Back to Proposal
        </FiledButton>
      </BodyContainer>
    );
  }

  return (
    <Box className={styles.wrapper}>
      <AboveTheFold poolDetail={proposalDetail}/>
      <BodyContainer>
        <Tabs className={cx(styles.tabContainer, 'max-content')}>
          <TabList mb={6} mt={6}>
            <Tab>Story</Tab>
            <Tab>Faqs</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <IdoDescription poolDetail={proposalDetail?.userPool}/>
            </TabPanel>
            <TabPanel>
              <IdoFaqs poolDetail={proposalDetail?.userPool}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </BodyContainer>
    </Box>
  );
};

export default IdoDetailContainer;
