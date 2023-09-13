/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import BodyContainer from '@/components/Swap/bodyContainer';
import { toastError } from '@/constants/error';
import useIncreaseLiquidityV3, {
  IIncreaseLiquidityV3,
} from '@/hooks/contract-operations/pools/v3/useIncreaseLiquidityV3';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { IPosition } from '@/interfaces/position';
import { IToken } from '@/interfaces/token';
import { logErrorToServer } from '@/services/swap';
import { getPositionDetail } from '@/services/swap-v3';
import { useAppSelector } from '@/state/hooks';
import {
  requestReload,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import { tickToPrice } from '@/utils/number';
import { showError } from '@/utils/toast';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { getPooledAmount, onShowAddLiquidityConfirm } from '../utils';
import IncreaseForm from './Increase.Form';
import s from './styles.module.scss';
import {changeWallet, choiceConFig, Environment, refreshProvider, WalletType} from "trustless-swap-sdk";
import {isProduction} from "@/utils/commons";

const IncreaseLiquidity = () => {
  const router = useRouter();
  const id = router.query?.id?.[0];
  const [loading, setLoading] = useState(true);
  const [positionDetail, setPositionDetail] = useState<IPosition>();
  const [submitting, setSubmitting] = useState(false);
  const { account } = useWeb3React();
  const refForm = useRef<any>();
  const { provider } = useWeb3React();
  const slippage = useAppSelector(selectPnftExchange).slippageNOS;

  const { run: increaseLiquidityV3 } = useContractOperation({
    operation: useIncreaseLiquidityV3,
  });

  const needReload = useAppSelector(selectPnftExchange).needReload;

  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      getUserPositionDetail(id);
      changeWallet(WalletType.EXTENSION,"","")
      choiceConFig(isProduction() ? Environment.MAINNET : Environment.TESTNET);
      refreshProvider(provider);
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
          id: transactionType.increaseLiquidity,
          status: TransactionStatus.info,
        }),
      );

      const baseAmount = values?.newBaseAmount || '0';
      const quoteAmount = values?.newQuoteAmount || '0';

      const baseToken: IToken = values?.baseToken;
      const quoteToken: IToken = values?.quoteToken;

      const amount0Min = new BigNumber(baseAmount)
        .multipliedBy(100 - Number(slippage))
        .dividedBy(100)
        .decimalPlaces(baseToken.decimal as any)
        .toString();

      const amount1Min = new BigNumber(quoteAmount)
        .multipliedBy(100 - Number(slippage))
        .dividedBy(100)
        .decimalPlaces(quoteToken?.decimal as any)
        .toString();

      const params: IIncreaseLiquidityV3 = {
        tokenId: Number(positionDetail?.tokenId),
        amount0Desired: baseAmount,
        amount1Desired: quoteAmount,
        amount0Min: amount0Min,
        amount1Min: amount1Min,
      };

      const response: any = await increaseLiquidityV3(params);


      dispatch(
        updateCurrentTransaction({
          id: transactionType.increaseLiquidity,
          status: TransactionStatus.success,
          hash: response.hash,
          infoTexts: {
            success:response===true? `Liquidity has been added successfully.`:'Liquidity add fail',
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
          currentPrice: tickToPrice(positionDetail.pair?.tick),
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
      <Box className={s.container__body}>{renderContent()}</Box>
    </BodyContainer>
  );
};

export default IncreaseLiquidity;
