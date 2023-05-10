/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import cx from 'classnames';

import { colors } from '@/theme/colors';
import moment from 'moment';
import { BsCalendar2 } from 'react-icons/bs';
import styles from './styles.module.scss';

interface FieldDateProps {
  input?: any;
  meta?: any;
  label?: string;
  rightLabel?: string;
  placeholder?: string;
  errorMessage?: any;
  appendComp?: any;
  errorPlacement?: string;
  inputType?: 'text' | 'textarea';
  fieldChanged?: (_: any) => void;
}

const FieldDate = (props: FieldDateProps) => {
  const {
    input,
    label,
    rightLabel,
    meta,
    fieldChanged,
    // disabledInput, errorPlacement, zIndex, anchorAppend,
    // ...restProps
  } = props;
  const { onChange, value } = input;
  const { error } = meta;
  //   const shouldShowError = !!(touched && error) || (error && value);

  const isError = meta.error && meta.touched;

  const handleChange = (e: any) => {
    console.log(e);

    onChange(e);
    fieldChanged?.(e);
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
      <Box className={cx(styles.formCalendar, 'field-calendar-container')}>
        <DatePicker
          onChange={handleChange}
          selected={value}
          showTimeSelect
          // dateFormat="Pp"
          minDate={new Date(moment().add('days', 1).format())}
          // dateFormatCalendar="yyyy/MM/dd"
          timeFormat="HH:mm"
          dateFormat="MMMM d, yyyy h:mm aa"
        />
        <BsCalendar2 color={colors.white500} />
      </Box>

      <FormErrorMessage fontSize="sm" color="brand.danger.400">
        {error}
      </FormErrorMessage>
    </FormControl>
  );
};

export default FieldDate;
