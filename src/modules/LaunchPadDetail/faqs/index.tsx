/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useMemo} from "react";
import styles from "./styles.module.scss";
import Faq from "@/components/Swap/faq";
import {Box} from "@chakra-ui/react";

const IdoFaqs = ({poolDetail}: any) => {
  const data = useMemo(() => {
    if (poolDetail?.qandA) {
      const res = JSON.parse(poolDetail?.qandA);
      return res?.map(r => ({
        q: r?.value,
        a: r?.label,
      }))
      console.log('res', res);
    }

    return [];
  }, [poolDetail?.qandA]);

  console.log('data', data);
  return (
    <Box bgColor="transparent" className={styles.container}>
      <Faq data={data}/>
    </Box>
  )
};

export default IdoFaqs;
