/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useMemo} from "react";
import styles from "./styles.module.scss";
import Faq from "@/components/Swap/faq";
import {Box} from "@chakra-ui/react";

const IdoFaqs = ({poolDetail}: any) => {
  const data = useMemo(() => {
    if (poolDetail?.qandA) {
      const res = JSON.parse(poolDetail?.qandA);
      return res?.map((r: any) => ({
        q: r?.value,
        a: r?.label,
      }))
    }

    return [];
  }, [poolDetail?.qandA]);

  return (
    <Box className={styles.container}>
      <Faq data={data}/>
    </Box>
  )
};

export default IdoFaqs;
