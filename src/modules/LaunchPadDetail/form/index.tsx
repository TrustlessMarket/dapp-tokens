/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import CountDownTimer from '@/components/Countdown';
import ModalConfirmApprove from '@/components/ModalConfirmApprove';
import SocialToken from '@/components/Social';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import HorizontalItem from '@/components/Swap/horizontalItem';
import InfoTooltip from '@/components/Swap/infoTooltip';
import TokenBalance from '@/components/Swap/tokenBalance';
import WrapperConnected from '@/components/WrapperConnected';
import { CDN_URL } from '@/configs';
import {
  BRIDGE_SUPPORT_TOKEN,
  TRUSTLESS_BRIDGE,
  TRUSTLESS_FAUCET,
} from '@/constants/common';
import { toastError } from '@/constants/error';
import { AssetsContext } from '@/contexts/assets-context';
import useClaimLaunchPad from '@/hooks/contract-operations/launchpad/useClaim';
import useDepositPool from '@/hooks/contract-operations/launchpad/useDeposit';
import useEndLaunchPad from '@/hooks/contract-operations/launchpad/useEnd';
import useIsAbleRedeem from '@/hooks/contract-operations/launchpad/useIsAbleRedeem';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { ILaunchpad } from '@/interfaces/launchpad';
import { IToken } from '@/interfaces/token';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import {
  LAUNCHPAD_STATUS,
  LaunchpadLabelStatus,
  useLaunchPadStatus,
} from '@/modules/Launchpad/Launchpad.Status';
import { getLaunchpadUserDepositInfo, getUserBoost } from '@/services/launchpad';
import { logErrorToServer } from '@/services/swap';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { closeModal, openModal } from '@/state/modal';
import {
  requestReload,
  requestReloadRealtime,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { colors } from '@/theme/colors';
import { abbreviateNumber, compareString, formatCurrency } from '@/utils';
import { composeValidators, required } from '@/utils/formValidate';
import px2rem from '@/utils/px2rem';
import { showError } from '@/utils/toast';
import {
  Box,
  Center,
  Flex,
  forwardRef,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Field, Form, useForm, useFormState } from 'react-final-form';
import toast from 'react-hot-toast';
import { BiBell } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import Web3 from 'web3';
import styles from './styles.module.scss';
import useIsAbleEnd from '@/hooks/contract-operations/launchpad/useIsAbleEnd';
import useIsAbleClose from '@/hooks/contract-operations/launchpad/useIsAbleClose';
import useIsAbleVoteRelease from '@/hooks/contract-operations/launchpad/useIsAbleVoteRelease';
import useIsAbleCancel from '@/hooks/contract-operations/launchpad/useIsAbleCancel';
import useCancelLaunchPad from '@/hooks/contract-operations/launchpad/useCancel';

const FEE = 2;
export const MakeFormSwap = forwardRef((props, ref) => {
  const {
    onSubmit,
    submitting,
    poolDetail,
    isStarting,
    isEndLaunchpad,
    isClaimLaunchpad,
    isCancelLaunchpad,
  } = props;
  const [loading, setLoading] = useState(false);
  const [liquidityToken, setLiquidityToken] = useState<any>();
  const [launchpadToken, setLaunchpadToken] = useState<any>();
  const [amountBaseTokenApproved, setAmountBaseTokenApproved] = useState('0');
  const { call: isApproved } = useIsApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const [baseBalance, setBaseBalance] = useState<any>('0');
  const { juiceBalance, isLoadedAssets } = useContext(AssetsContext);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const dispatch = useDispatch();
  const router = useRouter();

  const { account } = useWeb3React();
  const needReload = useAppSelector(selectPnftExchange).needReload;

  const [status] = useLaunchPadStatus({ row: poolDetail });

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading || !liquidityToken;
  // const isRequireApprove =
  //   isAuthenticated &&
  //   new BigNumber(amountBaseTokenApproved || 0).lt(
  //     Web3.utils.toWei(`${values?.baseAmount || 0}`, 'ether'),
  //   );

  // console.log('values', values);
  // console.log('=====')

  const isRequireApprove = useMemo(() => {
    let result = false;
    try {
      result =
        isAuthenticated &&
        values?.baseAmount &&
        !isNaN(Number(values?.baseAmount)) &&
        new BigNumber(amountBaseTokenApproved || 0).lt(
          Web3.utils.toWei(`${values?.baseAmount || 0}`, 'ether'),
        );
    } catch (err: any) {
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
        place_happen: 'isRequireApprove',
      });
    }

    return result;
  }, [isAuthenticated, amountBaseTokenApproved, values?.baseAmount]);

  const percent = useMemo(() => {
    if (poolDetail?.id) {
      return new BigNumber(poolDetail?.totalValue)
        .div(poolDetail?.goalBalance)
        .multipliedBy(100)
        .toNumber();
    }

    return 0;
  }, [poolDetail?.id, needReload]);

  const onBaseAmountChange = useCallback(
    debounce((p) => handleBaseAmountChange(p), 1000),
    [],
  );

  useImperativeHandle(ref, () => {
    return {
      reset: reset,
    };
  });

  const reset = async () => {
    restart({
      baseToken: values?.baseToken,
      quoteToken: values?.quoteToken,
    });

    try {
      const [_baseBalance] = await Promise.all([
        getTokenBalance(values?.baseToken),
        // getTokenBalance(values?.quoteToken),
      ]);
      setBaseBalance(_baseBalance);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (poolDetail?.id) {
      setLiquidityToken(poolDetail?.liquidityToken);
      setLaunchpadToken(poolDetail?.launchpadToken);
      change('baseToken', poolDetail?.liquidityToken);
      change('quoteToken', poolDetail?.launchpadToken);
    }
  }, [poolDetail?.id]);

  useEffect(() => {
    change('baseBalance', baseBalance);
  }, [baseBalance]);

  useEffect(() => {
    if (account && liquidityToken?.address && poolDetail?.launchpad) {
      checkApproveBaseToken(liquidityToken);
    }
  }, [account, liquidityToken?.address, poolDetail?.launchpad]);

  const checkApproveBaseToken = async (token: any) => {
    const [_isApprove] = await Promise.all([checkTokenApprove(token)]);
    setAmountBaseTokenApproved(_isApprove);
  };

  const checkTokenApprove = async (token: IToken) => {
    try {
      const response = await isApproved({
        erc20TokenAddress: token.address,
        address: poolDetail?.launchpad,
      });
      return response;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  const getTokenBalance = async (token: IToken) => {
    try {
      const response = await tokenBalance({
        erc20TokenAddress: token.address,
      });
      return response;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  const requestApproveToken = async (token: IToken) => {
    try {
      dispatch(
        updateCurrentTransaction({
          id: transactionType.createPoolApprove,
          status: TransactionStatus.info,
        }),
      );
      const response: any = await approveToken({
        erc20TokenAddress: token.address,
        address: poolDetail?.launchpad,
      });
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.success,
          id: transactionType.createPoolApprove,
          hash: response.hash,
          infoTexts: {
            success: `${token.symbol} has been approved successfully. You can swap now!`,
          },
        }),
      );
    } catch (error) {
      throw error;
    } finally {
      // dispatch(updateCurrentTransaction(null));
    }
  };

  const validateBaseAmount = useCallback(
    (_amount: any) => {
      if (!_amount) {
        return undefined;
      }
      if (new BigNumber(_amount).lte(0)) {
        return `Required`;
      }
      if (new BigNumber(_amount).gt(baseBalance)) {
        return `Insufficient balance.`;
      }

      return undefined;
    },
    [values.baseAmount],
  );

  const onChangeValueBaseAmount = (amount: any) => {
    onBaseAmountChange({
      amount,
      poolDetail,
    });
  };

  const handleBaseAmountChange = ({
    amount,
    poolDetail,
  }: {
    amount: any;
    poolDetail: any;
  }) => {
    try {
      if (!amount || isNaN(Number(amount))) return;

      const quoteAmount = new BigNumber(amount)
        .div(new BigNumber(poolDetail?.totalValue || 0).plus(amount))
        .multipliedBy(poolDetail?.launchpadBalance || 0);
      change('quoteAmount', quoteAmount.toFixed());
    } catch (err: any) {
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
        place_happen: 'handleBaseAmountChange',
      });
    }
  };

  const handleChangeMaxBaseAmount = () => {
    change('baseAmount', baseBalance);
    onChangeValueBaseAmount(baseBalance);
  };

  const onShowModalApprove = () => {
    const id = 'modal';
    const onClose = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: `APPROVE USE OF ${liquidityToken?.symbol}`,
        className: styles.modalContent,
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

  const onApprove = async () => {
    try {
      setLoading(true);
      await requestApproveToken(liquidityToken);
      checkApproveBaseToken(liquidityToken);

      // toast.success('Transaction has been created. You can swap now!');
    } catch (err: any) {
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
      });
      toastError(showError, err, { address: account });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <Flex justifyContent={'space-between'}>
        <Stat className={styles.infoColumn}>
          <StatLabel>Funded</StatLabel>
          <StatNumber>
            <InfoTooltip
              label={`$${formatCurrency(poolDetail?.totalValueUsd || 0, 2)}`}
            >
              <Flex gap={1} alignItems={'center'}>
                <Flex gap={1} alignItems={"center"}>
                  {formatCurrency(poolDetail?.totalValue || 0)}{' '}
                  <img
                    src={
                      liquidityToken?.thumbnail ||
                      `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                    }
                    alt={liquidityToken?.thumbnail || 'default-icon'}
                    className={'token-avatar'}
                  />
                </Flex>
                <Text fontSize={'20px'} fontWeight={'400'}>
                  ({formatCurrency(percent, 2)}% funded)
                </Text>
              </Flex>
            </InfoTooltip>
          </StatNumber>
        </Stat>
        <Stat className={styles.infoColumn} textAlign={'left'}>
          <StatLabel>
            <Flex gap={1} justifyContent={"flex-end"}>
              <InfoTooltip
                showIcon={true}
                label="The minimum amount you would like to raise. If the crowdfunding does not reach the Funding Goal, the funded amount will be returned to the contributors"
              >
                {`Funding goal`}
              </InfoTooltip>
              /
              <InfoTooltip
                showIcon={true}
                label="The maximum amount you would like to raise. The crowdfunding will stop upon reaching its hard cap"
              >
                Hard Cap
              </InfoTooltip>
            </Flex>
          </StatLabel>
          <StatNumber>
            <Flex gap={1} justifyContent={"flex-end"}>
              <Flex gap={1} alignItems={"center"}>
                {formatCurrency(poolDetail?.goalBalance || 0)}
                <img
                  src={
                    liquidityToken?.thumbnail ||
                    `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                  }
                  alt={liquidityToken?.thumbnail || 'default-icon'}
                  className={'token-avatar'}
                />
              </Flex>
              /
              <Flex gap={1} alignItems={"center"}>
                {Number(poolDetail?.thresholdBalance || 0) > 0 ? (
                  <>
                    {formatCurrency(poolDetail?.thresholdBalance || 0)}{' '}
                    <img
                      src={
                        liquidityToken?.thumbnail ||
                        `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                      }
                      alt={liquidityToken?.thumbnail || 'default-icon'}
                      className={'token-avatar'}
                    />
                  </>
                ) : (
                  'N/A'
                )}
              </Flex>
            </Flex>
          </StatNumber>
        </Stat>
      </Flex>
      <Box className={styles.progressBar} mt={4}>
        <Progress
          w={['100%', '100%']}
          h="10px"
          value={percent}
          borderRadius={20}
        ></Progress>
        {/*<Image src={fireImg} className={styles.fireImg} />*/}
      </Box>
      <Flex gap={0} color={'#FFFFFF'} mt={8} direction={'column'}>
        <Flex gap={6} justifyContent={'space-between'}>
          <Stat className={styles.infoColumn} flex={1}>
            <StatLabel>
              <InfoTooltip
                showIcon={true}
                label="The total number of tokens that the contributors will receive after the crowdfunding ends."
              >
                {`Reward pool`}
              </InfoTooltip>
            </StatLabel>
            <StatNumber>
              {formatCurrency(poolDetail?.launchpadBalance || 0)}
            </StatNumber>
          </Stat>
          <Stat className={styles.infoColumn} flex={1}>
            <StatLabel>Backers</StatLabel>
            <StatNumber>
              {formatCurrency(poolDetail?.contributors || 0, 0)}
            </StatNumber>
          </Stat>
          <Stat className={styles.infoColumn} flex={1.5}>
            <StatLabel>
              {[LAUNCHPAD_STATUS.Pending].includes(status.key)
                ? 'Voting will start in'
                : [LAUNCHPAD_STATUS.Voting].includes(status.key)
                ? 'Voting will end in'
                : [
                    LAUNCHPAD_STATUS.NotPassed,
                    LAUNCHPAD_STATUS.Successful,
                    LAUNCHPAD_STATUS.Failed,
                    LAUNCHPAD_STATUS.End,
                  ].includes(status.key)
                ? 'Ended at'
                : 'Ends in'}
            </StatLabel>
            <StatNumber>
              <Text>
                {[LAUNCHPAD_STATUS.Pending].includes(status.key) ? (
                  <CountDownTimer end_time={poolDetail.voteStart} />
                ) : [LAUNCHPAD_STATUS.Voting].includes(status.key) ? (
                  <CountDownTimer end_time={poolDetail.voteEnd} />
                ) : [
                    LAUNCHPAD_STATUS.NotPassed,
                    LAUNCHPAD_STATUS.Successful,
                    LAUNCHPAD_STATUS.Failed,
                    LAUNCHPAD_STATUS.End,
                  ].includes(status.key) ? (
                  moment(poolDetail.launchEnd).format('LLL')
                ) : (
                  <CountDownTimer end_time={poolDetail.launchEnd} />
                )}
              </Text>
            </StatNumber>
          </Stat>
        </Flex>
      </Flex>
      {isStarting && (
        <InputWrapper
          className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
          theme="light"
          label={
            <Text fontSize={px2rem(14)} color={'#FFFFFF'}>
              Amount
            </Text>
          }
        >
          <Flex gap={4} direction={'column'}>
            <Field
              name="baseAmount"
              children={FieldAmount}
              validate={composeValidators(required, validateBaseAmount)}
              fieldChanged={onChangeValueBaseAmount}
              disabled={submitting}
              // placeholder={"Enter number of tokens"}
              decimals={liquidityToken?.decimal || 18}
              className={styles.inputAmount}
              prependComp={
                liquidityToken && (
                  <Flex gap={1} alignItems={'center'} color={'#FFFFFF'} paddingX={2}>
                    <img
                      src={
                        liquidityToken?.thumbnail ||
                        `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                      }
                      alt={liquidityToken?.thumbnail || 'default-icon'}
                      className={'avatar'}
                    />
                    <Text fontSize={'sm'}>{liquidityToken?.symbol}</Text>
                  </Flex>
                )
              }
              appendComp={
                liquidityToken && (
                  <Flex gap={2} fontSize={px2rem(14)} color={'#FFFFFF'}>
                    <Flex
                      gap={1}
                      alignItems={'center'}
                      color={'#B6B6B6'}
                      fontSize={px2rem(16)}
                      fontWeight={'400'}
                    >
                      Balance:
                      <TokenBalance
                        token={liquidityToken}
                        onBalanceChange={(_amount) => setBaseBalance(_amount)}
                      />
                      {liquidityToken?.symbol}
                    </Flex>
                    <Text
                      cursor={'pointer'}
                      color={'#3385FF'}
                      onClick={handleChangeMaxBaseAmount}
                      bgColor={'#2E2E2E'}
                      borderRadius={'4px'}
                      padding={'1px 12px'}
                      fontSize={px2rem(16)}
                      fontWeight={'600'}
                    >
                      Max
                    </Text>
                  </Flex>
                )
              }
              borderColor={'#353945'}
            />
          </Flex>
        </InputWrapper>
      )}

      {/*<Box mt={1}>
        <HorizontalItem
          label={
            <Text fontSize={'sm'} fontWeight={'medium'} color={'rgba(255, 255, 255, 0.7)'}>
              FEE: {FEE * (swapRoutes?.length || 1)}%
            </Text>
          }
        />
      </Box>*/}
      {/*{baseToken && quoteToken && values?.baseAmount && Number(exchangeRate) > 0 && (
        <Box mt={1}>
          <HorizontalItem
            label={
              <Text fontSize={'sm'} fontWeight={'medium'} color={'#FFFFFF'}>
                1 {quoteToken?.symbol} =&nbsp;
                {formatCurrency(exchangeRate.toString(), baseToken?.decimal || 18)}
                &nbsp;{baseToken?.symbol}
              </Text>
            }
          />
        </Box>
      )}*/}
      {values?.baseAmount && (
        <Box mt={1}>
          <HorizontalItem
            label={
              <Text fontSize={'sm'} color={'#B1B5C3'}>
                Estimate receive amount
              </Text>
            }
            value={
              <Text fontSize={'sm'} color={'#FFFFFF'}>
                {formatCurrency(values?.quoteAmount, 6)}{' '}
                {poolDetail?.launchpadToken?.symbol}
              </Text>
            }
          />
        </Box>
      )}
      {isAuthenticated &&
        isStarting &&
        isLoadedAssets &&
        new BigNumber(juiceBalance || 0).lte(0) && (
          <Flex gap={3} mt={2}>
            <Center
              w={'24px'}
              h={'24px'}
              borderRadius={'50%'}
              bg={'rgba(255, 126, 33, 0.2)'}
              as={'span'}
            >
              <BiBell color="#FF7E21" />
            </Center>
            <Text fontSize="sm" color="#FF7E21" textAlign={'left'}>
              Your TC balance is insufficient. You can receive free TC on our faucet
              site{' '}
              <Link
                href={TRUSTLESS_FAUCET}
                target={'_blank'}
                style={{ textDecoration: 'underline' }}
              >
                here
              </Link>
              .
            </Text>
          </Flex>
        )}
      {isAuthenticated &&
        isStarting &&
        liquidityToken &&
        BRIDGE_SUPPORT_TOKEN.includes(liquidityToken?.symbol) &&
        new BigNumber(baseBalance || 0).lte(0) && (
          <Flex gap={3} mt={2}>
            <Center
              w={'24px'}
              h={'24px'}
              borderRadius={'50%'}
              bg={'rgba(255, 126, 33, 0.2)'}
              as={'span'}
            >
              <BiBell color="#FF7E21" />
            </Center>
            <Text fontSize="sm" color="#FF7E21" textAlign={'left'}>
              Insufficient {liquidityToken?.symbol} balance! Consider swapping your{' '}
              {liquidityToken?.symbol?.replace('W', '')} to trustless network{' '}
              <Link
                href={`${TRUSTLESS_BRIDGE}${liquidityToken?.symbol
                  ?.replace('W', '')
                  ?.toLowerCase()}`}
                target={'_blank'}
                style={{ textDecoration: 'underline' }}
              >
                here
              </Link>
              .
            </Text>
          </Flex>
        )}
      {(isStarting || isEndLaunchpad || isClaimLaunchpad || isCancelLaunchpad) && (
        <WrapperConnected
          type={isRequireApprove ? 'button' : 'submit'}
          className={styles.submitButton}
        >
          {isRequireApprove ? (
            <FiledButton
              isLoading={loading}
              isDisabled={loading}
              loadingText="Processing"
              btnSize={'h'}
              containerConfig={{ flex: 1, mt: 6 }}
              onClick={onShowModalApprove}
              processInfo={{
                id: transactionType.createPoolApprove,
              }}
            >
              APPROVE USE OF {liquidityToken?.symbol}
            </FiledButton>
          ) : (
            <FiledButton
              isDisabled={submitting || btnDisabled}
              isLoading={submitting}
              type="submit"
              btnSize={'h'}
              containerConfig={{ flex: 1, mt: 6 }}
              loadingText={submitting ? 'Processing' : ' '}
              processInfo={{
                id: transactionType.depositLaunchpad,
              }}
              style={{
                backgroundColor: isClaimLaunchpad
                  ? colors.greenPrimary
                  : isEndLaunchpad
                  ? colors.redPrimary
                  : isCancelLaunchpad
                  ? colors.redPrimary
                  : colors.bluePrimary,
              }}
            >
              {isClaimLaunchpad
                ? 'CLAIM THIS PROJECT'
                : isEndLaunchpad
                ? 'END THIS PROJECT'
                : isCancelLaunchpad
                ? 'CANCEL THIS PROJECT'
                : 'BACK THIS PROJECT'}
            </FiledButton>
          )}
        </WrapperConnected>
      )}
      <Flex justifyContent={'flex-end'} mt={4}>
        <SocialToken socials={poolDetail?.launchpadToken?.social} />
      </Flex>
      {[LAUNCHPAD_STATUS.Pending].includes(status.key) ? (
        <Text mt={4} fontSize={px2rem(16)} fontWeight={'400'} color={'#FFFFFF'}>
          This project requires community votes to initiate crowdfunding. Please
          prepare your TM token to participate in the voting process.
        </Text>
      ) : [LAUNCHPAD_STATUS.Voting].includes(status.key) ? (
        <Text mt={4} fontSize={px2rem(16)} fontWeight={'400'} color={'#FFFFFF'}>
          If you enjoy this project, please show your support by voting for it.
        </Text>
      ) : [LAUNCHPAD_STATUS.Launching].includes(status.key) ? (
        <Text mt={4} fontSize={px2rem(16)} fontWeight={'400'} color={'#FFFFFF'}>
          All or nothing. This project will only be funded if it reaches its goal by{' '}
          <Text as={'span'} color={'#FF7E21'}>
            {moment
              .utc(poolDetail?.launchEnd)
              .format('ddd, MMMM Do YYYY HH:mm:ss Z')}
          </Text>
          .
        </Text>
      ) : (
        <></>
      )}
    </form>
  );
});

const BuyForm = ({ poolDetail }: { poolDetail: ILaunchpad }) => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account, isActive } = useWeb3React();
  const { run: depositLaunchpad } = useContractOperation({
    operation: useDepositPool,
  });
  const { call: endLaunchpad } = useEndLaunchPad();
  const { run: claimLaunchpad } = useContractOperation({
    operation: useClaimLaunchPad,
  });
  const { call: cancelLaunchpad } = useCancelLaunchPad();
  const { call: isAbleRedeem } = useIsAbleRedeem();
  const { call: isAbleEnd } = useIsAbleEnd();
  const { call: isAbleClose } = useIsAbleClose();
  const { call: isAbleVoteRelease } = useIsAbleVoteRelease();
  const { call: isAbleCancel } = useIsAbleCancel();

  const { mobileScreen } = useWindowSize();
  const [status] = useLaunchPadStatus({ row: poolDetail });
  const [canClaim, setCanClaim] = useState(false);
  const [canEnd, setCanEnd] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [canVoteRelease, setCanVoteRelease] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [userDeposit, setUserDeposit] = useState<any>();
  const [boostInfo, setBoostInfo] = useState<any>();

  console.log('poolDetail', poolDetail);
  console.log('canEnd', canEnd);
  console.log('canClaim', canClaim);
  console.log('canClose', canClose);
  console.log('canVoteRelease', canVoteRelease);
  console.log('canCancel', canCancel);
  console.log('userDeposit', userDeposit);
  console.log('boostInfo', boostInfo);
  console.log('=====');

  const isStarting = [LAUNCHPAD_STATUS.Launching].includes(status.key);

  useEffect(() => {
    if (![LAUNCHPAD_STATUS.Draft].includes(status.key)) {
      fetchData();
    }
  }, [account, isActive, JSON.stringify(poolDetail)]);

  const fetchData = async () => {
    try {
      const response: any = await Promise.all([
        isAbleEnd({
          launchpad_address: poolDetail.launchpad,
        }),
        isAbleClose({
          launchpad_address: poolDetail.launchpad,
        }),
        isAbleRedeem({
          user_address: account,
          launchpad_address: poolDetail.launchpad,
        }),
        isAbleVoteRelease({
          voter_address: account,
          launchpad_address: poolDetail.launchpad,
        }),
        isAbleCancel({
          launchpad_address: poolDetail.launchpad,
        }),
        getLaunchpadUserDepositInfo({
          pool_address: poolDetail?.launchpad,
          address: account,
        }),
        getUserBoost({
          address: account,
          pool_address: poolDetail?.launchpad,
        })
      ]);
      setCanEnd(response[0]);
      setCanClose(response[1]);
      setCanClaim(response[2]);
      setCanVoteRelease(response[3]);
      setCanCancel(
        response[4] &&
          compareString(poolDetail.creatorAddress, account) &&
          [LAUNCHPAD_STATUS.Pending].includes(poolDetail?.state),
      );
      setUserDeposit(response[5]);
      setBoostInfo(response[6]);
    } catch (error) {
      console.log('Launchpad detail form fetchData', error);
    }
  };

  const confirmDeposit = (values: any) => {
    const { baseAmount, quoteAmount, onConfirm } = values;
    const id = 'modalDepositConfirm';
    // const close = () => dispatch(closeModal({id}));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: canClaim
          ? 'Confirm claim this project'
          : canEnd
          ? 'Confirm end this project'
          : canCancel
          ? 'Delete my launchpad'
          : 'Confirm deposit',
        className: styles.modalContent,
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <Flex direction={'column'} gap={2}>
            {canClaim ? (
              <>
                <HorizontalItem
                  label={
                    <Text fontSize={'sm'} color={'#B1B5C3'}>
                      Deposit amount
                    </Text>
                  }
                  value={
                    <Text fontSize={'sm'}>
                      {formatCurrency(userDeposit?.amount || 0, 6)}{' '}
                      {poolDetail?.liquidityToken?.symbol}
                    </Text>
                  }
                />
                <HorizontalItem
                  label={
                    <Text fontSize={'sm'} color={'#B1B5C3'}>
                      Estimate receive amount
                    </Text>
                  }
                  value={
                    <Text fontSize={'sm'}>
                      {abbreviateNumber(userDeposit?.userLaunchpadBalance || 0)}{' '}
                      {poolDetail?.launchpadToken?.symbol}
                    </Text>
                  }
                />
              </>
            ) : canEnd ? (
              <Text>End this project?</Text>
            ) : canCancel ? (
              <Text>
                If you wish to delete your launchpad, click Confirm below and your
                tokens will be immediately returned to your account.
              </Text>
            ) : (
              <>
                <HorizontalItem
                  label={
                    <Text fontSize={'sm'} color={'#B1B5C3'}>
                      Deposit amount
                    </Text>
                  }
                  value={
                    <Text fontSize={'sm'}>
                      {formatCurrency(baseAmount, 6)}{' '}
                      {poolDetail?.liquidityToken?.symbol}
                    </Text>
                  }
                />
                <HorizontalItem
                  label={
                    <Text fontSize={'sm'} color={'#B1B5C3'}>
                      Estimate receive amount
                    </Text>
                  }
                  value={
                    <Text fontSize={'sm'}>
                      {formatCurrency(quoteAmount, 6)}{' '}
                      {poolDetail?.launchpadToken?.symbol}
                    </Text>
                  }
                />
              </>
            )}

            {/*<HorizontalItem
              label={
                <Text fontSize={'sm'} color={'#B1B5C3'}>
                  Slippage
                </Text>
              }
              value={<Text fontSize={'sm'}>{slippage}%</Text>}
            />
            <Flex
              gap={1}
              alignItems={slippage === 100 ? 'center' : 'flex-start'}
              mt={2}
            >
              <img
                src={`${CDN_URL}/icons/icon-information.png`}
                alt="info"
                style={{ width: 25, height: 25, minWidth: 25, minHeight: 25 }}
              />
              <Text
                fontSize="sm"
                color="brand.warning.400"
                textAlign={'left'}
                maxW={'500px'}
              >
                {slippage === 100
                  ? `Your current slippage is set at 100%. Trade at your own risk.`
                  : `Your slippage percentage of ${slippage}% means that if the price changes by ${slippage}%, your transaction will fail and revert. If you wish to change your slippage percentage, please close this confirmation popup and go to the top of the swap box where you can set a different slippage value.`}
              </Text>
            </Flex>*/}
            <FiledButton
              loadingText="Processing"
              btnSize={'h'}
              onClick={onConfirm}
              mt={4}
            >
              Confirm
            </FiledButton>
          </Flex>
        ),
      }),
    );
  };

  const handleSubmit = async (values: any) => {
    console.log('handleSubmit', values);
    const id = 'modalDepositConfirm';
    const close = () => dispatch(closeModal({ id }));

    confirmDeposit({
      ...values,
      onConfirm: () => {
        close();
        handleDeposit(values);
      },
    });
  };

  const handleDeposit = async (values: any) => {
    const { baseAmount } = values;

    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.info,
          id: transactionType.depositLaunchpad,
        }),
      );

      const data = {
        amount: baseAmount,
        launchpadAddress: poolDetail?.launchpad,
        boostRatio: '0',
        signature: '',
      };

      if (boostInfo) {
        data.boostRatio = boostInfo.boostSign;
        data.signature = boostInfo.adminSignature;
      }

      let response;
      if (canClaim) {
        response = await claimLaunchpad({
          launchpadAddress: poolDetail?.launchpad,
        });
      } else if (canEnd) {
        response = await endLaunchpad({
          launchpadAddress: poolDetail?.launchpad,
        });
      } else if (canCancel) {
        response = await cancelLaunchpad({
          launchpadAddress: poolDetail?.launchpad,
        });
      } else {
        response = await depositLaunchpad(data);
      }

      toast.success('Transaction has been created. Please wait for few minutes.');
      refForm.current?.reset();
      dispatch(requestReload());
      dispatch(requestReloadRealtime());
    } catch (err: any) {
      toastError(showError, err, { address: account });
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
      });
      // showError({
      //   message:
      //     (err as Error).message || 'Something went wrong. Please try again later.',
      // });
    } finally {
      setSubmitting(false);
      dispatch(updateCurrentTransaction(null));
    }
  };

  return (
    <Box className={styles.container}>
      <Form onSubmit={handleSubmit} initialValues={{}}>
        {({ handleSubmit }) => (
          <MakeFormSwap
            ref={refForm}
            onSubmit={handleSubmit}
            submitting={submitting}
            poolDetail={poolDetail}
            isEndLaunchpad={canEnd}
            isClaimLaunchpad={canClaim}
            isStarting={isStarting}
            isCancelLaunchpad={canCancel}
          />
        )}
      </Form>
    </Box>
  );
};

export default BuyForm;
