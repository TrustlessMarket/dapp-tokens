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
import {requestReload, selectPnftExchange, updateCurrentTransaction} from "@/state/pnftExchange";
import useGetEarnedFee from "@/hooks/contract-operations/pools/v3/useGetEarnedFee";
import useCollectFeeV3, {ICollectFeeV3} from "@/hooks/contract-operations/pools/v3/useCollectFee";
import {transactionType} from "@/components/Swap/alertInfoProcessing/types";
import {TransactionStatus} from "@/components/Swap/alertInfoProcessing/interface";
import {logErrorToServer} from "@/services/swap";
import {toastError} from "@/constants/error";
import {showError} from "@/utils/toast";
import {useWeb3React} from "@web3-react/core";

const DetailClaimFee: React.FC<IDetailPositionBase> = ({ positionDetail }) => {
  const dispatch = useAppDispatch();
  const { mobileScreen } = useWindowSize();
  const [earnedFees, setEarnedFees] = useState([0, 0]);
  const token0Obj = positionDetail?.pair?.token0Obj;
  const token1Obj = positionDetail?.pair?.token1Obj;
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const { call: getEarnedFee } = useGetEarnedFee();
  const { call: collectFeeV3 } = useCollectFeeV3();
  const { account } = useWeb3React();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (positionDetail?.tokenId) {
      getEarnedFeeInfo();
    }
  }, [needReload, JSON.stringify(positionDetail)]);

  const getEarnedFeeInfo = async () => {
    const res = await getEarnedFee({ tokenId: positionDetail?.tokenId });
    setEarnedFees(res);
  };

  const handleCollectFee = async () => {
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          id: transactionType.collectFee,
          status: TransactionStatus.info,
        }),
      );

      const params: ICollectFeeV3 = {
        tokenId: positionDetail?.tokenId,
      };

      const response: any = await collectFeeV3(params);
      dispatch(
        updateCurrentTransaction({
          id: transactionType.collectFee,
          status: TransactionStatus.success,
          hash: response.hash,
          infoTexts: {
            success: `Collect fee successfully.`
          },
        }),
      );
      dispatch(requestReload());
    } catch (err) {
      dispatch(updateCurrentTransaction(null));
      const message =
        (err as Error).message || 'Something went wrong. Please try again later.';
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: message,
      });
      toastError(showError, err, { address: account });
    } finally {
      setSubmitting(false);
    }
  }

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
              <Text fontSize={'sm'} color={'rgb(152, 161, 192)'} fontStyle={"italic"} mt={2} mb={"8px !important"}>
                Collecting fees will withdraw currently available fees for you.
              </Text>
              <FiledButton
                loadingText="Processing"
                btnSize={'h'}
                containerConfig={{ flex: 1, mt: 4 }}
                processInfo={{
                  id: transactionType.collectFee,
                }}
                onClick={handleCollectFee}
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
