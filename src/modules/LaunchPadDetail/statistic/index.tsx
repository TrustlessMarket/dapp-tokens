/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './styles.module.scss';
import { Box, Flex, Text } from '@chakra-ui/react';
import Card from '@/components/Swap/card';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { openModal } from '@/state/modal';
import { useWindowSize } from '@trustless-computer/dapp-core';
import AllowlistTable from '@/modules/LaunchPadDetail/statistic/AllowlistTable';

const Statistic = ({ poolDetail }: any) => {
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const dispatch = useDispatch();
  const { mobileScreen } = useWindowSize();

  const handleShowDepositList = () => {
    const id = 'modalContributionList';
    // const close = () => dispatch(closeModal({id}));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Contribution List',
        className: styles.modalContent,
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <Flex>
            <AllowlistTable poolDetail={poolDetail} />
          </Flex>
        ),
      }),
    );
  };

  return (
    <Box className={styles.wrapper}>
      <Card bgColor={'transparent'}>
        {!isAuthenticated && (
          <Text color={'#1b77fd'} mb={'8px !important'} textAlign={'center'}>
            Connect wallet to see your boost rate
          </Text>
        )}
        <AllowlistTable
          poolDetail={poolDetail}
          isFull={false}
          handleViewMore={handleShowDepositList}
        />
      </Card>
    </Box>
  );
};

export default Statistic;
