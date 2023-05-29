/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {transactionType} from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import HorizontalItem from '@/components/Swap/horizontalItem';
import TokenBalance from '@/components/Swap/tokenBalance';
import WrapperConnected from '@/components/WrapperConnected';
import {CDN_URL} from '@/configs';
import {BRIDGE_SUPPORT_TOKEN, TRUSTLESS_BRIDGE, TRUSTLESS_FAUCET,} from '@/constants/common';
import {toastError} from '@/constants/error';
import {AssetsContext} from '@/contexts/assets-context';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import {IToken} from '@/interfaces/token';
import {TransactionStatus} from '@/interfaces/walletTransaction';
import {logErrorToServer} from '@/services/swap';
import {useAppDispatch, useAppSelector} from '@/state/hooks';
import {
  requestReload,
  requestReloadRealtime,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import {getIsAuthenticatedSelector} from '@/state/user/selector';
import {formatCurrency} from '@/utils';
import {composeValidators, required} from '@/utils/formValidate';
import px2rem from '@/utils/px2rem';
import {showError} from '@/utils/toast';
import {
  Box,
  Center,
  Flex,
  forwardRef,
  GridItem,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState,} from 'react';
import {Field, Form, useForm, useFormState} from 'react-final-form';
import toast from 'react-hot-toast';
import {useDispatch, useSelector} from 'react-redux';
import Web3 from 'web3';
import styles from './styles.module.scss';
import {BiBell} from 'react-icons/bi';
import {closeModal, openModal} from '@/state/modal';
import {useWindowSize} from '@trustless-computer/dapp-core';
import ModalConfirmApprove from '@/components/ModalConfirmApprove';
import {getUserBoost} from '@/services/launchpad';
import useDepositLaunchpad from '@/hooks/contract-operations/launchpad/useDeposit';
import SocialToken from '@/components/Social';
import moment from 'moment';
import useCountDownTimer from '@/hooks/useCountdown';
import {LAUNCHPAD_STATUS, useLaunchPadStatus,} from '@/modules/Launchpad/Launchpad.Status';
import useEndLaunchPad from '@/hooks/contract-operations/launchpad/useEnd';
import {colors} from '@/theme/colors';
import useClaimLaunchPad from '@/hooks/contract-operations/launchpad/useClaim';
import useIsAbleRedeem from '@/hooks/contract-operations/launchpad/useIsAbleRedeem';
import InfoTooltip from "@/components/Swap/infoTooltip";
import {IProposal} from "@/interfaces/proposal";
import {useProposalStatus} from "@/modules/Proposal/list/Proposal.Status";

const FEE = 2;
export const MakeFormSwap = forwardRef((props, ref) => {
  const {
    onSubmit,
    submitting,
    poolDetail,
    isStarting,
    isEndLaunchpad,
    isClaimLaunchpad,
    canClaim,
  } = props;
  const [loading, setLoading] = useState(false);
  const [baseToken, setBaseToken] = useState<any>();
  const [quoteToken, setQuoteToken] = useState<any>();
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
  const [boostInfo, setBoostInfo] = useState<any>();

  const [endTime, setEndTime] = useState(0);
  const [days, hours, minutes, seconds, expired] = useCountDownTimer(
    moment.unix(endTime).format('YYYY/MM/DD HH:mm:ss'),
  );

  const [status] = useLaunchPadStatus({ row: poolDetail });

  useEffect(() => {
    if (poolDetail?.id) {
      setEndTime(moment(poolDetail?.endTime).unix());
    }
  }, [poolDetail?.id]);

  useEffect(() => {
    if (expired && endTime) {
      dispatch(requestReload());
    }
  }, [expired]);

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading || !baseToken;
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

  const getBoostInfo = async () => {
    try {
      const response = await getUserBoost({
        address: account,
        pool_address: router?.query?.pool_address,
      });
      setBoostInfo(response);
      change('boostInfo', response);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (account && router?.query?.pool_address) {
      getBoostInfo();
    }
  }, [account, router?.query?.pool_address, needReload]);

  useEffect(() => {
    if (poolDetail?.id) {
      setBaseToken(poolDetail?.liquidityToken);
      setQuoteToken(poolDetail?.launchpadToken);
      change('baseToken', poolDetail?.liquidityToken);
      change('quoteToken', poolDetail?.launchpadToken);
    }
  }, [poolDetail?.id]);

  useEffect(() => {
    change('baseBalance', baseBalance);
  }, [baseBalance]);

  useEffect(() => {
    if (account && baseToken?.address) {
      checkApproveBaseToken(baseToken);
    }
  }, [account, baseToken?.address]);

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
        title: `APPROVE USE OF ${baseToken?.symbol}`,
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
      await requestApproveToken(baseToken);
      checkApproveBaseToken(baseToken);

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
      <Flex direction={'column'}>
        <Flex justifyContent={"space-between"}>
          <Stat className={styles.infoColumn}>
            <StatLabel>Funded</StatLabel>
            <StatNumber>
              <InfoTooltip label={`$${formatCurrency(poolDetail?.totalValueUsd || 0, 2)}`}>
                <Flex gap={1} alignItems={"center"}>
                  <Text>{formatCurrency(poolDetail?.totalValue || 0)} {baseToken?.symbol}</Text>
                  <Text fontSize={"20px"} fontWeight={"300"}>({formatCurrency(percent, 2)}% funded)</Text>
                </Flex>
              </InfoTooltip>
            </StatNumber>
          </Stat>
          <Stat className={styles.infoColumn} textAlign={"left"}>
            <StatLabel>Target</StatLabel>
            <StatNumber>
              {formatCurrency(poolDetail?.goalBalance || 0)} {baseToken?.symbol}
            </StatNumber>
          </Stat>
        </Flex>
        <Box className={styles.progressBar}>
          <Progress
            w={['100%', '100%']}
            h="12px"
            value={percent}
            borderRadius={20}
          >
          </Progress>
          {/*<Image src={fireImg} className={styles.fireImg} />*/}
        </Box>
      </Flex>
      <Flex gap={0} color={'#FFFFFF'} mt={4} direction={'column'}>
        <SimpleGrid columns={3} spacingX={6}>
          <GridItem>
            <Stat className={styles.infoColumn}>
              <StatLabel>Rewards</StatLabel>
              <StatNumber>
                {formatCurrency(poolDetail?.launchpadBalance || 0)}
              </StatNumber>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat className={styles.infoColumn}>
              <StatLabel>Backers</StatLabel>
              <StatNumber>
                {formatCurrency(poolDetail?.contributors || 0, 0)}
              </StatNumber>
            </Stat>
          </GridItem>
        </SimpleGrid>
        <Stat className={styles.infoColumn}>
          <StatLabel>
            {[
              LAUNCHPAD_STATUS.Closed,
              LAUNCHPAD_STATUS.Completed,
              LAUNCHPAD_STATUS.Failed,
            ].includes(status.key)
              ? 'Ended at'
              : 'Ends in'}
          </StatLabel>
          <StatNumber>
            <Text>
              {isEndLaunchpad
                ? moment(poolDetail.endTime).format('LLL')
                : `${
                    Number(days) > 0 && `${days}d :`
                  } ${hours}h : ${minutes}m : ${seconds}s`}
            </Text>
          </StatNumber>
        </Stat>
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
          rightLabel={
            baseToken && (
              <Flex gap={2} fontSize={px2rem(14)} color={'#FFFFFF'}>
                <Flex gap={1} alignItems={'center'}>
                  Balance:
                  <TokenBalance
                    token={baseToken}
                    onBalanceChange={(_amount) => setBaseBalance(_amount)}
                  />
                  {baseToken?.symbol}
                </Flex>
                {isStarting && (
                  <Text
                    cursor={'pointer'}
                    color={'#3385FF'}
                    onClick={handleChangeMaxBaseAmount}
                    bgColor={'rgba(51, 133, 255, 0.2)'}
                    borderRadius={'4px'}
                    padding={'1px 12px'}
                  >
                    MAX
                  </Text>
                )}
              </Flex>
            )
          }
        >
          <Flex gap={4} direction={'column'}>
            <Field
              name="baseAmount"
              children={FieldAmount}
              validate={composeValidators(required, validateBaseAmount)}
              fieldChanged={onChangeValueBaseAmount}
              disabled={submitting || !isStarting}
              // placeholder={"Enter number of tokens"}
              decimals={baseToken?.decimal || 18}
              className={styles.inputAmount}
              prependComp={
                baseToken && (
                  <Flex gap={1} alignItems={'center'} color={'#FFFFFF'} paddingX={2}>
                    <img
                      src={
                        baseToken?.thumbnail ||
                        `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                      }
                      alt={baseToken?.thumbnail || 'default-icon'}
                      className={'avatar'}
                    />
                    <Text fontSize={'sm'}>{baseToken?.symbol}</Text>
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
        baseToken &&
        BRIDGE_SUPPORT_TOKEN.includes(baseToken?.symbol) &&
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
              Insufficient {baseToken?.symbol} balance! Consider swapping your{' '}
              {baseToken?.symbol?.replace('W', '')} to trustless network{' '}
              <Link
                href={`${TRUSTLESS_BRIDGE}${baseToken?.symbol
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
            APPROVE USE OF {baseToken?.symbol}
          </FiledButton>
        ) : (
          <FiledButton
            isDisabled={submitting || btnDisabled || (!canClaim && isClaimLaunchpad)}
            isLoading={submitting}
            type="submit"
            btnSize={'h'}
            containerConfig={{ flex: 1, mt: 6 }}
            loadingText={submitting ? 'Processing' : ' '}
            processInfo={{
              id: transactionType.createPoolApprove,
            }}
            style={{
              backgroundColor: isEndLaunchpad
                ? isClaimLaunchpad
                  ? colors.greenPrimary
                  : colors.redPrimary
                : colors.bluePrimary,
            }}
          >
            {isEndLaunchpad
              ? isClaimLaunchpad
                ? 'CLAIM THIS PROJECT'
                : 'END THIS PROJECT'
              : 'BACK THIS PROJECT'}
          </FiledButton>
        )}
      </WrapperConnected>
      <Flex justifyContent={'flex-end'} mt={4}>
        <SocialToken socials={poolDetail?.launchpadToken?.social} />
      </Flex>
      <Text mt={4} fontSize={px2rem(20)} fontWeight={"300"} color={'#FFFFFF'}>
        All or nothing. This project will only be funded if it reaches its goal by{' '}
        {moment.utc(poolDetail?.endTime).format('ddd, MMMM Do YYYY HH:mm:ss Z')}.
      </Text>
    </form>
  );
});

const BuyForm = ({ proposalDetail }: { proposalDetail: IProposal }) => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account, isActive } = useWeb3React();
  const { run: depositLaunchpad } = useContractOperation({
    operation: useDepositLaunchpad,
  });
  const { run: endLaunchpad } = useContractOperation({
    operation: useEndLaunchPad,
  });
  const { run: claimLaunchpad } = useContractOperation({
    operation: useClaimLaunchPad,
  });
  const { call: isAbleRedeem } = useIsAbleRedeem();

  const { mobileScreen } = useWindowSize();
  const [status] = useProposalStatus({ row: proposalDetail });
  const [canClaim, setCanClaim] = useState(false);
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const poolDetail = proposalDetail?.userPool;

  const isEndLaunchpad = [
    LAUNCHPAD_STATUS.End,
    LAUNCHPAD_STATUS.Completed,
    LAUNCHPAD_STATUS.Failed,
  ].includes(status.key);

  const isClaimLaunchpad = [
    LAUNCHPAD_STATUS.Completed,
    LAUNCHPAD_STATUS.Failed,
  ].includes(status.key);

  const isStarting = [LAUNCHPAD_STATUS.Starting].includes(status.key);

  useEffect(() => {
    fetchData();
  }, [account, isActive, proposalDetail?.id, proposalDetail?.state, needReload]);

  const fetchData = async () => {
    try {
      // const response: any = await Promise.all(
      //   [
      //     isAbleRedeem({
      //       owner_address: account,
      //       launchpad_address: poolDetail.launchpad,
      //     }),
      //   ]);
      // setCanClaim(response[0]);
    } catch (error) {}
  };

  const confirmDeposit = (values: any) => {
    const { baseAmount, quoteAmount, onConfirm } = values;
    const id = 'modalDepositConfirm';
    // const close = () => dispatch(closeModal({id}));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: isEndLaunchpad
          ? isClaimLaunchpad
            ? 'Confirm claim this project'
            : 'Confirm end this project'
          : 'Confirm deposit',
        className: styles.modalContent,
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <Flex direction={'column'} gap={2}>
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
    const { boostInfo, baseAmount, quoteAmount, swapRoutes } = values;

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
      if (isClaimLaunchpad) {
        response = await claimLaunchpad({
          launchpadAddress: poolDetail?.launchpad,
        });
      } else if (isEndLaunchpad) {
        response = await endLaunchpad({
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
            proposalDetail={proposalDetail}
            isEndLaunchpad={isEndLaunchpad}
            isClaimLaunchpad={isClaimLaunchpad}
            isStarting={isStarting}
            canClaim={canClaim}
          />
        )}
      </Form>
    </Box>
  );
};

export default BuyForm;
