/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import FiledButton from '@/components/Swap/button/filedButton';
import { ROUTE_PATH } from '@/constants/route-path';
import { IPosition } from '@/interfaces/position';
import { getPositionDetail } from '@/services/swap-v3';
import { colors } from '@/theme/colors';
import { Box, Flex, Heading, Spinner } from '@chakra-ui/react';
import cs from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import s from './styles.module.scss';

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

    return <></>;
  };

  return (
    <BodyContainer className={s.container}>
      <Flex className={s.container__header}>
        <Flex>
          <Heading as={'h3'}>Back to Pools</Heading>
        </Flex>
        <Flex gap={2}>
          <FiledButton
            btnSize="l"
            className={s.increaseLiquidityBtn}
            onClick={() =>
              router.push(`${ROUTE_PATH.POOLS_V2_ADD}/${positionDetail?.id}`)
            }
          >
            Increase Liquidity
          </FiledButton>
          <FiledButton
            onClick={() =>
              router.push(`${ROUTE_PATH.POOLS_V2_REMOVE}/${positionDetail?.id}`)
            }
            btnSize="l"
          >
            Remove Liquidity
          </FiledButton>
        </Flex>
      </Flex>
      <Box mt={4} />
      <Flex className={cs(s.container__body)}>{renderContent()}</Flex>
    </BodyContainer>
  );
};

export default PoolsV2DetailPage;
