/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import React, {useState} from 'react';
import s from './styles.module.scss';
import {Box, Flex, Heading, Spinner} from '@chakra-ui/react';
import FiledButton from '@/components/Swap/button/filedButton';
import {colors} from '@/theme/colors';
import {ROUTE_PATH} from '@/constants/route-path';
import {L2_ETH_ADDRESS} from '@/configs';
import {useRouter} from "next/router";
import TopPools from "@/modules/PoolsV2/TopPools";
import MyPositions from "@/modules/PoolsV2/MyPositions";

const PoolsV2Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [showTopPool, setShowTopPool] = useState(false);

  const renderContent = () => {
    if (loading) {
      return <Spinner color={colors.white} />;
    }

    if(!showTopPool) {
      return <MyPositions />;
    }
    if (showTopPool) {
      return <TopPools />;
    }

    return <></>;
  };

  return (
    <BodyContainer className={s.container}>
      <Flex className={s.container__header}>
        <Heading as={'h3'}>Pools</Heading>
        <Flex gap={2}>
          <FiledButton
            btnSize="l"
            className={s.topPoolBtn}
            onClick={() => setShowTopPool(true)}
          >
            Top Pools
          </FiledButton>
          <FiledButton
            btnSize="l"
            className={s.topPoolBtn}
            onClick={() => setShowTopPool(false)}
          >
            Your positions
          </FiledButton>
          <FiledButton
            onClick={() =>
              router.push(`${ROUTE_PATH.POOLS_V2_ADD}/${L2_ETH_ADDRESS}`)
            }
            btnSize="l"
          >
            + New Position
          </FiledButton>
        </Flex>
      </Flex>
      <Box mt={4} />
      {renderContent()}
    </BodyContainer>
  );
};

export default PoolsV2Page;
