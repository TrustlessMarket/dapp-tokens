/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toastError } from '@/constants/error';
import { LAUNCHPAD_FORM_STEP } from '@/constants/storage-key';
import useGetConfigLaunchpad, {
  ConfigLaunchpadResponse,
} from '@/hooks/contract-operations/launchpad/useGetConfigLaunchpad';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import { IResourceChain } from '@/interfaces/chain';
import { ILaunchpad } from '@/interfaces/launchpad';
import { IToken } from '@/interfaces/token';
import { getListLiquidityToken, getListOwnerToken } from '@/services/launchpad';
import { useAppSelector } from '@/state/hooks';
import { currentChainSelector, selectPnftExchange } from '@/state/pnftExchange';
import { camelCaseKeys, getLaunchPadAddress } from '@/utils';
import { showError } from '@/utils/toast';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { toast } from 'react-hot-toast';
import web3 from 'web3';
import LaunchpadFormStep1 from './LaunchpadFormStep1';
import LaunchpadFormStep2 from './LaunchpadFormStep2';
import LaunchpadFormStep3 from './LaunchpadFormStep3';
import LaunchpadFormStep4 from './LaunchpadFormStep4';
import LaunchpadManageHeader from './header';

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

export const extra_steps = [{ title: 'FAQs' }, { title: 'Boost' }];

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

  const { values, errors } = useFormState();
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

  const currentChain: IResourceChain = useAppSelector(currentChainSelector);

  const checkTokenApprove = async (token: IToken | any) => {
    try {
      const [_isApprove, _tokenBalance] = await Promise.all([
        isApproved({
          erc20TokenAddress: token.address,
          address: getLaunchPadAddress(),
        }),
        tokenBalance({
          erc20TokenAddress: token.address,
        }),
      ]);
      setIsApproveAmountToken(web3.utils.fromWei(_isApprove));
      setBalanceToken(_tokenBalance);
      change('balanceToken', _tokenBalance);

      setIsApproveToken(
        checkBalanceIsApprove(
          web3.utils.fromWei(_isApprove),
          new BigNumber(values.launchpadBalance || '0')
            .multipliedBy(1.05)
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
    const hasApprove =
      required > 0 && new BigNumber(required).minus(amount).toNumber() >= 0;
    change('isApprove', hasApprove);
    return hasApprove;
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
        checkBalanceIsApprove(
          web3.utils.fromWei(_isApprove),
          new BigNumber(values.launchpadBalance || '0')
            .multipliedBy(1.05)
            .plus(values.liquidityBalance || '0')
            .toString(),
        ),
      );

      toast.success(
        'Your approval transaction has been added to the process list. You may now continue to submit your launchpad.',
      );
      change('isApprove', true);
    } catch (err) {
      const message =
        (err as Error).message || 'Something went wrong. Please try again later.';
      // logErrorToServer({
      //   type: 'error',
      //   address: account,
      //   error: JSON.stringify(err),
      //   message: message,
      // });
      toastError(showError, err, { address: account });
    } finally {
      setLoading(false);
    }
  };

  const requestApproveToken = async (
    token: IToken | any,
    approveContract?: string,
  ) => {
    const _approveContract = approveContract || getLaunchPadAddress();
    try {
      // dispatch(
      //   updateCurrentTransaction({
      //     id: transactionType.idoManage,
      //     status: TransactionStatus.info,
      //   }),
      // );

      const response: any = await approveToken({
        erc20TokenAddress: token.address,
        address: _approveContract,
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
    if (tokenSelected && currentChain?.chain) {
      checkTokenApprove(tokenSelected);
    }
  }, [
    JSON.stringify(tokenSelected),
    detail,
    values?.launchpadBalance,
    values?.liquidityBalance,
    step,
    cachedData,
    currentChain?.chain,
  ]);

  useEffect(() => {
    if (!detail) {
      if (cachedData) {
        const parseCachedData: any = JSON.parse(cachedData);
        const _values = parseCachedData.values || {};

        const _step = parseCachedData.step;

        if (_step > 0 && _step < steps.length) {
          setStep(Number(_step));
        }

        initialize({
          ..._values,
        });
      } else if (liquidTokens.length > 0) {
        initialize({
          liquidityTokenArg: camelCaseKeys(liquidTokens[0]),
          steps: refSteps,
        });
      }
    }
  }, [cachedData, detail, liquidTokens]);

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
        thresholdBalance: detail.thresholdBalance,
        startTimeArg: new Date(detail.launchStart),
        endTimeArg: new Date(detail.launchEnd),
        description: detail.description,
        twitterPostUrl: detail.twitterPostUrl,
        video: detail.video,
        image: detail.image,
        boost_url: detail.boostUrl,
        duration: duration,
        steps: _refSteps,
        detail: detail,
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
          network: currentChain?.chain?.toLowerCase(),
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
        getListLiquidityToken({ network: currentChain?.chain?.toLowerCase() }),
        getConfigLaunchpad({}),
      ]);

      setLiquidTokens(response[0]);
      setLaunchpadConfigs(response[1]);
    } catch (error) {
      console.log('error', error);
    }
  };

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
