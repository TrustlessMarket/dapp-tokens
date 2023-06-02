/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LAUNCHPAD_FORM_STEP } from '@/constants/storage-key';
import { WalletContext } from '@/contexts/wallet-context';
import useCreateLaunchpad from '@/hooks/contract-operations/launchpad/useCreate';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { ILaunchpad } from '@/interfaces/launchpad';
import { createLaunchpad, getDetailLaunchpad } from '@/services/launchpad';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { toast } from 'react-hot-toast';
import LaunchpadManageFormContainer from './LauchpadManage.FormContainer';
import { StyledLaunchpadManage } from './LaunchpadManage.styled';
import { ROUTE_PATH } from '@/constants/route-path';
import { filter } from 'lodash';

const LaunchpadManage = () => {
  const { getSignature } = useContext(WalletContext);
  const { account } = useWeb3React();

  const { run: createProposalLaunchpad } = useContractOperation({
    operation: useCreateLaunchpad,
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [detail, setDetail] = useState<ILaunchpad | undefined>(undefined);
  const [error, setMessageError] = useState('');

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
    setMessageError('');

    try {
      localStorage.setItem(
        LAUNCHPAD_FORM_STEP,
        JSON.stringify({
          step,
          values,
        }),
      );

      if ((values?.isLastStep || step > 1) && account) {
        setLoading(true);
        const tokenAddress = values?.launchpadTokenArg?.address;
        const liquidAddress = values?.liquidityTokenArg?.address;
        const signature = await getSignature(account);

        const seconds = new BigNumber(values.duration)
          .multipliedBy(24)
          .multipliedBy(3600)
          .toFixed(0);

        const faqs = filter(Object.keys(values), (v) => v?.includes('faq_q')).map(
          (v, i) => ({
            value: values?.[v],
            label: values?.[`faq_a_${i + 1}`],
          }),
        );

        const res = await createLaunchpad({
          user_address: account,
          video: values?.video,
          image: values?.image,
          description: values?.description,
          signature,
          qand_a: JSON.stringify(faqs),
          id: detail?.id,
          launchpad_token: tokenAddress,
          liquidity_token: liquidAddress,
          launchpad_balance: values.launchpadBalance,
          liquidity_balance: values.liquidityBalance,
          liquidity_ratio: values.liquidityRatioArg,
          goal_balance: values.goalBalance,
          threshold_balance: values.thresholdBalance || '0',
          duration: Number(seconds),
        });

        if (values.isCreateProposal && !detail) {
          await createProposalLaunchpad({
            launchpadTokenArg: tokenAddress,
            liquidityTokenArg: liquidAddress,
            liquidityRatioArg: values.liquidityRatioArg,
            durationArg: seconds,
            launchpadBalance: values.launchpadBalance,
            liquidityBalance: values.liquidityBalance,
            goalBalance: values.goalBalance,
            thresholdBalance: values.thresholdBalance || '0',
          });
        }

        if (!detail) {
          localStorage.removeItem(LAUNCHPAD_FORM_STEP);
          router.replace(ROUTE_PATH.LAUNCHPAD);
        }

        toast.success(`Submitted proposals successfully.`);
      }
      if (step < values.steps.length) {
        setStep((n) => n + 1);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
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
            error={error}
          />
        )}
      </Form>
    </StyledLaunchpadManage>
  );
};

export default LaunchpadManage;
