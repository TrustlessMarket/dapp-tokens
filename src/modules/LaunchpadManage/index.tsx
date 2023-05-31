/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { StyledLaunchpadManage } from './LaunchpadManage.styled';
import LaunchpadManageHeader from './header';
import { Form } from 'react-final-form';
import LaunchpadFormStep1 from './LaunchpadFormStep1';
import LaunchpadManageFormContainer from './LauchpadManage.FormContainer';

const LaunchpadManage = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    try {
    } catch (error) {}
  };

  const renderContentByStep = () => {
    switch (step) {
      case 0:
        return <LaunchpadFormStep1 />;

      default:
        return null;
    }
  };

  return (
    <StyledLaunchpadManage>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <LaunchpadManageFormContainer
            loading={loading}
            setLoading={setLoading}
            onSubmit={handleSubmit}
          />
          // <form onSubmit={handleSubmit}>
          //   <LaunchpadManageHeader
          //     step={step}
          //     loading={loading}
          //     setLoading={setLoading}
          //   />
          //   {renderContentByStep()}
          // </form>
        )}
      </Form>
    </StyledLaunchpadManage>
  );
};

export default LaunchpadManage;
