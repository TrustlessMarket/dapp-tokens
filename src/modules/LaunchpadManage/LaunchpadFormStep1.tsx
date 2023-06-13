/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import SocialToken from '@/components/Social';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import FieldSelect from '@/components/Swap/form/fieldDropdown';
import HorizontalItem from '@/components/Swap/horizontalItem';
import InfoTooltip from '@/components/Swap/infoTooltip';
import { ILaunchpad } from '@/interfaces/launchpad';
import { IToken } from '@/interfaces/token';
import { colors } from '@/theme/colors';
import {
  calcLaunchpadInitialPrice,
  compareString,
  formatCurrency,
  getTokenIconUrl,
} from '@/utils';
import { isProduction } from '@/utils/commons';
import {
  composeValidators,
  isTwitter,
  required,
  requiredAmount,
} from '@/utils/formValidate';
import { Box, Divider, Flex, FormLabel, Spinner, Text } from '@chakra-ui/react';
import { px2rem } from '@trustless-computer/dapp-core';
import BigNumber from 'bignumber.js';
import { isEmpty, truncate } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import { StyledLaunchpadFormStep1 } from './LaunchpadManage.styled';
import { BsPencilFill } from 'react-icons/bs';
import { ROUTE_PATH } from '@/constants/route-path';
import FieldText from '@/components/Swap/form/fieldText';
import { TwitterShareButton } from 'react-share';
import { BiCheckShield } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '@/state/modal';
import LaunchpadFormStep1UpdateSocial from './LaunchpadFormStep1.UpdateSocial';

interface ILaunchpadFormStep1 {
  detail?: ILaunchpad;
  tokens: IToken[];
  liquidTokens: IToken[];
  balanceToken: string;
  step: number;
  launchpadConfigs: any;
  error: any;
}

const maxGoalBalance = (_amount: any, values: any, props: any) => {
  const isFirstDisabled = Boolean(values?.detail?.launchpad);
  if (!isFirstDisabled) {
    if (Number(_amount) > 0 && Number(_amount) <= Number(values.goalBalance)) {
      return `Hard cap is greater than Funding goal`;
    }
  }

  return undefined;
};

const validateAmount = (_amount: any, values: any) => {
  const isFirstDisabled = Boolean(values?.detail?.launchpad);
  const balanceToken: any = values?.balanceToken;
  const liquidityBalance: any = values?.liquidityBalance || '0';
  if (!isFirstDisabled) {
    if (
      new BigNumber(_amount)
        .multipliedBy(1.05)
        .plus(liquidityBalance)
        .gt(balanceToken)
    ) {
      return `Max amount is ${formatCurrency(
        new BigNumber(balanceToken)
          .minus(new BigNumber(balanceToken).multipliedBy(0.05).toString())
          .toString(),
      )}`;
    }
  }

  return undefined;
};

const validateDuration = (_amount: any, values: any) => {
  if (!values?.detail && Number(_amount) > Number(isProduction() ? 30 : 0.02)) {
    return `Max duration is ${formatCurrency(isProduction() ? 30 : 0.02)} day`;
  }

  return undefined;
};

const validateMaxRatio = (_amount: any, values: any) => {
  const isFirstDisabled = Boolean(values?.detail?.launchpad);
  const balanceToken: any = values?.balanceToken;
  const tokenSelected: IToken | undefined = values?.launchpadTokenArg;
  const launchpadBalance: any = values?.launchpadBalance || '0';
  const _launchpadBalance = new BigNumber(launchpadBalance)
    .multipliedBy(1.05)
    .toString();
  if (!isFirstDisabled) {
    if (new BigNumber(_amount).plus(_launchpadBalance).gt(balanceToken)) {
      return `Max Initial liquidity in token is ${formatCurrency(
        new BigNumber(balanceToken).minus(_launchpadBalance).toString(),
      )} ${tokenSelected?.symbol || ''}`;
    }
  }

  return undefined;
};

const validateMaxFundingRate = (_amount: any, values: any) => {
  const isFirstDisabled = Boolean(values?.detail?.launchpad);
  if (!isFirstDisabled) {
    if (new BigNumber(_amount).gt(90)) {
      return `Max Initial liquidity is 90%`;
    }
  }

  return undefined;
};

const minGoalBalance = (_amount: any, values: any) => {
  const detail = values?.detail;
  if (!detail || !detail.launchpad) {
    if (
      Number(values.thresholdBalance) > 0 &&
      Number(_amount) >= Number(values.thresholdBalance)
    ) {
      return `Funding goal is less than Hard cap`;
    }
  }

  return undefined;
};

const LaunchpadFormStep1: React.FC<ILaunchpadFormStep1> = ({
  detail,
  tokens,
  balanceToken,
  liquidTokens,
  launchpadConfigs,
  error,
}) => {
  const router = useRouter();
  const { values } = useFormState();
  const { change, initialize } = useForm();
  const tokenSelected: IToken | undefined = values?.launchpadTokenArg;
  const liquidityTokenSelected: IToken | undefined = values?.liquidityTokenArg;
  const [needLiquidBalance, setNeedLiquidBalance] = useState<string>('0');

  const isFirstDisabled = Boolean(detail?.launchpad);

  const dispatch = useDispatch();

  useEffect(() => {
    const multiX = new BigNumber(launchpadConfigs.rewardVoteRatio)
      .dividedBy(1000000)
      .toString();
    const launchpadBalance = values?.launchpadBalance || 0;
    const liquidityRatio = values?.liquidityRatioArg || 0;

    const _needLiquidBalance = new BigNumber(liquidityRatio)
      .dividedBy(100)
      .multipliedBy(launchpadBalance)
      .dividedBy(multiX)
      .toString();
    // change('liquidityBalance', _needLiquidBalance);
    setNeedLiquidBalance(_needLiquidBalance);
  }, [
    values?.launchpadBalance,
    values?.liquidityBalance,
    launchpadConfigs.rewardVoteRatio,
  ]);

  const onUpdateTokenSelect = (_tokenUpdate: IToken) => {
    console.log('_tokenUpdate', _tokenUpdate);

    change('launchpadTokenArg', _tokenUpdate);
  };

  const showFormUpdateTwitter = () => {
    const id = 'showFormUpdateTwitter';
    const onClose = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: `Update twitter url profile`,
        // className: styles.modalContent,
        modalProps: {
          centered: true,
          // size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <LaunchpadFormStep1UpdateSocial
            onClose={onClose}
            detail={tokenSelected}
            onUpdateTokenSelect={onUpdateTokenSelect}
          />
        ),
      }),
    );
  };

  return (
    <StyledLaunchpadFormStep1>
      <Box className="fields-left-container" flex={1}>
        <Box>
          <FormLabel fontSize="xs" fontWeight="medium">
            Token
          </FormLabel>
          <Field
            name="launchpadTokenArg"
            options={tokens}
            children={FieldSelect}
            validate={composeValidators(required)}
            disabled={detail}
          />
        </Box>
        <Box mt={[6]} />
        <Field
          name="launchpadBalance"
          decimals={18}
          children={FieldAmount}
          label={
            <InfoTooltip
              showIcon={true}
              label="The total number of tokens that the contributors will receive after the crowdfunding ends."
              iconColor={colors.white500}
            >
              {`Reward pool`}
            </InfoTooltip>
          }
          disabled={isFirstDisabled}
          validate={composeValidators(requiredAmount, validateAmount)}
          customMeta={{
            error,
            touched: Boolean(error),
          }}
          appendComp={<Text color={colors.white500}>{tokenSelected?.symbol}</Text>}
          rightLabel={
            !isEmpty(tokenSelected) && (
              <Flex
                alignItems={'center'}
                justifyContent={'flex-end'}
                gap={2}
                fontSize={px2rem(14)}
                color={'#FFFFFF'}
                mb={2}
              >
                <Flex
                  gap={1}
                  textAlign={'right'}
                  alignItems={'center'}
                  justifyContent={'flex-end'}
                >
                  Balance: {formatCurrency(balanceToken)}
                </Flex>
              </Flex>
            )
          }
          note={
            new BigNumber(values?.launchpadBalance)
              .dividedBy(balanceToken)
              .multipliedBy(100)
              .lte(10) && (
              <Text
                as={'div'}
                style={{
                  color: colors.redSecondary,
                  fontSize: 12,
                  lineHeight: `14px`,
                  marginTop: 10,
                  opacity: 0.8,
                }}
              >
                Warning: The reward pool amount you have entered is significantly
                lower than your total supply. Please verify this number again as it
                appears to be an unusual value
              </Text>
            )
          }
        />
        <Box mb={6} />
        <Field
          name="liquidityBalance"
          children={FieldAmount}
          customMeta={{
            error,
            touched: Boolean(error),
          }}
          appendComp={<Text color={colors.white500}>{tokenSelected?.symbol}</Text>}
          label={
            <InfoTooltip
              showIcon={true}
              label="The amount of your token that is used to add initial liquidity for trading purposes after the crowdfunding ends."
              iconColor={colors.white500}
            >
              Initial liquidity in token
            </InfoTooltip>
          }
          disabled={isFirstDisabled}
          validate={composeValidators(requiredAmount, validateMaxRatio)}
        />
        <Box mb={6} />
        <Field
          name="goalBalance"
          decimals={18}
          children={FieldAmount}
          label={
            <InfoTooltip
              showIcon={true}
              label="The minimum amount you would like to raise. If the crowdfunding does not reach the Funding Goal, the funded amount will be returned to the contributors"
              iconColor={colors.white500}
            >
              {`Funding goal ${
                liquidityTokenSelected ? `(${liquidityTokenSelected.symbol})` : ''
              }`}
            </InfoTooltip>
          }
          disabled={isFirstDisabled}
          validate={composeValidators(requiredAmount, minGoalBalance)}
          appendComp={
            <Text color={colors.white500}>{liquidityTokenSelected?.symbol}</Text>
          }
        />
        {tokenSelected && (
          <>
            <Box mb={6} />
            <Box>
              <FormLabel fontSize="xs" fontWeight="medium">
                <Flex alignItems={'center'} gap={1}>
                  <Text>Verify Twitter</Text>
                  {detail?.isVerifiedTwitter ? (
                    <BiCheckShield
                      style={{ fontSize: 18 }}
                      color={colors.bluePrimary}
                    />
                  ) : tokenSelected?.social?.twitter ? (
                    <TwitterShareButton
                      title="We are verifying our project on New Bitcoin DEX Launchpad"
                      url={`\n\nVerification code: ${tokenSelected?.verifyCode}\n\nSupport our project on:\nhttps://trustless.market/launchpad`}
                      className="btn-twitter-container"
                    >
                      Post verify
                    </TwitterShareButton>
                  ) : (
                    <Box
                      onClick={showFormUpdateTwitter}
                      className="btn-twitter-container"
                    >
                      Update twitter info
                    </Box>
                  )}
                </Flex>
              </FormLabel>
              <Field
                name="twitterPostUrl"
                placeholder="Enter twitter post url"
                children={FieldText}
                validate={composeValidators(required, isTwitter)}
                disabled={
                  detail?.isVerifiedTwitter ||
                  !tokenSelected?.social?.twitter
                }
              />
            </Box>
          </>
        )}
      </Box>
      <Box className="fields-right-container" flex={1}>
        <Box>
          <FormLabel fontSize="xs" fontWeight="medium">
            Funding token
          </FormLabel>
          <Flex className="liquidity-container">
            {liquidTokens.length > 0 ? (
              liquidTokens.map((liq) => (
                <Flex
                  onClick={
                    !isFirstDisabled
                      ? () => change('liquidityTokenArg', liq)
                      : undefined
                  }
                  className={`liquidity-item ${
                    compareString(liq.symbol, liquidityTokenSelected?.symbol)
                      ? 'active'
                      : ''
                  } ${isFirstDisabled ? 'disabled' : ''}`}
                  key={liq.symbol}
                >
                  <img src={getTokenIconUrl(liq)} />
                  <Text>{liq.symbol}</Text>
                </Flex>
              ))
            ) : (
              <Flex className="liquidity-item">
                <Spinner color={colors.white} />
              </Flex>
            )}
          </Flex>
        </Box>
        <Box mb={6} />
        <Field
          name="duration"
          decimals={18}
          children={FieldAmount}
          label={
            <InfoTooltip
              showIcon={true}
              label="The duration of your crowdfunding event"
              iconColor={colors.white500}
            >
              {`Duration`}
            </InfoTooltip>
          }
          validate={composeValidators(requiredAmount, validateDuration)}
          appendComp={<Text color={colors.white500}>Day</Text>}
          disabled={isFirstDisabled}
        />

        <Box mb={6} />
        <Field
          name="liquidityRatioArg"
          decimals={18}
          children={FieldAmount}
          appendComp={
            <Text color={colors.white500}>% ({liquidityTokenSelected?.symbol})</Text>
          }
          label={
            <InfoTooltip
              showIcon={true}
              label="The percentage of the total crowdfunded amount (in ETH or BTC) to add initial liquidity for trading purposes after the crowdfund ends"
              iconColor={colors.white500}
            >
              Initial liquidity
            </InfoTooltip>
          }
          disabled={isFirstDisabled}
          validate={composeValidators(requiredAmount, validateMaxFundingRate)}
        />
        <Box mb={6} />
        <Field
          name="thresholdBalance"
          decimals={18}
          children={FieldAmount}
          appendComp={
            <Text color={colors.white500}>{liquidityTokenSelected?.symbol}</Text>
          }
          label={
            <InfoTooltip
              showIcon={true}
              label="The maximum amount you would like to raise. The crowdfunding will stop upon reaching its hard cap"
              iconColor={colors.white500}
            >
              Hard cap
            </InfoTooltip>
          }
          disabled={isFirstDisabled}
          validate={composeValidators(maxGoalBalance)}
        />
      </Box>
      <Box className="token-info" flex={1}>
        <Text as={'h6'}>Token information</Text>
        {tokenSelected && (
          <Flex
            justifyContent={'space-between'}
            flexDirection={'column'}
            height={'100%'}
          >
            <Box>
              <Box className="token-avatar-edit">
                <img src={getTokenIconUrl(tokenSelected)} alt="token-avatar" />
                <Box
                  onClick={() =>
                    router.push(
                      `${ROUTE_PATH.UPDATE_TOKEN_INFO}?address=${tokenSelected.address}`,
                    )
                  }
                  title="Update token info"
                  className="update-info"
                >
                  <BsPencilFill attributeName="action" />
                </Box>
              </Box>

              <Box>
                <SocialToken theme="dark" socials={tokenSelected.social} />
              </Box>

              <Box mt={6} />
              <HorizontalItem
                className="horizontal-item"
                label={'Name'}
                value={tokenSelected?.name}
              />
              <Box mt={3} />
              <HorizontalItem
                className="horizontal-item"
                label={'Symbol'}
                value={tokenSelected?.symbol}
              />
              <Box mt={3} />
              <HorizontalItem
                label={'Total Supply'}
                className="horizontal-item"
                value={formatCurrency(tokenSelected?.totalSupply)}
              />
              <Box mt={3} />
              <HorizontalItem
                className="horizontal-item"
                label={'Description'}
                value={truncate(tokenSelected?.description, {
                  length: 50,
                  separator: '...',
                })}
              />
              <Divider borderColor={colors.white500} />
              <Box mt={3} />
              <HorizontalItem
                label={'Reward Pool'}
                className="horizontal-item"
                value={formatCurrency(values?.launchpadBalance || '0')}
              />
              <Box mt={3} />
              <HorizontalItem
                label={'Initial liquidity in token'}
                className="horizontal-item"
                value={
                  <>
                    <div>{`${formatCurrency(values?.liquidityBalance || '0')}`}</div>
                    <div className="note">{`(${formatCurrency(
                      new BigNumber(values?.liquidityBalance || '0')
                        .dividedBy(tokenSelected.totalSupply)
                        .multipliedBy(100)
                        .toFixed(),
                    )}% supply)`}</div>
                  </>
                }
              />
              <Box mt={3} />
              <HorizontalItem
                label={'Initial liquidity'}
                className="horizontal-item"
                value={
                  <>
                    <div>{`${formatCurrency(
                      new BigNumber(values?.goalBalance)
                        .multipliedBy(values?.liquidityRatioArg)
                        .dividedBy(100)
                        .toFixed(),
                    )} ${liquidityTokenSelected?.symbol}`}</div>
                    <div className="note">{`${formatCurrency(
                      values?.liquidityRatioArg || '0',
                    )}%`}</div>
                  </>
                }
              />
              <Box mt={3} />
              <HorizontalItem
                label={'Funding goal / Hard cap'}
                className="horizontal-item"
                value={`${formatCurrency(values?.goalBalance || '0')} / ${
                  !values?.thresholdBalance
                    ? '∞'
                    : formatCurrency(values?.thresholdBalance || '0')
                } ${liquidityTokenSelected?.symbol}`}
              />
              <Divider borderColor={colors.white500} />
              <Box mt={3} />
              <HorizontalItem
                label={
                  <InfoTooltip
                    showIcon
                    label={`The initial price is the price that will be set at the start of the public sale.`}
                  >
                    Initial price
                  </InfoTooltip>
                }
                className="horizontal-item"
                value={
                  <InfoTooltip
                    showIcon
                    label={`The initial price—set at the start of the public sale—is ${formatCurrency(
                      calcLaunchpadInitialPrice({
                        launchpadBalance: values?.launchpadBalance,
                        liquidityRatioArg: values?.liquidityRatioArg,
                        liquidityBalance: values?.liquidityBalance,
                      }),
                    )} times higher than the crowdfunding price.`}
                  >
                    <b>{`${formatCurrency(
                      calcLaunchpadInitialPrice({
                        launchpadBalance: values?.launchpadBalance,
                        liquidityRatioArg: values?.liquidityRatioArg,
                        liquidityBalance: values?.liquidityBalance,
                      }),
                    )}x Crowdfunding price`}</b>
                  </InfoTooltip>
                }
              />
            </Box>
          </Flex>
        )}
      </Box>
    </StyledLaunchpadFormStep1>
  );
};

export default LaunchpadFormStep1;
