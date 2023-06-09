/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import Cleave from 'cleave.js/react';
import React from 'react';

import { formatCurrency } from '@/utils';
import { CleaveOptions } from 'cleave.js/options';
import styles from './styles.module.scss';

interface FieldAmountProps {
  input?: any;
  meta?: any;
  customMeta?: any;
  label?: string;
  prependComp?: React.ReactNode;
  appendComp?: React.ReactNode;
  onClickMax?: React.MouseEventHandler;
  placeholder?: string;
  decimals?: number;
  maxLength?: number;
  note?: React.ReactNode;
  rightLabel?: React.ReactNode;
  fieldChanged?: (_: any) => void;
  blurFieldChanged?: (_: any) => void;
  hideError?: boolean;
  borderColor?: string;
  numberOptions?: CleaveOptions;
}

const FieldAmount = (props: FieldAmountProps) => {
  const {
    input,
    meta,
    label,
    prependComp,
    appendComp,
    onClickMax,
    placeholder = '0.0',
    decimals = 2,
    maxLength = 256,
    note,
    rightLabel,
    fieldChanged,
    blurFieldChanged,
    // disabledInput, errorPlacement, zIndex, anchorAppend,
    hideError = false,
    borderColor = 'background.default',
    numberOptions,
    customMeta,
    ...restProps
  } = props;
  const { onChange, onBlur, onFocus, value } = input;
  const _meta = meta || customMeta;
  const error = _meta.error;
  const touched = _meta.touched;
  const shouldShowError = !!(touched && error) || (error && value);
  const hasAppend = appendComp || onClickMax;

  const handleChange = (e: any) => {
    onChange(e.target.rawValue);
    fieldChanged?.(e.target.rawValue);
  };

  const isError = meta.error && meta.touched;

  return (
    <>
      <FormControl isInvalid={isError} className={isError && 'isError'}>
        {(label || rightLabel) && (
          <Flex justifyContent={'space-between'}>
            <Box>
              <FormLabel fontSize="xs" fontWeight="medium">
                {label}
              </FormLabel>
            </Box>
            <Box>
              {typeof rightLabel === 'object' ? (
                rightLabel
              ) : (
                <FormLabel fontSize="xs" fontWeight="medium">
                  {rightLabel}
                </FormLabel>
              )}
            </Box>
          </Flex>
        )}
        <InputGroup
          borderStyle={'solid'}
          borderWidth={1}
          borderColor={shouldShowError ? 'brand.danger.400' : borderColor}
          borderRadius={8}
          bgColor="background.default"
          overflow="hidden"
        >
          {prependComp && (
            <InputLeftElement
              children={prependComp}
              ml={2}
              mr={2}
              height="100%"
              position={'relative'}
            />
          )}
          <Box className={styles.formControl}>
            <Cleave
              placeholder={placeholder}
              value={formatCurrency(value)}
              maxLength={maxLength}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={(e: any) => {
                onBlur();
                e?.target?.blur();
                blurFieldChanged?.(e.target.rawValue);
              }}
              options={{
                numeral: true,
                numeralThousandsGroupStyle: 'thousand',
                numeralPositiveOnly: true,
                numeralDecimalScale: decimals,
                tailPrefix: true,
                rawValueTrimPrefix: true,
                noImmediatePrefix: false,
                ...numberOptions,
              }}
              {...restProps}
            />
          </Box>
          {hasAppend && (
            <InputRightElement
              w="fit-content"
              mr={2}
              height="100%"
              children={appendComp}
              position={'relative'}
            />
          )}
        </InputGroup>
        {note && <div className="field-note">{note}</div>}
      </FormControl>

      {!hideError && isError && (
        <Text
          style={{
            fontSize: '12px',
            color: 'var(--chakra-colors-brand-danger-400)',
            textAlign: 'left',
            fontWeight: '400',
          }}
          className="error-text"
        >
          {error}
        </Text>
      )}
    </>
  );
};

export default FieldAmount;
