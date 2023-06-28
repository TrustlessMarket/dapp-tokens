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

const PoolsV2Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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
        <Heading as={'h3'}>Pools</Heading>
        <Flex>
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
      {/*<Flex
        className={cs(s.container__body, liquidityList.length === 0 && s.container__empty)}
      >
        {renderContent()}
      </Flex>*/}
    </BodyContainer>
  );
};

export default PoolsV2Page;
