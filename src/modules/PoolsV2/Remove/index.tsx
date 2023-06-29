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
import {ethers} from 'ethers';
import {getAmountsForLiquidity} from "@/utils/utilities";
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

      const liquidityRemove = ethers.utils.parseEther(positionDetail?.liquidity || "0")
        .mul(values.percent).div(100);

      const currentSqrtRatioX96 = getSqrtRatioAtTick(positionDetail?.pair?.tick || 0);
      const lowerSqrtRatioX96 = getSqrtRatioAtTick(positionDetail?.tickLower || 0);
      const upperSqrtRatioX96 = getSqrtRatioAtTick(positionDetail?.tickUpper || 0);

      const [amountOut0, amountOut1] = getAmountsForLiquidity(
        currentSqrtRatioX96,
        lowerSqrtRatioX96,
        upperSqrtRatioX96,
        liquidityRemove
      );

      const amount0Min = ethers.utils.formatEther(
        amountOut0
        .mul(1000000 - Math.floor(slippage*10000))
        .div(1000000)
      );

      const amount1Min = ethers.utils.formatEther(
        amountOut1
        .mul(1000000 - Math.floor(slippage*10000))
        .div(1000000)
      );

      const params: IRemoveLiquidityV3 = {
        tokenId: positionDetail?.tokenId,
        liquidity: ethers.utils.formatEther(liquidityRemove),
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
