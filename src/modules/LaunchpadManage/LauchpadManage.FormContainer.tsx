/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LAUNCHPAD_FACTORY_ADDRESS } from '@/configs';
import useGetConfigLaunchpad, {
  ConfigLaunchpadResponse,
} from '@/hooks/contract-operations/launchpad/useGetConfigLaunchpad';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import useTCWallet from '@/hooks/useTCWallet';
import { ILaunchpad } from '@/interfaces/launchpad';
import { IToken } from '@/interfaces/token';
import { getListLiquidityToken, getListOwnerToken } from '@/services/launchpad';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import web3 from 'web3';
import LaunchpadFormStep1 from './LaunchpadFormStep1';
import LaunchpadManageHeader from './header';

export interface LaunchpadManageFormContainerProps {
  loading: boolean;
  setLoading: (_: boolean) => void;
  onSubmit: (_: any) => void;
  detail?: ILaunchpad;
}

const LaunchpadManageFormContainer: React.FC<LaunchpadManageFormContainerProps> = ({
  loading,
  setLoading,
  detail,
  onSubmit,
}) => {
  const [step, setStep] = useState(0);
  const [isApproveToken, setIsApproveToken] = useState<boolean>(true);
  const [isApproveAmountToken, setIsApproveAmountToken] = useState<string>('0');
  const [balanceToken, setBalanceToken] = useState<string>('0');
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [liquidTokens, setLiquidTokens] = useState<IToken[]>([]);
  const [launchpadConfigs, setLaunchpadConfigs] = useState<
    ConfigLaunchpadResponse | any
  >({});

  const { values } = useFormState();
  const { change } = useForm();
  const { tcWalletAddress: account, isAuthenticated: isActive } = useTCWallet();

  const { call: isApproved } = useIsApproveERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { call: getConfigLaunchpad } = useGetConfigLaunchpad();

  const tokenSelected: IToken | undefined = values?.launchpadTokenArg;

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
      return _isApprove;
    } catch (error) {
      console.log('error', error);
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
    if (tokenSelected) {
      checkTokenApprove(tokenSelected);
    }
  }, [JSON.stringify(tokenSelected), detail, values?.launchpadBalance]);

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
        getListLiquidityToken(),
        getConfigLaunchpad({}),
      ]);

      setTokens(response[0]);
      setLiquidTokens(response[1]);
      setLaunchpadConfigs(response[2]);
    } catch (error) {
      console.log('error', error);
    }
  };

  const renderContentByStep = () => {
    switch (step) {
      case 0:
        return <LaunchpadFormStep1 tokens={tokens} balanceToken={balanceToken} />;

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
      />
      {renderContentByStep()}
    </form>
  );
};

export default LaunchpadManageFormContainer;
