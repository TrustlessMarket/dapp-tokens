/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { StyledLaunchpadManage } from './LaunchpadManage.styled';
import LaunchpadManageHeader from './header';
import { Form } from 'react-final-form';
import LaunchpadFormStep1 from './LaunchpadFormStep1';
import LaunchpadManageFormContainer from './LauchpadManage.FormContainer';
import { LAUNCHPAD_FORM_STEP } from '@/constants/storage-key';
import useTCWallet from '@/hooks/useTCWallet';
import { WalletContext } from '@/contexts/wallet-context';
import BigNumber from 'bignumber.js';
import { createLaunchpad, getDetailLaunchpad } from '@/services/launchpad';
import { toast } from 'react-hot-toast';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useCreateLaunchpad from '@/hooks/contract-operations/launchpad/useCreate';
import { useRouter } from 'next/router';
import { ILaunchpad } from '@/interfaces/launchpad';

const LaunchpadManage = () => {
  const { getSignature } = useContext(WalletContext);
  const { tcWalletAddress: account } = useTCWallet();

  const { run: createProposalLaunchpad } = useContractOperation({
    operation: useCreateLaunchpad,
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [detail, setDetail] = useState<ILaunchpad | undefined>(undefined);

  const router = useRouter();
  const id = router.query?.id;

  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    if (!id) {
      return;
    }

    try {
      const response: any = await Promise.all([getDetailLaunchpad({ id: id })]);
      setDetail(response[0]);
    } catch (error) {}
  };

  const onSubmit = async (values: any) => {
    console.log('values', values);

    try {
      localStorage.setItem(
        LAUNCHPAD_FORM_STEP,
        JSON.stringify({
          step,
          values,
        }),
      );

      if (step === 0) {
        setStep(1);
      }

      if (values?.isLastStep && account) {
        setLoading(true);
        const tokenAddress = values?.launchpadTokenArg?.address;
        const liquidAddress = values?.liquidityTokenArg?.address;
        const signature = await getSignature({
          message: account,
          account,
        });

        const seconds = new BigNumber(values.duration)
          .multipliedBy(24)
          .multipliedBy(3600)
          .toFixed(0);

        const res = await createLaunchpad({
          user_address: account,
          video: values?.video,
          image: values?.image,
          description: values?.description,
          signature,
          // qand_a: JSON.stringify(faqs),
          id: detail?.id,
          launchpad_token: tokenAddress,
          liquidity_token: liquidAddress,
          launchpad_balance: values.launchpadBalance,
          liquidity_balance: values.liquidityBalance,
          liquidity_ratio: values.liquidityRatioArg,
          goal_balance: values.goalBalance,
          duration: Number(seconds),
        });

        if (values.isCreateProposal) {
          await createProposalLaunchpad({
            launchpadTokenArg: tokenAddress,
            liquidityTokenArg: liquidAddress,
            liquidityRatioArg: values.liquidityRatioArg,
            durationArg: seconds,
            launchpadBalance: values.launchpadBalance,
            goalBalance: values.goalBalance,
          });
          localStorage.removeItem(LAUNCHPAD_FORM_STEP);
        }

        toast.success(`Submitted proposals successfully.`);
      }
    } catch (error) {
      console.log('error', error);
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
            step={step}
            setStep={setStep}
            detail={detail}
          />
        )}
      </Form>
    </StyledLaunchpadManage>
  );
};

export default LaunchpadManage;
