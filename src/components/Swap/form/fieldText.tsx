/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';

import styles from './styles.module.scss';
import React from 'react';

interface FieldTextProps {
  input?: any;
  meta?: any;
  label?: string;
  rightLabel?: string;
  placeholder?: string;
  errorMessage?: any;
  prependComp?: any;
  appendComp?: any;
  errorPlacement?: string;
  inputType?: 'text' | 'textarea';
  fieldChanged?: (_: any) => void;
  borderColor?: string;
}

const FieldText = (props: FieldTextProps) => {
  const {
    input,
    label,
    rightLabel,
    meta,
    placeholder,
    inputType = 'text',
    prependComp,
    appendComp,
    fieldChanged,
    // disabledInput, errorPlacement, zIndex, anchorAppend,
    borderColor = 'background.default',
    ...restProps
  } = props;
  const { onChange, onBlur, onFocus, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error) || (error && value);

  const isError = meta.error && meta.touched;

  const hasAppend = appendComp;

  const handleChange = (e: any) => {
    onChange(e.target.value);
    fieldChanged?.(e.target.value);
  };

  return (
    <FormControl isInvalid={isError}>
      {(label || rightLabel) && (
        <Flex justifyContent={'space-between'}>
          <Box>
            <FormLabel fontSize="xs" fontWeight="medium">
              {label}
            </FormLabel>
          </Box>
          <Box>
            <FormLabel fontSize="xs" fontWeight="medium">
              {rightLabel}
            </FormLabel>
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
            // ml={2}
            // mr={2}
            // height="100%"
            position={'relative'}
          />
        )}
        <Box className={styles.formControl}>
          <Input
            as={inputType === 'text' ? 'input' : 'textarea'}
            type={inputType === 'text' ? 'input' : 'textarea'}
            placeholder={placeholder}
            _placeholder={{ color: '#b3b3b3' }}
            value={value}
            onFocus={onFocus}
            onBlur={(e) => {
              onBlur();
              e?.target?.blur();
            }}
            {...restProps}
            onChange={handleChange}
          />
        </Box>
        {hasAppend && (
          <InputRightElement w="fit-content" pr={2} children={appendComp} />
        )}
      </InputGroup>
      <FormErrorMessage fontSize="sm" color="brand.danger.400">
        {error}
      </FormErrorMessage>
    </FormControl>
  );
};

export default FieldText;
