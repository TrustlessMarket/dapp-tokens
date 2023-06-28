/* eslint-disable @typescript-eslint/no-explicit-any */
import InputWrapper from '@/components/Swap/form/inputWrapper';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useForm, useFormState } from 'react-final-form';
import s from './styles.module.scss';
import { feeTiers } from '../utils';
import cs from 'classnames';
import { compareString } from '@/utils';
import Text from '@/components/Text';

const AddFeeTier = () => {
  const { values } = useFormState();
  const { change } = useForm();
  const fee: any = values?.fee;
  return (
    <InputWrapper label={`Fee Tier: ${fee / 10000 / 2}%`}>
      <Flex className={s.formContainer__left__feeTierContainer} gap={1.5}>
        {feeTiers.map((v) => (
          <Box
            key={v.value}
            className={cs(
              s.formContainer__left__feeTierContainer__item,
              compareString(fee, v.value) &&
                s.formContainer__left__feeTierContainer__itemActive,
            )}
            onClick={() => change('fee', v.value)}
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
