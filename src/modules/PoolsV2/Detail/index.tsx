/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import { IPosition } from '@/interfaces/position';
import { getPositionDetail } from '@/services/swap-v3';
import { colors } from '@/theme/colors';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import cs from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import DetailBody from './Detail.Body';
import DetailHeader from './Detail.Header';
import s from './styles.module.scss';
import { tickToPrice } from '@/utils/number';
import { compareString, sortAddressPair } from '@/utils';
import BigNumber from 'bignumber.js';

interface IPoolsV2DetailPage {
  //
}

const PoolsV2DetailPage: React.FC<IPoolsV2DetailPage> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [positionDetail, setPositionDetail] = useState<IPosition>();

  const id = router.query?.id;

  useEffect(() => {
    if (id) {
      getUserPositionDetail(id);
    }
  }, [id]);

  const getUserPositionDetail = async (id: any) => {
    try {
      const res = await getPositionDetail(id);
      setPositionDetail(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Flex className={s.container__empty}>
          <Spinner color={colors.white} />
        </Flex>
      );
    }

    if (!positionDetail) {
      return null;
    }

    return (
      <Form
        onSubmit={() => {}}
        initialValues={{
          tokenA: positionDetail.pair?.token0Obj,
          tokenB: positionDetail.pair?.token1Obj,
          currentSelectPair: positionDetail.pair?.token0Obj,
          minPrice: tickToPrice(positionDetail?.tickLower),
          maxPrice: tickToPrice(positionDetail?.tickUpper),
          currentPrice: tickToPrice(positionDetail?.pair?.tick),
          defaultTickLower: positionDetail?.tickLower,
          tickLower: positionDetail?.tickLower,
          defaultTickUpper: positionDetail?.tickLower,
          tickUpper: positionDetail?.tickUpper,
        }}
      >
        {({ handleSubmit }) => (
          <DetailBody handleSubmit={handleSubmit} positionDetail={positionDetail} />
        )}
      </Form>
    );
  };

  return (
    <BodyContainer className={s.container}>
      <DetailHeader positionDetail={positionDetail} />
      <Box mt={4} />
      <Box className={cs(s.container__body)}>{renderContent()}</Box>
    </BodyContainer>
  );
};

export default PoolsV2DetailPage;
