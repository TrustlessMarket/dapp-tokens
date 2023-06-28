/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import React, { useEffect, useState } from 'react';
import s from './styles.module.scss';
import { Box, Flex, Heading, Spinner } from '@chakra-ui/react';
import FiledButton from '@/components/Swap/button/filedButton';
import { colors } from '@/theme/colors';
import { ROUTE_PATH } from '@/constants/route-path';
import { useRouter } from 'next/router';
import { getPositionDetail } from '@/services/swap-v3';
import { IPosition } from '@/interfaces/position';

interface IPoolsV2DetailPage {
  ids: any;
}

const PoolsV2RemovePage: React.FC<IPoolsV2DetailPage> = ({ ids }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [positionDetail, setPositionDetail] = useState<IPosition>();

  useEffect(() => {
    if (ids?.length > 0) {
      const positionId = ids[0];
      getUserPositionDetail(positionId);
    }
  }, [JSON.stringify(ids)]);

  const getUserPositionDetail = async (id: any) => {
    const res = await getPositionDetail(id);
    setPositionDetail(res);
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner color={colors.white} />;
    }

    // if (liquidityList.length === 0) {
    //   return (
    //     <>
    //       <Empty
    //         size={70}
    //         infoText="Your active V2 liquidity positions will appear here."
    //       />
    //     </>
    //   );
    // }

    return <></>;
  };

  return (
    <BodyContainer className={s.container}>
      <Flex className={s.container__header}>
        <Heading as={'h3'}>Back to Pools</Heading>
      </Flex>
      <Box mt={4} />
      {renderContent()}
      {/*<Flex
        className={cs(s.container__body, liquidityList.length === 0 && s.container__empty)}
      >
        {renderContent()}
      </Flex>*/}
    </BodyContainer>
  );
};

export default PoolsV2RemovePage;
