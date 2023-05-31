/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { StyledLaunchpadManage } from './LaunchpadManage.styled';
import LaunchpadManageHeader from './header';

const LaunchpadManage = () => {
  const [step, setStep] = useState(0);

  return (
    <StyledLaunchpadManage>
      <LaunchpadManageHeader step={step} />
    </StyledLaunchpadManage>
  );
};

export default LaunchpadManage;
