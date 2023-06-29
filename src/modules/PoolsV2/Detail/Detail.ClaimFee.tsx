import FiledButton from '@/components/Swap/button/filedButton';
import React, {useEffect, useState} from 'react';
import {IDetailPositionBase} from './interface';
import {closeModal, openModal} from "@/state/modal";
import styles from "./styles.module.scss";
import {Box, Flex, Text} from "@chakra-ui/react";
import HorizontalItem from "@/components/Swap/horizontalItem";
import {getTokenIconUrl} from "@/utils";
import {useWindowSize} from "@trustless-computer/dapp-core";
import {useAppDispatch, useAppSelector} from "@/state/hooks";
import s from "@/modules/PoolsV2/Remove/styles.module.scss";
import Card from "@/components/Swap/card";
import {selectPnftExchange} from "@/state/pnftExchange";
import useGetEarnedFee from "@/hooks/contract-operations/pools/v3/useGetEarnedFee";

const DetailClaimFee: React.FC<IDetailPositionBase> = ({ positionDetail }) => {
  const dispatch = useAppDispatch();
  const { mobileScreen } = useWindowSize();
  const [earnedFees, setEarnedFees] = useState([0, 0]);
  const token0Obj = positionDetail?.pair?.token0Obj;
  const token1Obj = positionDetail?.pair?.token1Obj;
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const { call: getEarnedFee } = useGetEarnedFee();

  useEffect(() => {
    if (positionDetail?.tokenId) {
      getEarnedFeeInfo();
    }
  }, [needReload, JSON.stringify(positionDetail)]);

  const getEarnedFeeInfo = async () => {
    const res = await getEarnedFee({ tokenId: positionDetail?.tokenId });
    setEarnedFees(res);
  };

  const confirmCollectFees = () => {
    const id = 'modalCollectFees';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Claim fees',
        className: styles.modalContentClaimFees,
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => {
          return (
            <Box>
              <Card
                bgColor={'rgb(19, 26, 42)'}
                p={4}
                border={'1px solid rgb(41, 50, 73)'}
                className={s.resultContainer}
              >
                <Flex direction={'column'} gap={2}>
                  <HorizontalItem
                    label={
                      <Flex
                        gap={1}
                        color={'#FFFFFF'}
                        fontSize={'md'}
                        fontWeight={'medium'}
                      >
                        <img
                          src={getTokenIconUrl(token0Obj)}
                          alt={token0Obj?.thumbnail || 'default-icon'}
                          className={'avatar'}
                        />
                        {earnedFees[0]}
                      </Flex>

                    }
                    value={
                      <Text color={'#FFFFFF'} fontSize={'md'} fontWeight={'medium'}>
                        {token0Obj?.symbol}
                      </Text>
                    }
                  />
                  <HorizontalItem
                    label={
                      <Flex
                        gap={1}
                        color={'#FFFFFF'}
                        fontSize={'md'}
                        fontWeight={'medium'}
                      >
                        <img
                          src={getTokenIconUrl(token1Obj)}
                          alt={token1Obj?.thumbnail || 'default-icon'}
                          className={'avatar'}
                        />
                        {earnedFees[1]}
                      </Flex>
                    }
                    value={
                      <Text color={'#FFFFFF'} fontSize={'md'} fontWeight={'medium'}>
                        {token1Obj?.symbol}
                      </Text>
                    }
                  />
                </Flex>
              </Card>
              <Text fontSize={'sm'} color={'rgb(152, 161, 192)'} fontStyle={"italic"} mt={2}>
                Collecting fees will withdraw currently available fees for you.
              </Text>
              <FiledButton
                loadingText="Processing"
                btnSize={'h'}
                mt={4}
                onClick={() => {

                }}
              >
                Collect
              </FiledButton>
            </Box>
          );
        },
      }),
    );
  };

  return (
    <FiledButton isDisabled={!Boolean(positionDetail)} btnSize="l" onClick={confirmCollectFees}>
      Collect Fees
    </FiledButton>
  );
};

export default DetailClaimFee;
