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
import { formatCurrency } from '@/utils';
import { composeValidators, required, requiredAmount } from '@/utils/formValidate';
import { Box, Flex, FormLabel, Text } from '@chakra-ui/react';
import { px2rem } from '@trustless-computer/dapp-core';
import BigNumber from 'bignumber.js';
import { isEmpty, truncate } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import web3 from 'web3';
import { StyledLaunchpadFormStep1 } from './LaunchpadManage.styled';
import { LaunchpadManageHeaderProps } from './header';

const LaunchpadFormStep1: React.FC<any> = ({
  detail,
  tokens,
  balanceToken,
  liquidTokens,
}) => {
  const router = useRouter();
  const { values } = useFormState();
  const { change } = useForm();
  const tokenSelected: IToken | undefined = values?.launchpadTokenArg;
  const liquidityTokenSelected: IToken | undefined = values?.liquidityTokenArg;
  const [needLiquidBalance, setNeedLiquidBalance] = useState<string>('0');

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
      <Box flex={1}></Box>
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
                value={formatCurrency(
                  web3.utils.fromWei(tokenSelected?.totalSupply),
                )}
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
