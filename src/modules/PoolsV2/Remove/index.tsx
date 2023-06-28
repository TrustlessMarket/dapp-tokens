/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import React, {useEffect, useRef, useState} from 'react';
import s from './styles.module.scss';
import {Box} from '@chakra-ui/react';
import {IPoolV2Detail} from "@/pages/pools/v2/detail/[[...id]]";
import {getPositionDetail} from "@/services/swap-v3";
import {IPosition} from "@/interfaces/position";
import {useDispatch} from "react-redux";
import {useWeb3React} from "@web3-react/core";
import useContractOperation from "@/hooks/contract-operations/useContractOperation";
import useAddLiquidityV3, {IAddLiquidityV3} from "@/hooks/contract-operations/pools/v3/useAddLiquidityV3";
import {requestReload, selectPnftExchange, updateCurrentTransaction} from "@/state/pnftExchange";
import {transactionType} from "@/components/Swap/alertInfoProcessing/types";
import {TransactionStatus} from "@/components/Swap/alertInfoProcessing/interface";
import {logErrorToServer} from "@/services/swap";
import {toastError} from "@/constants/error";
import {showError} from "@/utils/toast";
import {Form} from "react-final-form";
import FormRemovePoolsV2Container from "./form";
import {useAppSelector} from "@/state/hooks";

type IPoolsV2DetailPage = IPoolV2Detail;

const PoolsV2RemovePage: React.FC<IPoolsV2DetailPage> = ({ids}) => {
  const [positionDetail, setPositionDetail] = useState<IPosition>();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const [submitting, setSubmitting] = useState(false);

  const refForm = useRef<any>();

  const { run: addLiquidityV3 } = useContractOperation({
    operation: useAddLiquidityV3,
  });

  useEffect(() => {
    if(ids?.length > 0) {
      const positionId = ids[0];
      getUserPositionDetail(positionId);
    }
  }, [needReload, JSON.stringify(ids)]);

  const getUserPositionDetail = async (id: any) => {
    const res = await getPositionDetail(id);
    setPositionDetail(res);
  }

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          id: transactionType.createPool,
          status: TransactionStatus.info,
        }),
      );
      const params: IAddLiquidityV3 = {
        tokenA: values?.baseToken,
        tokenB: values?.quoteToken,
        amountADesired: values?.baseAmount || '0',
        amountBDesired: values?.quoteAmount || '0',
        lowerTick: values?.tickLower,
        upperTick: values?.tickUpper,
        fee: values?.fee,
        amount0Min: '0',
        amount1Min: '0',
        currentPrice: values?.currentPrice,
        poolAddress: values?.poolAddress,
      };

      const response: any = await addLiquidityV3(params);
      dispatch(
        updateCurrentTransaction({
          id: transactionType.createPool,
          status: TransactionStatus.success,
          hash: response.hash,
          infoTexts: {
            success: values?.poolAddress
              ? `Pool has been added successfully.`
              : `Pool has been created successfully.`,
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
        <Form onSubmit={onSubmit}>
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
