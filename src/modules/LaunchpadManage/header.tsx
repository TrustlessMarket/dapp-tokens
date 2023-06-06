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
import ModalConfirmApprove from '@/components/ModalConfirmApprove';
import { closeModal, openModal } from '@/state/modal';
import { useDispatch } from 'react-redux';
import { isArray } from 'lodash';

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
  const { values, errors, error } = useFormState();
  const { change } = useForm();
  const dispatch = useDispatch();

  const tokenSelected: IToken | undefined = values?.launchpadTokenArg;

  const router = useRouter();

  const renderButton = () => {
    const lastStep = step >= steps.length - 1;

    if (!isApproveToken && tokenSelected && lastStep) {
      return (
        <Flex width={'100%'} justifyContent={'flex-end'} gap={6}>
          <FiledButton
            isLoading={loading}
            isDisabled={loading}
            loadingText="Processing"
            // btnSize={'h'}
            onClick={onShowModalApprove}
            type="submit"
          >
            {`APPROVE USE OF ${tokenSelected?.symbol}`}
          </FiledButton>
        </Flex>
      );
    }

    return (
      <Flex width={'100%'} justifyContent={'flex-end'} gap={6} alignItems={'center'}>
        {lastStep && !detail?.launchpad ? (
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
            {'Submit Launchpad'}
          </FiledButton>
        ) : (
          <FiledButton
            isLoading={loading}
            isDisabled={loading}
            type="submit"
            // className={detail && !detail.launchpad ? 'btn-secondary' : 'btn-primary'}
            className={lastStep ? 'btn-primary' : 'btn-secondary'}
            onClick={() => change('isLastStep', lastStep)}
          >
            {lastStep ? (detail ? 'Update' : 'Submit') : 'Next'}
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

  const onShowModalApprove = () => {
    change('isApprove', false);

    const _errors = errors as any;

    if (Object.keys(_errors).length > 0) {
      return;
    }

    const id = 'modal';

    const onClose = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: `APPROVE USE OF ${tokenSelected?.symbol}`,
        modalProps: {
          centered: true,
          // size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <ModalConfirmApprove onApprove={onApprove} onClose={onClose} />
        ),
      }),
    );
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
