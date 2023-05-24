/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import cx from 'classnames';
import React from 'react';
import FilterButton from '../filterToken';
import styles from './styles.module.scss';

export interface SelectOption {
  value: string;
  label: string;
  image: string;
}

interface FieldSelectProps {
  input?: any;
  meta?: any;
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
  hideError?: boolean;
  disabled?: boolean;
  borderColor?: string;
  options?: any[] | undefined;
}

const FieldSelect: React.FC<FieldSelectProps> = (props) => {
  const {
    input,
    meta,
    label,
    options,
    prependComp,
    appendComp,
    onClickMax,
    placeholder = '0.0',
    decimals = 2,
    maxLength = 256,
    note,
    rightLabel,
    fieldChanged,
    // disabledInput, errorPlacement, zIndex, anchorAppend,
    hideError = false,
    borderColor = 'background.default',
    disabled = false,
    ...restProps
  } = props;

  const { onChange, onBlur, onFocus, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error) || (error && value);

  const isError = meta.error && meta.touched;

  const onSelectToken = (_value: any) => {
    onChange(_value);
  };

  return (
    <FormControl isInvalid={isError}>
      {label && (
        <Box>
          <FormLabel fontSize="xs" fontWeight="medium">
            {label}
          </FormLabel>
        </Box>
      )}
      <Box className={cx(styles.formSelect, 'field-select-container')}>
        <FilterButton
          data={options}
          handleSelectItem={onSelectToken}
          // parentClose={close}
          value={value}
          disabled={disabled}
        />
        <input {...restProps} {...input} />
      </Box>

      <FormErrorMessage fontSize="sm" color="brand.danger.400">
        {error}
      </FormErrorMessage>
    </FormControl>
  );
};

FieldSelect.defaultProps = {
  placeholder: 'Select',
  options: [],
};

export default FieldSelect;
