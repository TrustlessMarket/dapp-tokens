/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {TransactionStatus} from '@/components/Swap/alertInfoProcessing/interface';
import {transactionType} from '@/components/Swap/alertInfoProcessing/types';
import BodyContainer from '@/components/Swap/bodyContainer';
import {toastError} from '@/constants/error';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import {IPosition} from '@/interfaces/position';
import {logErrorToServer} from '@/services/swap';
import {getPositionDetail} from '@/services/swap-v3';
import {useAppSelector} from '@/state/hooks';
import {requestReload, selectPnftExchange, updateCurrentTransaction,} from '@/state/pnftExchange';
import {showError} from '@/utils/toast';
import {Box} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import React, {useEffect, useRef, useState} from 'react';
import {Form} from 'react-final-form';
import {useDispatch} from 'react-redux';
import FormRemovePoolsV2Container from './form';
import s from './styles.module.scss';
import useRemoveLiquidityV3, {IRemoveLiquidityV3} from "@/hooks/contract-operations/pools/v3/useRemoveLiquidityV3";
import BigNumber from "bignumber.js";
import {BigNumber as BN, BigNumberish, ethers} from 'ethers';
import {getAmount0ForLiquidity, getAmount1ForLiquidity} from "@/utils/utilities";
import {getSqrtRatioAtTick} from "@/utils/number";

interface IPoolsV2DetailPage {
  ids: any;
}

const PoolsV2RemovePage: React.FC<IPoolsV2DetailPage> = ({ ids }) => {
  const [positionDetail, setPositionDetail] = useState<IPosition>();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const [submitting, setSubmitting] = useState(false);
  const slippage = 50; //useAppSelector(selectPnftExchange).slippage;

  const refForm = useRef<any>();

  const { run: removeLiquidityV3 } = useContractOperation({
    operation: useRemoveLiquidityV3,
  });

  useEffect(() => {
    if (ids?.length > 0) {
      const positionId = ids[0];
      getUserPositionDetail(positionId);
    }
  }, [needReload, JSON.stringify(ids)]);

  const getUserPositionDetail = async (id: any) => {
    const res = await getPositionDetail(id);
    setPositionDetail(res);
  };

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          id: transactionType.removeLiquidity,
          status: TransactionStatus.info,
        }),
      );

      const liquidityRemove = new BigNumber(positionDetail?.liquidity || 0)
        .multipliedBy(values.percent).div(100).toString();

      let amountOut0 = BN.from(0);
      let amountOut1 = BN.from(0);

      const lowerSqrtRatioX96 = getSqrtRatioAtTick(positionDetail?.tickLower || 0);
      const upperSqrtRatioX96 = getSqrtRatioAtTick(positionDetail?.tickUpper || 0);

      console.log('bbbb', liquidityRemove);
      const liquidity = ethers.utils.parseEther(liquidityRemove);



      amountOut0 = getAmount0ForLiquidity(lowerSqrtRatioX96, upperSqrtRatioX96, liquidity);
      amountOut1 = getAmount1ForLiquidity(lowerSqrtRatioX96, upperSqrtRatioX96, liquidity);

      const amount0Min = ethers.utils.formatEther(
        amountOut0
        .mul(100 - slippage)
        .div(100)
      );

      const amount1Min = ethers.utils.formatEther(
        amountOut1
        .mul(100 - slippage)
        .div(100)
      );
      console.log('aaaaa');
      console.log('slippage', slippage);
      console.log('liquidityRemove', liquidityRemove);
      console.log('amountOut0', amountOut0);
      console.log('amount0Min', amount0Min);
      console.log('amountOut1', amountOut1);
      console.log('amount1Min', amount1Min);
      console.log('values', values);

      const params: IRemoveLiquidityV3 = {
        tokenId: positionDetail?.tokenId,
        liquidity: liquidityRemove,
        amount0Min: amount0Min,
        amount1Min: amount1Min,
      };

      const response: any = await removeLiquidityV3(params);
      dispatch(
        updateCurrentTransaction({
          id: transactionType.removeLiquidity,
          status: TransactionStatus.success,
          hash: response.hash,
          infoTexts: {
            success: `Remove liquidity successfully.`
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

  return (
    <BodyContainer className={s.container}>
      <Box className={s.container__body}>
        <Form onSubmit={onSubmit} initialValues={{percent: 0}}>
          {({ handleSubmit }) => (
            <FormRemovePoolsV2Container
              submitting={submitting}
              handleSubmit={handleSubmit}
              ids={ids}
              ref={refForm}
              positionDetail={positionDetail}
            />
          )}
        </Form>
      </Box>
    </BodyContainer>
  );
};

export default PoolsV2RemovePage;
