/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import FiledButton from '@/components/Swap/button/filedButton';
import {ROUTE_PATH} from '@/constants/route-path';
import {ILaunchpad} from '@/interfaces/launchpad';
import AboveTheFoldLaunchpad from '@/modules/LaunchPadDetail/aboveTheFold';
import AboveTheFoldVoting from '@/modules/ProposalDetail/aboveTheFold';
import IdoDescription from '@/modules/LaunchPadDetail/description';
import {getDetailLaunchpad} from '@/services/launchpad';
import {useAppSelector} from '@/state/hooks';
import {selectPnftExchange} from '@/state/pnftExchange';
import {colors} from '@/theme/colors';
import {Box, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text,} from '@chakra-ui/react';
import cx from 'classnames';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import IdoFaqs from './faqs';
import styles from './styles.module.scss';
import px2rem from '@/utils/px2rem';
import {LAUNCHPAD_STATUS, useLaunchPadStatus,} from '@/modules/Launchpad/Launchpad.Status';
import Intro from '@/modules/LaunchPadDetail/intro';
import SectionContainer from '@/components/Swap/sectionContainer';

const IdoDetailContainer = () => {
  const router = useRouter();
  const [poolDetail, setPoolDetail] = useState<ILaunchpad | any>(undefined);
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const [status] = useLaunchPadStatus({ row: poolDetail });

  const [loading, setLoading] = useState(true);

  const getPoolInfo = async () => {
    try {
      const response: any = await Promise.all([
        getDetailLaunchpad({
          id: router?.query?.id as string,
        }),
      ]);
      setPoolDetail(response[0]);
    } catch (err) {
      console.log('err', err);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router?.query?.id) {
      getPoolInfo();
    }
  }, [router?.query?.id, needReload]);

  if (loading) {
    return (
      <BodyContainer className={cx(styles.wrapper, styles.loadingContainer)}>
        <Spinner color={colors.white} />
      </BodyContainer>
    );
  }

  if (!poolDetail) {
    return (
      <BodyContainer className={cx(styles.wrapper, styles.loadingContainer)}>
        <Text style={{ color: colors.white }}>Opps... This project not found!</Text>
        <Box mt={6} />
        <FiledButton
          onClick={() => router.replace(ROUTE_PATH.LAUNCHPAD)}
          btnSize="h"
        >
          Back to Launchpad
        </FiledButton>
      </BodyContainer>
    );
  }

  return (
    <BodyContainer className={styles.wrapper}>
      {[LAUNCHPAD_STATUS.Voting, LAUNCHPAD_STATUS.NotPassed, LAUNCHPAD_STATUS.PrepareLaunching].includes(
        status?.key,
      ) ? (
        <AboveTheFoldVoting poolDetail={poolDetail} />
      ) : (
        <AboveTheFoldLaunchpad poolDetail={poolDetail} />
      )}
      <SectionContainer>
        <Tabs className={cx(styles.tabContainer)} mt={16}>
          <TabList mb={8} mt={8}>
            <Tab>STORY</Tab>
            <Tab>FAQS</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {[LAUNCHPAD_STATUS.Voting].includes(status?.key) && (
                <Box h={'738px'}>
                  <Intro poolDetail={poolDetail} />
                </Box>
              )}
              <Text
                fontSize={px2rem(24)}
                fontWeight={'500'}
                color={'#FFFFFF'}
                mt={8}
              >
                Description
              </Text>
              <Box mt={8}></Box>
              <IdoDescription poolDetail={poolDetail} />
            </TabPanel>
            <TabPanel>
              <IdoFaqs poolDetail={poolDetail} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SectionContainer>
    </BodyContainer>
  );
};

export default IdoDetailContainer;
