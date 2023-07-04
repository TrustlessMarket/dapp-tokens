/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import { useForm, useFormState } from 'react-final-form';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import s from '@/modules/PoolsV2/Remove/styles.module.scss';
import cs from 'classnames';
import { compareString } from '@/utils';
import Text from '@/components/Text';
import React from 'react';

const PERCENTS = [
  {
    title: '25%',
    value: 25,
  },
  {
    title: '50%',
    value: 50,
  },
  {
    title: '75%',
    value: 75,
  },
  {
    title: 'Max',
    value: 100,
  },
];

const RemoveAmount = () => {
  const { values } = useFormState();
  const { change } = useForm();
  const percent: any = values?.percent;

  const onChangeSlider = (val: any) => {
    change('percent', val);
  };

  return (
    <InputWrapper label={`Amount`} className={s.amountContainer}>
      <Flex gap={8} alignItems={'center'}>
        <Text className={s.amountValue}>{values?.percent || 0}%</Text>
        <Flex gap={4}>
          {PERCENTS.map((v) => (
            <Box
              key={v.value}
              className={cs(
                s.amountItem,
                compareString(percent, v.value) && s.isActive,
              )}
              onClick={() => change('percent', v.value)}
            >
              <Text className={s.amountItemTitle}>{v.title}</Text>
            </Box>
          ))}
        </Flex>
      </Flex>
      <Slider
        defaultValue={0}
        min={0}
        max={100}
        step={1}
        value={percent}
        onChange={onChangeSlider}
      >
        <SliderTrack bg="#6B7594">
          <Box position="relative" right={10} />
          <SliderFilledTrack bg="#FFFFFF" />
        </SliderTrack>
        <SliderThumb boxSize={6} />
      </Slider>
    </InputWrapper>
  );
};

export default RemoveAmount;
