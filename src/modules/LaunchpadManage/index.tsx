/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { StyledLaunchpadManage } from './LaunchpadManage.styled';
import LaunchpadManageHeader from './header';
import { Form } from 'react-final-form';
import LaunchpadFormStep1 from './LaunchpadFormStep1';
import LaunchpadManageFormContainer from './LauchpadManage.FormContainer';
import { LAUNCHPAD_FORM_STEP } from '@/constants/storage-key';

const LaunchpadManage = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const onSubmit = async (values: any) => {
    try {
      let cachedData = localStorage.getItem(LAUNCHPAD_FORM_STEP);

      if (cachedData) {
        cachedData = JSON.parse(cachedData);
      }

      if (step === 0) {
        localStorage.setItem(
          LAUNCHPAD_FORM_STEP,
          JSON.stringify({
            step,
            values,
          }),
        );
        setStep(1);
      }
    } catch (error) {}
  };

  return (
    <StyledLaunchpadManage>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <LaunchpadManageFormContainer
            loading={loading}
            setLoading={setLoading}
            onSubmit={handleSubmit}
            step={step}
            setStep={setStep}
          />
        )}
      </Form>
    </StyledLaunchpadManage>
  );
};

export default LaunchpadManage;
