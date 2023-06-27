/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import BodyContainer from '@/components/Swap/bodyContainer';
import { ROUTE_PATH } from '@/constants/route-path';
import { IPoolV2AddPair } from '@/pages/pools/v2/add/[...id]';
import { Box, Flex, Heading, Icon, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { BiChevronLeft } from 'react-icons/bi';
import FormAddPoolsV2Container from './form';
import s from './styles.module.scss';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useAddLiquidityV3, {
  IAddLiquidityV3,
} from '@/hooks/contract-operations/pools/v3/useAddLiquidityV3';
import { useDispatch } from 'react-redux';
import { requestReload, updateCurrentTransaction } from '@/state/pnftExchange';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { logErrorToServer } from '@/services/swap';
import { showError } from '@/utils/toast';
import { toastError } from '@/constants/error';
import { useWeb3React } from '@web3-react/core';

type IPoolsV2AddPage = IPoolV2AddPair;

const PoolsV2AddPage: React.FC<IPoolsV2AddPage> = ({ ids }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { account } = useWeb3React();

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
        <Flex className={s.container__top_body}>
          <IconButton
            position={'absolute'}
            left={0}
            size={'sm'}
            borderWidth={0}
            colorScheme="whiteAlpha"
            variant="outline"
            _hover={{
              backgroundColor: 'transparent',
            }}
            icon={
              <Icon
                as={BiChevronLeft}
                color={'rgba(255, 255, 255, 0.5)'}
                fontSize={'25px'}
              />
            }
            onClick={() => router.replace(`${ROUTE_PATH.POOLS_V2}`)}
            aria-label={''}
          />
          <Heading as={'h4'}>Add Liquidity</Heading>
        </Flex>
        <Box className={s.container__content_body}>
          <Form onSubmit={onSubmit}>
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
      </Box>
    </BodyContainer>
  );
};

export default PoolsV2AddPage;
