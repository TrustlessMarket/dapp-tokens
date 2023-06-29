/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import DetailImage from './Detail.Image';
import { IDetailPositionBase } from './interface';
import s from './styles.module.scss';
import DetailPair from './Detail.Pair';
import { getPooledAmount, getRangeTick } from '../utils';
import DetailClaimFee from './Detail.ClaimFee';
import useGetEarnedFeeV3 from '@/hooks/contract-operations/pools/v3/useGetEarnedFee';

interface IDetailBody extends IDetailPositionBase {
  handleSubmit: (_: any) => void;
}

const DetailBody: React.FC<IDetailBody> = ({ positionDetail }) => {
  const [fees, setFees] = useState([0, 0]);

  const { call: getEarnedFee } = useGetEarnedFeeV3();

  useEffect(() => {
    getEarnedFeeInfo();
  }, [positionDetail]);

  const getEarnedFeeInfo = async () => {
    const res = await getEarnedFee({ tokenId: positionDetail?.tokenId });
    setFees(res);
  };

  return (
    <Grid className={s.container__body__gridContainer}>
      <GridItem area={'g-img'}>
        <DetailImage positionDetail={positionDetail} />
      </GridItem>
      <GridItem area={'g-info'}>
        <Text className={s.container__body__gridContainer__title}>Liquidity</Text>
        <Box mt={4} />
        <DetailPair
          amountValues={getPooledAmount(positionDetail)}
          tickRange={getRangeTick(positionDetail)}
        />
        <Box mt={12} />
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Text className={s.container__body__gridContainer__title}>
            Unclaimed fees
          </Text>
          <DetailClaimFee positionDetail={positionDetail} />
        </Flex>
        <Box mt={4} />
        <DetailPair amountValues={fees} />
      </GridItem>
      <GridItem area={'g-range'}></GridItem>
    </Grid>
  );
};

export default DetailBody;
