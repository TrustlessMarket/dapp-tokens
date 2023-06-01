/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FiledButton from '@/components/Swap/button/filedButton';
import WrapperConnected from '@/components/WrapperConnected';
import { ROUTE_PATH } from '@/constants/route-path';
import { ILaunchpad } from '@/interfaces/launchpad';
import { IToken } from '@/interfaces/token';
import { colors } from '@/theme/colors';
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
import { useForm, useFormState } from 'react-final-form';
import { FiChevronLeft } from 'react-icons/fi';
import { StyledLaunchpadManageHeader } from './LaunchpadManage.styled';

export interface LaunchpadManageHeaderProps {
  step: number;
  loading: boolean;
  isApproveToken: boolean;
  setLoading: (_: boolean) => void;
  setStep: (_: any) => void;
  onApprove: () => void;
  detail?: ILaunchpad;
  steps: any[];
}

const LaunchpadManageHeader: React.FC<LaunchpadManageHeaderProps> = ({
  step,
  loading,
  setLoading,
  detail,
  isApproveToken,
  onApprove,
  setStep,
  steps,
}) => {
  const { values } = useFormState();
  const { change } = useForm();

  const tokenSelected: IToken | undefined = values?.launchpadTokenArg;

  const router = useRouter();

  const renderButton = () => {
    const lastStep = step >= steps.length - 1;

    if (!isApproveToken && tokenSelected) {
      return (
        <FiledButton
          isLoading={loading}
          isDisabled={loading}
          loadingText="Processing"
          // btnSize={'h'}
          onClick={onApprove}
          type="button"
        >
          {`APPROVE USE OF ${tokenSelected?.symbol}`}
        </FiledButton>
      );
    }

    return (
      <Flex width={'100%'} justifyContent={'flex-end'} gap={6}>
        <FiledButton
          isLoading={loading}
          isDisabled={loading}
          type="submit"
          className={detail && !detail.launchpad ? 'btn-secondary' : 'btn-primary'}
          onClick={() => change('isLastStep', lastStep)}
        >
          {detail ? 'Update' : lastStep ? 'Submit' : 'Next'}
        </FiledButton>
        {detail && lastStep && !detail.launchpad && (
          <FiledButton
            isLoading={loading}
            isDisabled={loading}
            type="submit"
            // processInfo={{
            //   id: transactionType.createLaunchpad,
            // }}
            // btnSize="h"
            // containerConfig={{
            //   style: {
            //     width: '100%',
            //   },
            // }}
            onClick={() => {
              change('isCreateProposal', true);
              change('isLastStep', lastStep);
            }}
          >
            {'Submit proposal'}
          </FiledButton>
        )}
      </Flex>
    );
  };

  const onBack = () => {
    if (step > 0 && step < steps.length) {
      setStep((n: any) => n - 1);
    } else {
      router.push(ROUTE_PATH.LAUNCHPAD);
    }
  };

  return (
    <StyledLaunchpadManageHeader>
      <Flex className="btn-back-container">
        <Box onClick={onBack} className="btn-back">
          <FiChevronLeft className="btn-back-icon" />
        </Box>
        <Text className="back-title">{steps?.[step]?.title}</Text>
      </Flex>
      <Box className="step-container">
        <Stepper className="step-content" size="md" index={step}>
          {steps.map((step: any, index: any) => (
            <Step className="step-item" key={index}>
              <StepIndicator className="indicator">
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber style={{ color: colors.white500 }} />}
                  active={<StepNumber style={{ color: colors.white }} />}
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
      <Box className="btn-submit-container">
        <WrapperConnected className="btn-submit">{renderButton()}</WrapperConnected>
      </Box>
    </StyledLaunchpadManageHeader>
  );
};

export default LaunchpadManageHeader;
