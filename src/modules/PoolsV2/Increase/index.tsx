/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import { IPosition } from '@/interfaces/position';
import { getPositionDetail } from '@/services/swap-v3';
import { colors } from '@/theme/colors';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { getPooledAmount, onShowAddLiquidityConfirm } from '../utils';
import IncreaseForm from './Increase.Form';
import s from './styles.module.scss';
import IncreaseHeader from './Increase.Header';
import { tickToPrice } from '@/utils/number';
import {
  requestReload,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import { useDispatch } from 'react-redux';
import { logErrorToServer } from '@/services/swap';
import { useWeb3React } from '@web3-react/core';
import { toastError } from '@/constants/error';
import { showError } from '@/utils/toast';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useIncreaseLiquidityV3, {
  IIncreaseLiquidityV3,
} from '@/hooks/contract-operations/pools/v3/useIncreaseLiquidityV3';
import { useAppSelector } from '@/state/hooks';

const IncreaseLiquidity = () => {
  const router = useRouter();
  const id = router.query?.id?.[0];
  const [loading, setLoading] = useState(true);
  const [positionDetail, setPositionDetail] = useState<IPosition>();
  const [submitting, setSubmitting] = useState(false);
  const { account } = useWeb3React();
  const refForm = useRef<any>();

  const { run: increaseLiquidityV3 } = useContractOperation({
    operation: useIncreaseLiquidityV3,
  });

  const needReload = useAppSelector(selectPnftExchange).needReload;

  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      getUserPositionDetail(id);
    }
  }, [id, needReload]);

  const getUserPositionDetail = async (id: any) => {
    try {
      const res = await getPositionDetail(id);
      setPositionDetail(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          id: transactionType.createPool,
          status: TransactionStatus.info,
        }),
      );
      const params: IIncreaseLiquidityV3 = {
        tokenId: Number(positionDetail?.id),
        amount0Desired: values?.newBaseAmount || '0',
        amount1Desired: values?.newQuoteAmount || '0',
        amount0Min: '0',
        amount1Min: '0',
      };

      const response: any = await increaseLiquidityV3(params);
      dispatch(
        updateCurrentTransaction({
          id: transactionType.createPool,
          status: TransactionStatus.success,
          hash: response.hash,
          infoTexts: {
            success: `Liquidity has been added successfully.`,
          },
        }),
      );
      dispatch(requestReload());
      refForm.current?.reset();
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
        onSubmit={(e) =>
          onShowAddLiquidityConfirm(
            {
              ...e,

              baseAmount: e.newBaseAmount,
              quoteAmount: e.newQuoteAmount,
            },
            onSubmit,
          )
        }
        initialValues={{
          baseToken: positionDetail?.pair?.token0Obj,
          quoteToken: positionDetail?.pair?.token1Obj,
          tickUpper: positionDetail.tickUpper,
          tickLower: positionDetail.tickLower,
          currentTick: positionDetail.pair?.tick,
          baseAmount: getPooledAmount(positionDetail)[0],
          quoteAmount: getPooledAmount(positionDetail)[1],
          fee: positionDetail?.fee,
          reFee: positionDetail?.fee,
          currentSelectPair: positionDetail?.pair?.token0Obj,
          minPrice: tickToPrice(positionDetail.tickLower),
          maxPrice: tickToPrice(positionDetail.tickUpper),
          currentPrice: positionDetail.pair?.price,
        }}
      >
        {({ handleSubmit }) => (
          <IncreaseForm
            handleSubmit={handleSubmit}
            positionDetail={positionDetail}
            submitting={submitting}
            ref={refForm}
          />
        )}
      </Form>
    );
  };

  return (
    <BodyContainer className={s.container}>
      <IncreaseHeader />
      <Box mt={4} />
      <Box className={s.container__body}>{renderContent()}</Box>
    </BodyContainer>
  );
};

export default IncreaseLiquidity;
