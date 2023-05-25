/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './styles.module.scss';
import IdoFaqs from './faqs';
import IdoDescription from '@/modules/LaunchPadDetail/description';
import {
  Box,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import AboveTheFold from '@/modules/LaunchPadDetail/aboveTheFold';
import { getDetailLaunchpad } from '@/services/launchpad';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BodyContainer from '@/components/Swap/bodyContainer';
import cx from 'classnames';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { ILaunchpad } from '@/interfaces/launchpad';
import { colors } from '@/theme/colors';
import cs from 'classnames';
import FiledButton from '@/components/Swap/button/filedButton';
import { ROUTE_PATH } from '@/constants/route-path';

const IdoDetailContainer = () => {
  const router = useRouter();
  const [poolDetail, setPoolDetail] = useState<ILaunchpad | any>(undefined);
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const [loading, setLoading] = useState(true);

  const getPoolInfo = async () => {
    try {
      const response: any = await getDetailLaunchpad({
        pool_address: router?.query?.pool_address as string,
      });
      setPoolDetail(response);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router?.query?.pool_address) {
      getPoolInfo();
    }
  }, [router?.query?.pool_address, needReload]);

  if (loading) {
    return (
      <BodyContainer className={cs(styles.wrapper, styles.loadingContainer)}>
        <Spinner color={colors.white} />
      </BodyContainer>
    );
  }

  if (!poolDetail) {
    return (
      <BodyContainer className={cs(styles.wrapper, styles.loadingContainer)}>
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
    <Box className={styles.wrapper}>
      <AboveTheFold poolDetail={poolDetail} />
      <BodyContainer>
        <Tabs className={cx(styles.tabContainer, 'max-content')}>
          <TabList mb={6} mt={6}>
            <Tab>Story</Tab>
            <Tab>Faqs</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <IdoDescription poolDetail={poolDetail} />
            </TabPanel>
            <TabPanel>
              <IdoFaqs poolDetail={poolDetail} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </BodyContainer>
    </Box>
  );
};

export default IdoDetailContainer;
