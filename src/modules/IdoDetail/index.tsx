/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './styles.module.scss';
import IdoFaqs from "./faqs";
import IdoDescription from "@/modules/IdoDetail/description";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import AboveTheFold from "@/modules/IdoDetail/aboveTheFold";
import {getDetailLaunchpad} from "@/services/launchpad";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import BodyContainer from "@/components/Swap/bodyContainer";
import cx from 'classnames';

const IdoDetailContainer = () => {
  const router = useRouter();
  const [poolDetail, setPoolDetail] = useState<any>();

  console.log('poolDetail', poolDetail);

  const getPoolInfo = async () => {
    try {
      const response = await getDetailLaunchpad({pool_address: router?.query?.pool_address as string});
      setPoolDetail(response);
    } catch (err) {
      throw err;
    }
  }

  useEffect(() => {
    if(router?.query?.pool_address) {
      getPoolInfo();
    }
  }, [router?.query?.pool_address]);

  return (
    <BodyContainer className={styles.wrapper}>
      <AboveTheFold poolDetail={poolDetail}/>
      <Tabs className={cx(styles.tabContainer, "max-content")}>
        <TabList mb={6} mt={6}>
          <Tab>Story</Tab>
          <Tab>Faqs</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <IdoDescription poolDetail={poolDetail}/>
          </TabPanel>
          <TabPanel>
            <IdoFaqs poolDetail={poolDetail}/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </BodyContainer>
  )
};

export default IdoDetailContainer;