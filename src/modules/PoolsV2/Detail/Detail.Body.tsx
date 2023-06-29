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
import PoolsV2PositionStatus from '../PoolsV2.PositionStatus';
import { SwitchSymbol } from '../Add/Add.Header.SwitchPair';
import { useForm, useFormState } from 'react-final-form';
import { IToken } from '@/interfaces/token';

interface IDetailBody extends IDetailPositionBase {
  handleSubmit: (_: any) => void;
}

const DetailBody: React.FC<IDetailBody> = ({ positionDetail }) => {
  const [fees, setFees] = useState([0, 0]);

  const { change } = useForm();
  const { values } = useFormState();

  const { call: getEarnedFee } = useGetEarnedFeeV3();

  const currentSelectPair: IToken = values?.currentSelectPair;

  useEffect(() => {
    getEarnedFeeInfo();
  }, [positionDetail]);

  const getEarnedFeeInfo = async () => {
    const res = await getEarnedFee({ tokenId: positionDetail?.tokenId });
    setFees(res);
  };

  const onSelectPair = (_tokenA?: IToken, _tokenB?: IToken) => {
    change('currentSelectPair', _tokenA);
  };

  return (
    <Grid className={s.container__body__gridContainer}>
      <GridItem area={'g-img'}>
        <DetailImage positionDetail={positionDetail} />
      </GridItem>
      <GridItem area={'g-info'}>
        <Flex className={s.container__body__gridContainer__item}>
          <Box>
            <Text className={s.container__body__gridContainer__title}>
              Liquidity
            </Text>
            <Box mt={6} />
            <DetailPair
              amountValues={getPooledAmount(positionDetail)}
              tickRange={getRangeTick(positionDetail)}
            />
          </Box>
          <Box>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Text className={s.container__body__gridContainer__title}>
                Unclaimed fees
              </Text>
              <DetailClaimFee positionDetail={positionDetail} />
            </Flex>
            <Box mt={6} />
            <DetailPair amountValues={fees} />
          </Box>
        </Flex>
      </GridItem>
      <GridItem
        className={s.container__body__gridContainer__itemRangePrice}
        area={'g-range'}
      >
        <Flex gap={2} alignItems={'center'} justifyContent={'space-between'}>
          <Flex gap={2} alignItems={'center'}>
            <Text className={s.container__body__gridContainer__title}>
              Range Price
            </Text>
            <PoolsV2PositionStatus positionDetail={positionDetail} />
          </Flex>
          <SwitchSymbol
            tokenA={positionDetail?.pair?.token0Obj}
            tokenB={positionDetail?.pair?.token1Obj}
            currentSelectPair={currentSelectPair}
            onSelectPair={onSelectPair}
          />
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default DetailBody;
