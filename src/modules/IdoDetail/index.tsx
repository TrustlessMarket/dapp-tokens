/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './styles.module.scss';
import IdoFaqs from "./faqs";
import IdoDescription from "@/modules/IdoDetail/description";
import {Box} from "@chakra-ui/react";
import AboveTheFold from "@/modules/IdoDetail/aboveTheFold";
import {getDetailLaunchpad} from "@/services/launchpad";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

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
    <Box className={styles.wrapper}>
      <AboveTheFold poolDetail={poolDetail}/>
      <IdoDescription poolDetail={poolDetail}/>
      <IdoFaqs poolDetail={poolDetail}/>
    </Box>
  )
};

export default IdoDetailContainer;