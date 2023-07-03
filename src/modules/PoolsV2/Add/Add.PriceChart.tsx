/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {useEffect, useState} from "react";
import {Box} from "@chakra-ui/react";
import useGetPoolLiquidity from "@/hooks/contract-operations/pools/v3/useGetPoolLiquidity";

interface IAddPriceChart {
 //
};

const AddPriceChart: React.FC<IAddPriceChart> = () => {
  const { call: getPoolLiquidity } = useGetPoolLiquidity();
  const [ticksProcessed, setTicksProcessed] = useState([]);

  useEffect(() => {
    getLiquidityData();
  }, []);

  const getLiquidityData = async () => {
    const res = await getPoolLiquidity({poolAddress: '0x17a552efe197d467a59db12f29cbff64ded46c56'});
    setTicksProcessed(res);
  }

  // console.log('ticksProcessed', ticksProcessed);
  // console.log(ticksProcessed[0])
  // console.log(ticksProcessed[299])
  // console.log(ticksProcessed[300])
  // console.log(ticksProcessed[301])
  // console.log(ticksProcessed[600])
  // console.log('=====');

  return (
    <Box>

    </Box>
  )
};

export default AddPriceChart;