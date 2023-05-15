import React from 'react';
import Select from 'react-select';
import { FieldWrapper } from './FormField.styled';

export interface SelectOption {
  value: string;
  label: string;
  image: string;
}

interface FormFieldSelectProps {
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  options: SelectOption[];
  input: HTMLInputElement;
}

const FormFieldSelect: React.FC<FormFieldSelectProps> = (props) => {
  const { placeholder, options, isDisabled, isLoading, isClearable, isSearchable } =
    props;
  // const { value, name } = input;
  return (
    <FieldWrapper>
      <Select
        className="btn-wrapper"
        classNamePrefix={'select'}
        placeholder={placeholder}
        // defaultValue={value}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        // name={name}
        options={options}
      />
      {/* {errors.name && touched.name && <p className="error">{errors.name}</p>} */}
    </FieldWrapper>
  );
};

FormFieldSelect.defaultProps = {
  placeholder: 'Select',
  options: [],
};

export default FormFieldSelect;
