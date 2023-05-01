/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FieldWrapper } from './FormField.styled';

interface FormFieldInputAmountProps {
  field: any;
  form: any;
  bottomNote?: React.ReactNode | undefined;
}

const FormFieldInputAmount: React.FC<FormFieldInputAmountProps> = ({
  field,
  // form,
  bottomNote,
  ...props
}) => {
  return (
    <FieldWrapper>
      <input
        className="form-input"
        {...field}
        {...props}
        // onChange={handleChange}
        // onBlur={handleBlur}
      />
      {bottomNote}
      {/* {errors.name && touched.name && <p className="error">{errors.name}</p>} */}
    </FieldWrapper>
  );
};

export default FormFieldInputAmount;
