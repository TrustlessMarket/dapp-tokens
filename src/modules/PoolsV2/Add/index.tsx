/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import BodyContainer from '@/components/Swap/bodyContainer';
import { toastError } from '@/constants/error';
import useAddLiquidityV3, {
  IAddLiquidityV3,
} from '@/hooks/contract-operations/pools/v3/useAddLiquidityV3';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { IPoolV2AddPair } from '@/pages/pools/[slug]/add/[[...id]]';
import { logErrorToServer } from '@/services/swap';
import {
  requestReload,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import { showError, showSuccess } from '@/utils/toast';
import { Box } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { onShowAddLiquidityConfirm } from '../utils';
import FormAddPoolsV2Container from './form';
import s from './styles.module.scss';
import BigNumber from 'bignumber.js';
import { IToken } from '@/interfaces/token';
import { getExplorer } from '@/utils';
import { isNaN } from 'lodash';
import { useAppSelector } from '@/state/hooks';

type IPoolsV2AddPage = IPoolV2AddPair;

const PoolsV2AddPage: React.FC<IPoolsV2AddPage> = ({ ids }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const slippage = useAppSelector(selectPnftExchange).slippageNOS;

  const [submitting, setSubmitting] = useState(false);

  const refForm = useRef<any>();

  const { run: addLiquidityV3 } = useContractOperation({
    operation: useAddLiquidityV3,
  });

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          id: transactionType.createPool,
          status: TransactionStatus.info,
        }),
      );

      const baseAmount = values?.baseAmount || '0';
      const quoteAmount = values?.quoteAmount || '0';

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

      const params: IAddLiquidityV3 = {
        tokenA: baseToken,
        tokenB: quoteToken,
        amountADesired: baseAmount,
        amountBDesired: values?.quoteAmount || '0',
        lowerTick: values?.tickLower,
        upperTick: values?.tickUpper,
        fee: values?.fee,
        amount0Min: amount0Min,
        amount1Min: amount1Min,
        currentPrice: values?.currentPrice,
        poolAddress: values?.poolAddress,
      };

      console.log('params', params);

      const response: any = await addLiquidityV3(params);
      showSuccess({
        message: values?.poolAddress
          ? `Pool has been added successfully.`
          : `Pool has been created successfully.`,
        url: getExplorer(response.hash),
      });
      dispatch(updateCurrentTransaction(null));
      router.back();
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

  return (
    <BodyContainer className={s.container}>
      <Box className={s.container__body}>
        <Form
          onSubmit={(e) =>
            onShowAddLiquidityConfirm(
              {
                ...e,
                reFee: Number(e?.fee),
              },
              onSubmit,
            )
          }
        >
          {({ handleSubmit }) => (
            <FormAddPoolsV2Container
              submitting={submitting}
              handleSubmit={handleSubmit}
              ids={ids}
              ref={refForm}
            />
          )}
        </Form>
      </Box>
    </BodyContainer>
  );
};

export default PoolsV2AddPage;
