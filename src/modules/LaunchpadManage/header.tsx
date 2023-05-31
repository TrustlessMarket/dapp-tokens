import { ROUTE_PATH } from '@/constants/route-path';
import {
  Box,
  Flex,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiChevronLeft } from 'react-icons/fi';
import { StyledLaunchpadManageHeader } from './LaunchpadManage.styled';

interface LaunchpadManageHeaderProps {
  step: number;
}

const steps = [{ title: 'First' }, { title: 'Second' }, { title: 'Third' }];

const LaunchpadManageHeader: React.FC<LaunchpadManageHeaderProps> = ({ step }) => {
  const router = useRouter();

  return (
    <StyledLaunchpadManageHeader>
      <Flex className="btn-back-container">
        <Box onClick={() => router.push(ROUTE_PATH.LAUNCHPAD)} className="btn-back">
          <FiChevronLeft className="btn-back-icon" />
        </Box>
        <Text className="back-title">Create Launchpad</Text>
      </Flex>
      <Box className="step-container">
        <Stepper size="md" index={step}>
          {steps.map((step, index) => (
            <Step className="step-item" key={index}>
              <StepIndicator className="indicator">
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle className="step-title">{step.title}</StepTitle>
              </Box>

              <StepSeparator className="separator" />
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box className="btn-submit-container"></Box>
    </StyledLaunchpadManageHeader>
  );
};

export default LaunchpadManageHeader;
