/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import FiledButton from '@/components/Swap/button/filedButton';
import {ROUTE_PATH} from '@/constants/route-path';
import {ILaunchpad} from '@/interfaces/launchpad';
import AboveTheFold from '@/modules/LaunchPadDetail/aboveTheFold';
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
import px2rem from "@/utils/px2rem";
import SectionContainer from "@/components/Swap/sectionContainer";

const IdoDetailContainer = () => {
  const router = useRouter();
  const [poolDetail, setPoolDetail] = useState<ILaunchpad | any>(undefined);
  const needReload = useAppSelector(selectPnftExchange).needReload;

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
        <Spinner color={colors.white}/>
      </BodyContainer>
    );
  }

  if (!poolDetail) {
    return (
      <BodyContainer className={cx(styles.wrapper, styles.loadingContainer)}>
        <Text style={{color: colors.white}}>Opps... This project not found!</Text>
        <Box mt={6}/>
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
    <Box className={styles.wrapper}>
      <AboveTheFold poolDetail={poolDetail}/>
      <SectionContainer>
        <Tabs className={cx(styles.tabContainer)}>
          <TabList mb={6} mt={6}>
            <Tab>STORY</Tab>
            <Tab>FAQS</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Text fontSize={px2rem(24)} fontWeight={"500"} color={"#FFFFFF"} mt={8}>Description</Text>
              <Box mt={8}></Box>
              <IdoDescription poolDetail={poolDetail}/>
            </TabPanel>
            <TabPanel>
              <IdoFaqs poolDetail={poolDetail}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SectionContainer>
    </Box>
  );
};

export default IdoDetailContainer;
