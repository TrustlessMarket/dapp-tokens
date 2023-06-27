/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {
  BRIDGE_SUPPORT_TOKEN,
  TOKEN_ICON_DEFAULT,
  TRUSTLESS_BRIDGE,
  TRUSTLESS_GASSTATION,
  WETH_ADDRESS,
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
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { LAUNCHPAD_STATUS } from '@/modules/Launchpad/Launchpad.Status';
import {
  getDepositResultLaunchpad,
  getLaunchpadDepositAddress,
  getUserBoost,
  getVoteResultLaunchpad,
} from '@/services/launchpad';
import { logErrorToServer } from '@/services/swap';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { closeModal, openModal } from '@/state/modal';
import {
  requestReload,
  requestReloadRealtime,
  selectPnftExchange,
  updateCurrentChainId,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import {
  abbreviateNumber,
  compareString,
  formatCurrency,
  formatLongAddress,
  getTokenIconUrl,
  isConnectedTrustChain,
  isSupportedChain,
} from '@/utils';
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
  Tooltip,
} from '@chakra-ui/react';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import moment from 'moment';
import Link from 'next/link';
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
import useVoteReleaseLaunchpad from '@/hooks/contract-operations/launchpad/useVoteRelease';
import tokenIcons from '@/constants/tokenIcons';
import VoteForm from '@/modules/ProposalDetail/voteForm';
import { CDN_URL, TM_ADDRESS } from '@/configs';
import DepositEth from '@/modules/LaunchPadDetail/depositEth';
import ContributeForm from '@/modules/LaunchPadDetail/contributeForm';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { IoWarningOutline } from 'react-icons/io5';
import { CHAIN_ID_TO_NETWORK, NETWORK_TO_CHAIN_ID } from '@/constants/chains';
import { PREV_CHAIN_ID } from '@/constants/storage-key';

const CONTRIBUTION_METHODS = [
  {
    id: 'tc',
    title: 'From Your TC wallet',
    desc: '',
    img: `${CDN_URL}/pages/trustlessmarket/launchpad/ic-tc.png`,
  },
  {
    id: 'eth',
    title: 'From Ethereum wallet',
    desc: 'Transfer your funds from an Ethereum wallet or directly from an exchange.',
    img: `${CDN_URL}/pages/trustlessmarket/launchpad/ic-eth.png`,
  },
];

const ContributionMethods = (props: any) => {
  const { onSelect } = props;
  const { values } = useFormState();
  const selectId = values?.contributeMethod;
  const { account } = useWeb3React();

  return (
    <Flex gap={3} flexDirection={['column', 'row']}>
      {CONTRIBUTION_METHODS.map((method) => {
        return (
          <Flex
            key={method.id}
            flex={1}
            gap={3}
            onClick={() => {
              onSelect && onSelect(method.id);
            }}
            cursor={'pointer'}
            borderRadius={'8px'}
            bgColor={'#000000'}
            border={`1px solid ${selectId === method.id ? '#3385FF' : '#353945'}`}
            alignItems={'center'}
            paddingX={px2rem(20)}
            paddingY={px2rem(16)}
          >
            <img width={40} height={40} alt={'network'} src={method.img} />
            <Flex direction={'column'} flex={1} justifyContent={'flex-start'}>
              <Text color={'#FFFFFF'} fontSize={px2rem(20)} fontWeight={500}>
                {method.title}
              </Text>
              <Text
                color={'#FFFFFF'}
                fontSize={px2rem(14)}
                fontWeight={400}
                opacity={0.7}
                mt={1}
              >
                {method.desc
                  ? method.desc
                  : account
                  ? formatLongAddress(account)
                  : ''}
              </Text>
            </Flex>
            <img
              width={20}
              height={20}
              alt={'select'}
              src={`${CDN_URL}/pages/trustlessmarket/launchpad/${
                selectId === method.id ? 'ic-method-selected.png' : 'ic-method.png'
              }`}
            />
          </Flex>
        );
      })}
    </Flex>
  );
};

export const MakeFormSwap = forwardRef((props, ref) => {
  const {
    onSubmit,
    submitting,
    poolDetail,
    isCancelLaunchpad,
    isVoting,
    isFunding,
    isEndLaunchpad,
    isClaimLaunchpad,
    isVoteRelease,
    boostInfo,
  } = props;
  const [loading, setLoading] = useState(false);
  const [liquidityToken, setLiquidityToken] = useState<any>();
  const [launchpadToken, setLaunchpadToken] = useState<any>();
  const [amountLiquidityTokenApproved, setAmountLiquidityTokenApproved] =
    useState('0');
  const { call: isApproved } = useIsApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const [liquidityBalance, setLiquidityBalance] = useState<any>('0');
  const { juiceBalance, isLoadedAssets } = useContext(AssetsContext);
  const dispatch = useDispatch();

  const { account, isActive, chainId } = useWeb3React();
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const isLaunchpadCreator = compareString(poolDetail?.creatorAddress, account);
  const trustChain = isConnectedTrustChain();
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading || !liquidityToken;

  const isRequireApprove = useMemo(() => {
    let result = false;
    try {
      result =
        isAuthenticated &&
        values?.liquidityAmount &&
        !isNaN(Number(values?.liquidityAmount)) &&
        new BigNumber(amountLiquidityTokenApproved || 0).lt(
          Web3.utils.toWei(`${values?.liquidityAmount || 0}`, 'ether'),
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
  }, [isAuthenticated, amountLiquidityTokenApproved, values?.liquidityAmount]);

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
      liquidityToken: values?.liquidityToken,
      launchpadToken: values?.launchpadToken,
    });

    try {
      const [_baseBalance] = await Promise.all([
        getTokenBalance(values?.liquidityToken),
        // getTokenBalance(values?.launchpadToken),
      ]);
      setLiquidityBalance(_baseBalance);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (isSupportedChain(chainId)) {
      change(
        'contributeMethod',
        CHAIN_ID_TO_NETWORK[
          chainId || (localStorage.getItem(PREV_CHAIN_ID) as any)
        ] || 'tc',
      );
    }
  }, [chainId]);

  useEffect(() => {
    if (poolDetail?.id) {
      setLiquidityToken(poolDetail?.liquidityToken);
      setLaunchpadToken(poolDetail?.launchpadToken);
      change('liquidityToken', poolDetail?.liquidityToken);
      change('launchpadToken', poolDetail?.launchpadToken);
    }
  }, [poolDetail?.id]);

  useEffect(() => {
    change('liquidityBalance', liquidityBalance);
  }, [liquidityBalance]);

  useEffect(() => {
    if (account && liquidityToken?.address && poolDetail?.launchpad) {
      checkApproveBaseToken(liquidityToken);
      getLiquidityTokenBalance(liquidityToken);
    }
  }, [account, liquidityToken?.address, poolDetail?.launchpad]);

  const checkApproveBaseToken = async (token: any) => {
    const [_isApprove] = await Promise.all([checkTokenApprove(token)]);
    setAmountLiquidityTokenApproved(_isApprove);
  };

  const getLiquidityTokenBalance = async (token: any) => {
    const [_baseBalance] = await Promise.all([getTokenBalance(token)]);
    setLiquidityBalance(_baseBalance);
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
      if (new BigNumber(_amount).gt(liquidityBalance)) {
        return `Insufficient balance.`;
      }

      if (
        Number(poolDetail?.thresholdBalance || 0) > 0 &&
        new BigNumber(_amount)
          .plus(poolDetail?.totalValue)
          .gt(poolDetail?.thresholdBalance)
      ) {
        return `Total amount deposit greater than ${
          poolDetail?.thresholdBalance
        }. Max allow deposit is ${new BigNumber(poolDetail?.thresholdBalance)
          .minus(poolDetail?.totalValue)
          .toNumber()}`;
      }

      return undefined;
    },
    [values.liquidityAmount],
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

      const launchpadAmount = new BigNumber(amount)
        .div(new BigNumber(poolDetail?.totalValue || 0).plus(amount))
        .multipliedBy(poolDetail?.launchpadBalance || 0);
      change('launchpadAmount', launchpadAmount.toFixed());
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
    change('liquidityAmount', liquidityBalance);
    onChangeValueBaseAmount(liquidityBalance);
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

  const onSelectContributeMethod = (method: any) => {
    if (NETWORK_TO_CHAIN_ID?.[method]) {
      dispatch(updateCurrentChainId(NETWORK_TO_CHAIN_ID?.[method]));
    }

    change('contributeMethod', method);
  };

  const renderActionButtons = () => {
    return (
      <>
        {(isFunding ||
          isEndLaunchpad ||
          isClaimLaunchpad ||
          isCancelLaunchpad ||
          isVoteRelease ||
          isVoting) && (
          <>
            {isAuthenticated &&
              !trustChain &&
              values?.contributeMethod !== 'eth' && (
                <Flex
                  bg={'#FFFFFF'}
                  borderRadius={'8px'}
                  gap={2}
                  alignItems={'center'}
                  justifyContent={'center'}
                  p={2}
                  width={['100%', '80%']}
                  marginX={'auto'}
                >
                  <IoWarningOutline color="#FF7E21" fontSize={'20px'} />
                  <Text color={'#000000'}>
                    You must switch to{' '}
                    <Text as={'span'} color="#FF7E21" fontWeight={700}>
                      Trustless Computer Network
                    </Text>{' '}
                    to do action.
                  </Text>
                </Flex>
              )}
            <WrapperConnected
              type={isRequireApprove ? 'button' : 'submit'}
              className={styles.submitButton}
              forceSwitchChain={values?.contributeMethod !== 'eth'}
              // forceSwitchChain={
              //   chainId &&
              //   values?.contributeMethod !== 'eth' &&
              //   !compareString(
              //     NETWORK_TO_CHAIN_ID?.[values?.contributeMethod],
              //     chainId,
              //   )
              // }
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
                    backgroundColor: isEndLaunchpad
                      ? colors.redPrimary
                      : isClaimLaunchpad
                      ? colors.greenPrimary
                      : isCancelLaunchpad
                      ? colors.redPrimary
                      : isVoteRelease
                      ? colors.bluePrimary
                      : isVoting
                      ? colors.bluePrimary
                      : colors.bluePrimary,
                  }}
                >
                  {isEndLaunchpad
                    ? 'END THIS PROJECT'
                    : isClaimLaunchpad
                    ? 'CLAIM THIS PROJECT'
                    : isCancelLaunchpad
                    ? 'CANCEL THIS PROJECT'
                    : isVoteRelease
                    ? 'RELEASE VOTE'
                    : isVoting
                    ? 'SUPPORT THIS PROJECT'
                    : 'CONTRIBUTE TO THIS PROJECT'}
                </FiledButton>
              )}
            </WrapperConnected>
          </>
        )}
        {!isActive && isVoting && (
          <Text
            fontSize={px2rem(14)}
            fontWeight={'400'}
            color={'rgba(255, 255, 255, 0.7)'}
            textAlign={'center'}
            mt={2}
          >
            Connect a wallet to vote.
          </Text>
        )}
      </>
    );
  };

  if (
    [LAUNCHPAD_STATUS.Voting, LAUNCHPAD_STATUS.NotPassed].includes(poolDetail?.state)
  ) {
    return [LAUNCHPAD_STATUS.Voting].includes(poolDetail?.state) ||
      isEndLaunchpad ||
      isVoteRelease ? (
      <form onSubmit={onSubmit} style={{ height: '100%' }}>
        <Box mb={12}>{renderActionButtons()}</Box>
      </form>
    ) : (
      <></>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <Flex
        justifyContent={['flex-start', 'space-between']}
        flexDirection={['column', 'row']}
        gap={[4, 0]}
      >
        <Stat className={styles.infoColumn}>
          <StatLabel>Funded</StatLabel>
          <StatNumber>
            <InfoTooltip
              label={`$${formatCurrency(poolDetail?.totalValueUsd || 0, 2)}`}
            >
              <Flex gap={1} alignItems={'center'}>
                <Flex gap={1} alignItems={'center'}>
                  {formatCurrency(poolDetail?.totalValue || 0)}{' '}
                  <img
                    src={getTokenIconUrl(liquidityToken)}
                    alt={liquidityToken?.thumbnail || 'default-icon'}
                    className={'liquidity-token-avatar'}
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
            <Flex gap={1} justifyContent={['flex-start', 'flex-end']}>
              <InfoTooltip
                showIcon={true}
                label={`The minimum amount ${
                  isLaunchpadCreator ? 'you' : 'that the project'
                } would like to raise. If the crowdfunding does not reach the Funding Goal, the funded amount will be returned to the contributors`}
              >
                {`Funding goal`}
              </InfoTooltip>
              /
              <InfoTooltip
                showIcon={true}
                label={`The maximum amount ${
                  isLaunchpadCreator ? 'you' : 'that the project'
                } would like to raise. The crowdfunding will stop upon reaching its hard cap`}
              >
                Hard Cap
              </InfoTooltip>
            </Flex>
          </StatLabel>
          <StatNumber>
            <Flex gap={1} justifyContent={['flex-start', 'flex-end']}>
              <Flex gap={1} alignItems={'center'}>
                {formatCurrency(poolDetail?.goalBalance || 0)}
                <img
                  src={getTokenIconUrl(liquidityToken)}
                  alt={liquidityToken?.thumbnail || 'default-icon'}
                  className={'liquidity-token-avatar'}
                />
              </Flex>
              /
              <Flex gap={1} alignItems={'center'}>
                {Number(poolDetail?.thresholdBalance || 0) > 0 ? (
                  <>
                    {formatCurrency(poolDetail?.thresholdBalance || 0)}{' '}
                    <img
                      src={getTokenIconUrl(liquidityToken)}
                      alt={liquidityToken?.thumbnail || 'default-icon'}
                      className={'liquidity-token-avatar'}
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
      <Flex gap={6} color={'#FFFFFF'} mt={4} justifyContent={'space-between'}>
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
            <Tooltip label={formatCurrency(poolDetail?.launchpadBalance || 0)}>
              {abbreviateNumber(poolDetail?.launchpadBalance || 0)}
            </Tooltip>
          </StatNumber>
        </Stat>
        <Stat className={styles.infoColumn} flex={1} textAlign={'right'}>
          <StatLabel>Contributors</StatLabel>
          <StatNumber>{formatCurrency(poolDetail?.contributors || 0, 0)}</StatNumber>
        </Stat>
      </Flex>
      {isFunding && (
        <>
          {compareString(liquidityToken?.address, WETH_ADDRESS) ? (
            <Flex mt={4}>
              <Stat className={styles.infoColumn} flex={1}>
                <StatLabel>Contribution method</StatLabel>
                <StatNumber mt={2}>
                  <ContributionMethods onSelect={onSelectContributeMethod} />
                </StatNumber>
              </Stat>
            </Flex>
          ) : (
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
                  name="liquidityAmount"
                  children={FieldAmount}
                  validate={composeValidators(required, validateBaseAmount)}
                  fieldChanged={onChangeValueBaseAmount}
                  disabled={submitting}
                  // placeholder={"Enter number of tokens"}
                  decimals={liquidityToken?.decimal || 18}
                  className={styles.inputAmount}
                  prependComp={
                    liquidityToken && (
                      <Flex
                        gap={1}
                        alignItems={'center'}
                        color={'#FFFFFF'}
                        paddingX={2}
                      >
                        <img
                          src={tokenIcons[liquidityToken?.symbol?.toLowerCase()]}
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
                            onBalanceChange={(_amount) =>
                              setLiquidityBalance(_amount)
                            }
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
        </>
      )}
      {values?.liquidityAmount && (
        <Box mt={1}>
          <HorizontalItem
            label={
              <Text fontSize={'sm'} color={'#B1B5C3'}>
                Estimate receive amount
              </Text>
            }
            value={
              <Text fontSize={'sm'} color={'#FFFFFF'}>
                {formatCurrency(values?.launchpadAmount, 6)}{' '}
                {poolDetail?.launchpadToken?.symbol}
              </Text>
            }
          />
        </Box>
      )}
      {trustChain &&
        isAuthenticated &&
        isFunding &&
        isLoadedAssets &&
        values?.contributeMethod !== 'eth' &&
        new BigNumber(juiceBalance || 0).lte(0) && (
          <Flex gap={3} mt={4}>
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
              Your TC balance is insufficient. Buy more TC{' '}
              <Link
                href={TRUSTLESS_GASSTATION}
                target={'_blank'}
                style={{ textDecoration: 'underline' }}
              >
                here
              </Link>
              .
            </Text>
          </Flex>
        )}
      {trustChain &&
        isAuthenticated &&
        isFunding &&
        liquidityToken &&
        values?.contributeMethod !== 'eth' &&
        BRIDGE_SUPPORT_TOKEN.includes(liquidityToken?.symbol) &&
        new BigNumber(liquidityBalance || 0).lte(0) && (
          <Flex gap={3} mt={4}>
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
              You have an insufficient {liquidityToken?.symbol} balance. Consider
              swapping your {liquidityToken?.symbol?.replace('W', '')} to Trustless
              Network{' '}
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
      <Box mt={6}>{renderActionButtons()}</Box>
    </form>
  );
});

const BuyForm = ({ poolDetail }: { poolDetail: ILaunchpad }) => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const { account, chainId } = useWeb3React();
  const { run: depositLaunchpad } = useContractOperation({
    operation: useDepositPool,
  });
  const { run: endLaunchpad } = useContractOperation({
    operation: useEndLaunchPad,
  });
  const { run: claimLaunchpad } = useContractOperation({
    operation: useClaimLaunchPad,
  });
  const { run: voteReleaseLaunchpad } = useContractOperation({
    operation: useVoteReleaseLaunchpad,
  });
  const { call: cancelLaunchpad } = useCancelLaunchPad();
  const { call: isAbleRedeem } = useIsAbleRedeem();
  const { call: isAbleEnd } = useIsAbleEnd();
  const { call: isAbleClose } = useIsAbleClose();
  const { call: isAbleVoteRelease } = useIsAbleVoteRelease();
  const { call: isAbleCancel } = useIsAbleCancel();

  const { mobileScreen } = useWindowSize();
  const [canClaim, setCanClaim] = useState(false);
  const [canEnd, setCanEnd] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [canVoteRelease, setCanVoteRelease] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [boostInfo, setBoostInfo] = useState<any>();
  const [depositAddressInfo, setDepositAddressInfo] = useState<any>();
  const isLaunchpadCreator = compareString(poolDetail?.creatorAddress, account);

  const isFunding = [LAUNCHPAD_STATUS.Launching].includes(poolDetail?.state);
  const isVoting = [LAUNCHPAD_STATUS.Voting].includes(poolDetail?.state);

  // console.log('poolDetail', poolDetail);
  // console.log('canEnd', canEnd);
  // console.log('canClaim', canClaim);
  // console.log('canClose', canClose);
  // console.log('canVoteRelease', canVoteRelease);
  // console.log('canCancel', canCancel);
  // console.log('boostInfo', boostInfo);
  // console.log('depositAddressInfo', depositAddressInfo);
  // console.log('isLaunchpadCreator', isLaunchpadCreator);
  // console.log('=====');

  const votingToken = {
    address: TM_ADDRESS,
    thumbnail: 'https://i.ibb.co/TbshdC0/Icon-Token-TM-04.png',
    decimal: 18,
    symbol: 'TM',
  };

  useEffect(() => {
    if (![LAUNCHPAD_STATUS.Draft].includes(poolDetail?.state)) {
      fetchData();
    }
  }, [account, isAuthenticated, JSON.stringify(poolDetail)]);

  const fetchData = async () => {
    try {
      const [
        ableEnd,
        ableClose,
        ableRedeem,
        ableVoteRelease,
        ableCancel,
        userBoost,
        depositAddress,
        voteResults,
        depositResults,
      ] = await Promise.all([
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
        getUserBoost({
          address: account,
          pool_address: poolDetail?.launchpad,
        }),
        getLaunchpadDepositAddress({
          network: 'ethereum',
          address: account,
          launchpad_id: poolDetail?.id,
        }),
        getVoteResultLaunchpad({
          pool_address: poolDetail?.launchpad,
        }),
        getDepositResultLaunchpad({
          pool_address: poolDetail?.launchpad,
        }),
      ]);

      setCanEnd(
        ableEnd &&
          (isLaunchpadCreator ||
            voteResults?.voters?.some((voter: any) =>
              compareString(voter?.voter, account),
            ) ||
            depositResults?.some((depositer: any) =>
              compareString(depositer?.userAddress, account),
            )),
      );
      setCanClose(ableClose);
      setCanClaim(ableRedeem);
      setCanVoteRelease(ableVoteRelease);
      setCanCancel(
        ableCancel &&
          isLaunchpadCreator &&
          [LAUNCHPAD_STATUS.Pending].includes(poolDetail?.state),
      );
      setBoostInfo(userBoost);

      setDepositAddressInfo(depositAddress);
    } catch (error) {
      console.log('Launchpad detail form fetchData', error);
    }
  };

  const getConfirmTitle = () => {
    return canEnd
      ? isLaunchpadCreator
        ? 'Close My Launchpad'
        : 'Close Launchpad'
      : canClaim
      ? [LAUNCHPAD_STATUS.Failed].includes(poolDetail?.state)
        ? 'Claim your Funds'
        : 'Claim your Reward'
      : canCancel
      ? 'Delete my launchpad'
      : canVoteRelease
      ? 'Release vote token'
      : 'Confirm deposit';
  };

  const getConfirmContent = (values: any) => {
    const { liquidityAmount, launchpadAmount, onConfirm } = values;
    return (
      <Flex direction={'column'} gap={2}>
        {canEnd ? (
          <Box>
            {isLaunchpadCreator
              ? 'If you wish to close your launchpad, click Confirm below and your tokens will be immediately returned to your account.'
              : 'If you wish to close this launchpad, click Confirm below.'}
          </Box>
        ) : canClaim ? (
          <Box>
            {[LAUNCHPAD_STATUS.Failed].includes(poolDetail?.state)
              ? 'The launchpad did not reach the funding goal. Click Claim your Funds to get your funds back.'
              : 'Congratulations! The launchpad has achieved its funding goal. Please click on "Claim" to receive your reward.'}
          </Box>
        ) : canCancel ? (
          <Text>
            If you wish to delete your launchpad, click Confirm below and your tokens
            will be immediately returned to your account.
          </Text>
        ) : canVoteRelease ? (
          <Text>Release launchpad to get back voting token.</Text>
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
                  {formatCurrency(liquidityAmount, 6)}{' '}
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
                  {formatCurrency(launchpadAmount, 6)}{' '}
                  {poolDetail?.launchpadToken?.symbol}
                </Text>
              }
            />
          </>
        )}
        <FiledButton
          loadingText="Processing"
          btnSize={'h'}
          onClick={onConfirm}
          mt={4}
        >
          {canClaim ? (
            <>
              {[LAUNCHPAD_STATUS.Failed].includes(poolDetail?.state)
                ? 'Claim your Funds'
                : 'Claim'}
            </>
          ) : (
            'Confirm'
          )}
        </FiledButton>
      </Flex>
    );
  };

  const confirmVoting = (values: any) => {
    const id = 'modalVoteConfirm';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Support this Project',
        className: styles.modalContent,
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <Flex>
            <VoteForm
              poolDetail={poolDetail}
              votingToken={votingToken}
              onClose={close}
            />
          </Flex>
        ),
      }),
    );
  };

  const showContributeFromEthWallet = () => {
    const id = 'modalDepositEthFromEthWallet';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Project Contribution',
        className: cx(styles.modalContent, styles.hideCloseButton),
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => {
          return (
            <DepositEth
              onClose={close}
              address={depositAddressInfo?.depositAddress}
            />
          );
        },
      }),
    );
  };

  const showContributeFromTCWallet = () => {
    const id = 'modalDepositEthFromTCWallet';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Project Contribution',
        className: cx(styles.modalContent, styles.modalDeposit),
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => {
          return (
            <ContributeForm
              poolDetail={poolDetail}
              boostInfo={boostInfo}
              onClose={close}
            />
          );
        },
      }),
    );
  };

  const handleSubmit = async (values: any) => {
    const liquidityToken = poolDetail?.liquidityToken;

    if (
      [LAUNCHPAD_STATUS.Launching].includes(poolDetail?.state) &&
      moment(poolDetail.launchEnd).subtract('1', 'h').isSameOrBefore(moment())
    ) {
      toast.error('Sorry! The time to contribute has ended.');
      return;
    }

    if ([LAUNCHPAD_STATUS.Voting].includes(poolDetail?.state)) {
      confirmVoting(values);
    } else if (
      [LAUNCHPAD_STATUS.Launching].includes(poolDetail?.state) &&
      compareString(liquidityToken?.address, WETH_ADDRESS)
    ) {
      const { contributeMethod } = values;

      if (contributeMethod === 'eth') {
        showContributeFromEthWallet();
      } else {
        showContributeFromTCWallet();
      }
    } else {
      confirmDeposit(values);
    }
  };

  const confirmDeposit = (values: any) => {
    const id = 'modalDepositConfirm';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: getConfirmTitle(),
        className: styles.modalContent,
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => {
          return getConfirmContent({
            ...values,
            onConfirm: () => {
              close();
              handleDeposit(values);
            },
          });
        },
      }),
    );
  };

  const handleDeposit = async (values: any) => {
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.info,
          id: transactionType.depositLaunchpad,
        }),
      );

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
      } else if (canVoteRelease) {
        response = await voteReleaseLaunchpad({
          launchpadAddress: poolDetail?.launchpad,
        });
      } else {
        const { liquidityAmount } = values;
        const data = {
          amount: liquidityAmount,
          launchpadAddress: poolDetail?.launchpad,
          boostRatio: '0',
          signature: '',
          onBehalf: account,
        };

        if (boostInfo) {
          data.boostRatio = boostInfo.boostSign;
          data.signature = boostInfo.adminSignature;
        }
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
      <Form
        onSubmit={handleSubmit}
        initialValues={{
          contributeMethod:
            CHAIN_ID_TO_NETWORK[
              chainId || (localStorage.getItem(PREV_CHAIN_ID) as any)
            ] || (mobileScreen ? 'eth' : 'tc'),
        }}
      >
        {({ handleSubmit }) => (
          <MakeFormSwap
            ref={refForm}
            onSubmit={handleSubmit}
            submitting={submitting}
            poolDetail={poolDetail}
            isCancelLaunchpad={canCancel}
            isVoting={isVoting}
            isFunding={isFunding}
            isEndLaunchpad={canEnd}
            isClaimLaunchpad={canClaim}
            isVoteRelease={canVoteRelease}
            boostInfo={boostInfo}
          />
        )}
      </Form>
    </Box>
  );
};

export default BuyForm;
