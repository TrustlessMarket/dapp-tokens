/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import SocialToken from '@/components/Social';
import FiledButton from '@/components/Swap/button/filedButton';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import FieldSelect from '@/components/Swap/form/fieldDropdown';
import HorizontalItem from '@/components/Swap/horizontalItem';
import { TOKEN_ICON_DEFAULT } from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import { IToken } from '@/interfaces/token';
import { compareString, formatCurrency } from '@/utils';
import { composeValidators, required, requiredAmount } from '@/utils/formValidate';
import { Box, Flex, FormLabel, Spinner, Text } from '@chakra-ui/react';
import { px2rem } from '@trustless-computer/dapp-core';
import BigNumber from 'bignumber.js';
import { isEmpty, truncate } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import web3 from 'web3';
import { StyledLaunchpadFormStep1 } from './LaunchpadManage.styled';
import { LaunchpadManageHeaderProps } from './header';
import InfoTooltip from '@/components/Swap/infoTooltip';
import { colors } from '@/theme/colors';
import { ILaunchpad } from '@/interfaces/launchpad';
import tokenIcons from '@/constants/tokenIcons';

interface ILaunchpadFormStep1 {
  detail?: ILaunchpad;
  tokens: IToken[];
  liquidTokens: IToken[];
  balanceToken: string;
  step: number;
  launchpadConfigs: any;
}

const LaunchpadFormStep1: React.FC<ILaunchpadFormStep1> = ({
  detail,
  tokens,
  balanceToken,
  liquidTokens,
  launchpadConfigs,
}) => {
  const router = useRouter();
  const { values } = useFormState();
  const { change } = useForm();
  const tokenSelected: IToken | undefined = values?.launchpadTokenArg;
  const liquidityTokenSelected: IToken | undefined = values?.liquidityTokenArg;
  const [needLiquidBalance, setNeedLiquidBalance] = useState<string>('0');

  console.log('_values balanceToken', balanceToken);

  const validateAmount = useCallback(
    (_amount: any) => {
      if (!detail && Number(_amount) > Number(balanceToken)) {
        return `Max amount is ${formatCurrency(balanceToken)}`;
      }

      return undefined;
    },
    [values.launchpadBalance, tokenSelected, balanceToken, detail],
  );

  const validateMaxRatio = useCallback(
    (_amount: any) => {
      if (!detail || !detail.launchpad) {
        if (Number(_amount) > Number(90)) {
          return `Max liquidity reserve is ${90}%`;
        } else if (
          new BigNumber(needLiquidBalance)
            .plus(values.launchpadBalance)
            .gt(balanceToken)
        ) {
          return `Liquidity balance is ${formatCurrency(
            new BigNumber(balanceToken).minus(values.launchpadBalance).toString(),
          )} ${tokenSelected?.symbol || ''}`;
        }
      }

      return undefined;
    },
    [values.launchpadBalance, tokenSelected, detail, needLiquidBalance],
  );

  useEffect(() => {
    const multiX = new BigNumber(launchpadConfigs.liquidityPriceMultiple)
      .dividedBy(1000000)
      .toString();
    const launchpadBalance = values?.launchpadBalance || 0;
    const liquidityRatio = values?.liquidityRatioArg || 0;

    console.log('_values liquidityRatio', liquidityRatio);

    const _needLiquidBalance = new BigNumber(liquidityRatio)
      .dividedBy(100)
      .multipliedBy(launchpadBalance)
      .dividedBy(multiX)
      .toString();
    change('liquidityBalance', _needLiquidBalance);
    setNeedLiquidBalance(_needLiquidBalance);
  }, [
    values?.launchpadBalance,
    values?.liquidityRatioArg,
    launchpadConfigs.liquidityPriceMultiple,
  ]);

  console.log('tokens', tokens);

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
            validate={required}
            disabled={detail}
          />
        </Box>
        <Box mt={[6]} />
        <Field
          name="launchpadBalance"
          decimals={18}
          children={FieldAmount}
          label={`Rewards ${tokenSelected ? `(${tokenSelected.symbol})` : ''}`}
          disabled={detail?.launchpad}
          validate={composeValidators(requiredAmount, validateAmount)}
          rightLabel={
            !isEmpty(tokenSelected) &&
            !detail && (
              <Flex
                alignItems={'center'}
                gap={2}
                fontSize={px2rem(14)}
                color={'#FFFFFF'}
                mb={2}
              >
                <Flex gap={1} alignItems={'center'}>
                  Balance: {formatCurrency(balanceToken)}
                </Flex>
                <Text
                  cursor={'pointer'}
                  color={'#3385FF'}
                  onClick={() => change('launchpadBalance', balanceToken)}
                  bgColor={'rgba(51, 133, 255, 0.2)'}
                  borderRadius={'4px'}
                  padding={'1px 12px'}
                >
                  MAX
                </Text>
              </Flex>
            )
          }
        />
        <Box mb={6} />
        <Field
          name="goalBalance"
          decimals={18}
          children={FieldAmount}
          label={`Funding goal ${
            liquidityTokenSelected ? `(${liquidityTokenSelected.symbol})` : ''
          }`}
          disabled={detail?.launchpad}
          validate={composeValidators(requiredAmount, validateMaxRatio)}
        />
      </Box>
      <Box className="fields-right-container" flex={1}>
        <Box>
          <FormLabel fontSize="xs" fontWeight="medium">
            Liquidity
          </FormLabel>
          <Flex className="liquidity-container">
            {liquidTokens.length > 0 ? (
              liquidTokens.map((liq) => (
                <Flex
                  onClick={() => change('liquidityTokenArg', liq)}
                  className={`liquidity-item ${
                    compareString(liq.symbol, liquidityTokenSelected?.symbol)
                      ? 'active'
                      : ''
                  }`}
                  key={liq.symbol}
                >
                  <img src={tokenIcons[liq.symbol.toLowerCase()]} />
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
          name="liquidityRatioArg"
          decimals={18}
          children={FieldAmount}
          rightLabel={
            !isEmpty(tokenSelected) &&
            !detail && (
              <Flex
                alignItems={'center'}
                gap={2}
                fontSize={px2rem(14)}
                color={'#FFFFFF'}
                mb={2}
              >
                <Flex gap={1} alignItems={'center'}>
                  Liquidity balance: {formatCurrency(needLiquidBalance)}{' '}
                  {tokenSelected ? `${tokenSelected.symbol}` : ''}
                </Flex>
              </Flex>
            )
          }
          label={
            <InfoTooltip
              showIcon={true}
              label="Liquidity Reserve refers to a percentage of the funds that are used to add initial liquidity for trading purposes after the crowdfunding ends"
              iconColor={colors.white500}
            >
              Liquidity reserve
            </InfoTooltip>
          }
          disabled={detail?.launchpad}
          validate={composeValidators(requiredAmount, validateMaxRatio)}
        />
        <Box mb={6} />
        <Field
          name="duration"
          decimals={18}
          children={FieldAmount}
          label={`Duration`}
          validate={composeValidators(requiredAmount, validateMaxRatio)}
        />
      </Box>
      <Box className="token-info" flex={1}>
        <Text as={'h6'}>Token information's</Text>
        {tokenSelected && (
          <Flex
            justifyContent={'space-between'}
            flexDirection={'column'}
            height={'100%'}
          >
            <Box>
              <img
                src={tokenSelected?.thumbnail || TOKEN_ICON_DEFAULT}
                alt="token-avatar"
              />

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
            </Box>

            <Box>
              <Box mt={6} />
              <FiledButton
                btnSize="l"
                variant={'outline'}
                className="btn-update-info"
                onClick={() => {
                  router.push(
                    `${ROUTE_PATH.UPDATE_TOKEN_INFO}?address=${tokenSelected?.address}`,
                  );
                }}
              >
                Update token info
              </FiledButton>
            </Box>
          </Flex>
        )}
      </Box>
    </StyledLaunchpadFormStep1>
  );
};

export default LaunchpadFormStep1;
