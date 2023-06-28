/* eslint-disable @typescript-eslint/no-explicit-any */
import InputWrapper from '@/components/Swap/form/inputWrapper';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useForm, useFormState } from 'react-final-form';
import s from './styles.module.scss';
import { allowStep, feeTiers } from '../utils';
import cs from 'classnames';
import { compareString } from '@/utils';
import Text from '@/components/Text';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';

const AddFeeTier = () => {
  const router = useRouter();
  const { values } = useFormState();
  const { change } = useForm();
  const fee: any = values?.fee;

  const ids: any[] = router?.query?.id as any[];

  const onChangeFee = (v: any) => {
    change('fee', v.value);
    const [baseTokenAddress, quoteTokenAddress] = ids;
    return router.replace(
      `${ROUTE_PATH.POOLS_V2_ADD}/${baseTokenAddress}/${quoteTokenAddress}/${v.value}`,
    );
  };

  const isHide = allowStep(values) < 1;

  return (
    <InputWrapper
      className={isHide ? s.blur : ''}
      label={`Fee Tier: ${(fee || 0) / 10000 / 2}%`}
    >
      {isHide && <Box className={s.blur__fade} />}
      <Flex className={s.formContainer__left__feeTierContainer} gap={1.5}>
        {feeTiers.map((v) => (
          <Box
            key={v.value}
            className={cs(
              s.formContainer__left__feeTierContainer__item,
              compareString(fee, v.value) &&
                s.formContainer__left__feeTierContainer__itemActive,
            )}
            onClick={() => onChangeFee(v)}
          >
            <Text className={s.formContainer__left__feeTierContainer__item__title}>
              {v.title}%
            </Text>
            <Text className={s.formContainer__left__feeTierContainer__item__desc}>
              {v.desc}
            </Text>
          </Box>
        ))}
      </Flex>
    </InputWrapper>
  );
};

export default AddFeeTier;
