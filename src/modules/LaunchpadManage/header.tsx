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
  onApprove: () => void;
  detail?: ILaunchpad;
}

const steps = [{ title: 'Setup token' }, { title: 'Fill information' }];

const LaunchpadManageHeader: React.FC<LaunchpadManageHeaderProps> = ({
  step,
  loading,
  setLoading,
  detail,
  isApproveToken,
  onApprove,
}) => {
  const { values } = useFormState();
  const { change } = useForm();

  const tokenSelected: IToken | undefined = values?.launchpadTokenArg;

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
        <Stepper className="step-content" size="md" index={step}>
          {steps.map((step, index) => (
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
        <WrapperConnected className="btn-submit">
          {!isApproveToken && tokenSelected ? (
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
          ) : (
            <Flex width={'100%'} justifyContent={'flex-end'} gap={6}>
              <FiledButton
                isLoading={loading}
                isDisabled={loading}
                type="submit"
                // btnSize="h"
                // containerConfig={{
                //   style: {
                //     width: '100%',
                //   },
                // }}
                className={
                  detail && !detail.launchpad ? 'btn-secondary' : 'btn-primary'
                }
              >
                {detail ? 'Update' : 'Submit'}
              </FiledButton>
              {detail && !detail.launchpad && (
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
                  onClick={() => change('isCreateProposal', true)}
                >
                  {'Submit proposal'}
                </FiledButton>
              )}
            </Flex>
          )}
        </WrapperConnected>
      </Box>
    </StyledLaunchpadManageHeader>
  );
};

export default LaunchpadManageHeader;
