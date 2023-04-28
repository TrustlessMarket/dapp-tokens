import { Formik } from 'formik';
import React from 'react';
import AddPoolsForm from './AddPools.Form';

const FormAddPoolContainer = () => {
  const onSubmit = async () => {
    try {
    } catch (error) {}
  };

  return (
    <Formik
      initialValues={{
        fee_tier: 0.3,
      }}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => <AddPoolsForm handleSubmit={handleSubmit} />}
    </Formik>
  );
};

export default FormAddPoolContainer;
