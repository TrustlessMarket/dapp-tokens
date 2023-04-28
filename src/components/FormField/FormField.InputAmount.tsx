import React from 'react';
import { FieldWrapper } from './FormField.styled';
import { FieldProps } from 'formik';

interface FormFieldInputAmountProps {
  field: FieldProps | HTMLFormElement;
  form: HTMLFormElement;
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
