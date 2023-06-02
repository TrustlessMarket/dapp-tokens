/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LAUNCHPAD_FACTORY_ADDRESS } from '@/configs';
import { LAUNCHPAD_FORM_STEP } from '@/constants/storage-key';
import useGetConfigLaunchpad, {
  ConfigLaunchpadResponse,
} from '@/hooks/contract-operations/launchpad/useGetConfigLaunchpad';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import { ILaunchpad } from '@/interfaces/launchpad';
import { IToken } from '@/interfaces/token';
import { getListLiquidityToken, getListOwnerToken } from '@/services/launchpad';
import { camelCaseKeys, getLiquidityRatio } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import web3 from 'web3';
import LaunchpadFormStep1 from './LaunchpadFormStep1';
import LaunchpadFormStep2 from './LaunchpadFormStep2';
import LaunchpadFormStep3 from './LaunchpadFormStep3';
import LaunchpadManageHeader from './header';
import LaunchpadFormStep4 from './LaunchpadFormStep4';
import { useRouter } from 'next/router';

export interface LaunchpadManageFormContainerProps {
  loading: boolean;
  setLoading: (_: boolean) => void;
  onSubmit: (_: any) => void;
  setStep: (_: any) => void;
  detail?: ILaunchpad;
  step: number;
  error?: any;
}

export const steps = [{ title: 'Info' }, { title: 'Story of the Project' }];

export const extra_steps = [{ title: 'FAQs' }];

const LaunchpadManageFormContainer: React.FC<LaunchpadManageFormContainerProps> = ({
  loading,
  setLoading,
  detail,
  onSubmit,
  setStep,
  step,
  error,
}) => {
  const [isApproveToken, setIsApproveToken] = useState<boolean>(true);
  const [isApproveAmountToken, setIsApproveAmountToken] = useState<string>('0');
  const [balanceToken, setBalanceToken] = useState<string>('0');
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [liquidTokens, setLiquidTokens] = useState<IToken[]>([]);
  const [launchpadConfigs, setLaunchpadConfigs] = useState<
    ConfigLaunchpadResponse | any
  >({});

  const { values } = useFormState();
  const { change, initialize } = useForm();
  const { account, isActive } = useWeb3React();
  const router = useRouter();

  const { call: isApproved } = useIsApproveERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { call: getConfigLaunchpad } = useGetConfigLaunchpad();

  const [refSteps, setRefSteps] = useState(steps);

  const tokenSelected: IToken | undefined = values?.launchpadTokenArg;

  const cachedData = localStorage.getItem(LAUNCHPAD_FORM_STEP);

  const id = router.query?.id;

  const checkTokenApprove = async (token: IToken | any) => {
    try {
      const [_isApprove, _tokenBalance] = await Promise.all([
        isApproved({
          erc20TokenAddress: token.address,
          address: LAUNCHPAD_FACTORY_ADDRESS,
        }),
        tokenBalance({
          erc20TokenAddress: token.address,
        }),
      ]);
      setIsApproveAmountToken(web3.utils.fromWei(_isApprove));
      setBalanceToken(_tokenBalance);

      setIsApproveToken(
        checkBalanceIsApprove(
          web3.utils.fromWei(_isApprove),
          new BigNumber(values.launchpadBalance || '0')
            .plus(values.liquidityBalance || '0')
            .toString(),
        ),
      );

      return _isApprove;
    } catch (error) {
      console.log('_values error', error);
      throw error;
    }
  };

  const checkBalanceIsApprove = (required: any = 0, amount: any = 0) => {
    return required > 0 && new BigNumber(required).minus(amount).toNumber() >= 0;
  };

  const onApprove = async () => {
    try {
      setLoading(true);

      await requestApproveToken({
        address: tokenSelected?.address,
      });
      const _isApprove = await checkTokenApprove({
        address: tokenSelected?.address,
      });
      setIsApproveToken(
        checkBalanceIsApprove(web3.utils.fromWei(_isApprove), values?.liquidValue),
      );

      // toast.success('Transaction has been created. Please wait for few minutes.');
    } catch (err) {
      const message =
        (err as Error).message || 'Something went wrong. Please try again later.';
      // logErrorToServer({
      //   type: 'error',
      //   address: account,
      //   error: JSON.stringify(err),
      //   message: message,
      // });
      // toastError(showError, err, { address: account });
      // dispatch(updateCurrentTransaction(null));
    } finally {
      setLoading(false);
    }
  };

  const requestApproveToken = async (
    token: IToken | any,
    approveContract: string = LAUNCHPAD_FACTORY_ADDRESS,
  ) => {
    try {
      // dispatch(
      //   updateCurrentTransaction({
      //     id: transactionType.idoManage,
      //     status: TransactionStatus.info,
      //   }),
      // );

      const response: any = await approveToken({
        erc20TokenAddress: token.address,
        address: approveContract,
      });
      // dispatch(
      //   updateCurrentTransaction({
      //     status: TransactionStatus.success,
      //     id: transactionType.createPoolApprove,
      //     hash: response.hash,
      //     infoTexts: {
      //       success: `${token?.symbol} has been approved successfully.`,
      //     },
      //   }),
      // );
    } catch (error) {
      throw error;
    } finally {
    }
  };

  useEffect(() => {
    getTokens();
  }, [isActive, account]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (tokenSelected) {
      checkTokenApprove(tokenSelected);
    }
  }, [
    JSON.stringify(tokenSelected),
    detail,
    values?.launchpadBalance,
    values?.liquidityBalance,
    step,
    cachedData,
  ]);

  useEffect(() => {
    console.log('cachedData', cachedData);

    if (cachedData && !detail) {
      const parseCachedData: any = JSON.parse(cachedData);
      const _values = parseCachedData.values || {};

      const _step = parseCachedData.step;

      if (_step > 0 && _step < steps.length) {
        setStep(Number(_step));
      }

      initialize({
        ..._values,
      });
    }
  }, [cachedData, detail]);

  useEffect(() => {
    if (detail) {
      const duration = new BigNumber(detail.duration).div(24).div(3600).toNumber();

      const _refSteps = steps.concat(extra_steps);

      setRefSteps(_refSteps);

      const _faqs: any = {};
      if (detail.qandA) {
        for (let i = 0; i < JSON.parse(detail.qandA).length; i++) {
          const element = JSON.parse(detail.qandA)[i];
          _faqs[`faq_q_${i + 1}`] = element.value;
          _faqs[`faq_a_${i + 1}`] = element.label;
        }
      }

      initialize({
        launchpadTokenArg: detail.launchpadToken,
        liquidityTokenArg: detail.liquidityToken,
        launchpadBalance: detail.launchpadBalance,
        liquidityRatioArg: detail.liquidityRatio,
        goalBalance: detail.goalBalance,
        liquidityBalance: detail.liquidityBalance,
        startTimeArg: new Date(detail.launchStart),
        endTimeArg: new Date(detail.launchEnd),
        description: detail.description,
        video: detail.video,
        image: detail.image,
        duration: duration,
        steps: _refSteps,
        ..._faqs,
      });
    }
  }, [detail]);

  const getTokens = async () => {
    setTokens([]);
    if (!account || !isActive) {
      return;
    }
    try {
      const response = await Promise.all([
        getListOwnerToken({
          address: account,
          page: 1,
          limit: 9999,
        }),
      ]);

      setTokens(response[0]);
    } catch (error) {
      console.log('error', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await Promise.all([
        getListLiquidityToken(),
        getConfigLaunchpad({}),
      ]);

      setLiquidTokens(response[0]);
      setLaunchpadConfigs(response[1]);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (!id && liquidTokens.length > 0) {
      initialize({
        liquidityTokenArg: camelCaseKeys(liquidTokens[0]),
        steps: refSteps,
      });
    }
  }, [liquidTokens]);

  const renderContentByStep = () => {
    switch (step) {
      case 0:
        return (
          <LaunchpadFormStep1
            tokens={tokens}
            balanceToken={balanceToken}
            liquidTokens={liquidTokens}
            step={step}
            launchpadConfigs={launchpadConfigs}
            detail={detail}
            error={error}
          />
        );
      case 1:
        return (
          <LaunchpadFormStep2
            tokens={tokens}
            balanceToken={balanceToken}
            liquidTokens={liquidTokens}
            step={step}
            launchpadConfigs={launchpadConfigs}
            detail={detail}
          />
        );
      case 2:
        return (
          <LaunchpadFormStep3
            tokens={tokens}
            balanceToken={balanceToken}
            liquidTokens={liquidTokens}
            step={step}
            launchpadConfigs={launchpadConfigs}
            detail={detail}
          />
        );
      case 3:
        return (
          <LaunchpadFormStep4
            tokens={tokens}
            balanceToken={balanceToken}
            liquidTokens={liquidTokens}
            step={step}
            launchpadConfigs={launchpadConfigs}
            detail={detail}
          />
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <LaunchpadManageHeader
        step={step}
        loading={loading}
        setLoading={setLoading}
        onApprove={onApprove}
        isApproveToken={isApproveToken}
        setStep={setStep}
        steps={refSteps}
        detail={detail}
      />
      {renderContentByStep()}
    </form>
  );
};

export default LaunchpadManageFormContainer;
