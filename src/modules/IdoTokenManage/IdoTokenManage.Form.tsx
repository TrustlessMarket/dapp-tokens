/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SocialToken from '@/components/Social';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import FieldDate from '@/components/Swap/form/fieldDate';
import FieldSelect from '@/components/Swap/form/fieldDropdown';
import HorizontalItem from '@/components/Swap/horizontalItem';
import WrapperConnected from '@/components/WrapperConnected';
import { TOKEN_ICON_DEFAULT } from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import { IToken } from '@/interfaces/token';
import { getListTokenForIdo } from '@/services/ido';
import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils';
import { required } from '@/utils/formValidate';
import { Box, Flex, FormLabel, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { truncate } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import web3 from 'web3';

interface IdoTokenManageFormProps {
  handleSubmit?: (_: any) => void;
  onClose: () => void;
  loading?: boolean;
  detail?: any;
  isRemove?: boolean;
}

const IdoTokenManageForm: React.FC<IdoTokenManageFormProps> = ({
  handleSubmit,
  loading,
  detail,
  onClose,
  isRemove,
}) => {
  const router = useRouter();

  const [tokens, setTokens] = useState<IToken[]>([]);
  const { account, isActive } = useWeb3React();

  const { values, submitting } = useFormState();
  const { change } = useForm();

  const tokenSelected: IToken | undefined = values?.token;

  useEffect(() => {
    if (detail) {
      change('id', detail.id);
      change('token', detail.token);
      change('price', detail.price);
      change('start_at', new Date(detail.startAt));
    }
  }, [detail]);

  useEffect(() => {
    getTokens();
  }, [isActive, account]);

  const getTokens = async () => {
    setTokens([]);
    if (!account || !isActive) {
      return;
    }
    try {
      const response = await getListTokenForIdo({
        owner: account,
        page: 1,
        limit: 9999,
      });
      setTokens(response);
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box className="form-container">
        <Flex gap={8}>
          <Flex flexDirection={'column'} justifyContent={'space-between'} flex={1}>
            <Box>
              <Box>
                <FormLabel fontSize="xs" fontWeight="medium">
                  Token
                </FormLabel>
                <Field
                  name="token"
                  options={tokens}
                  children={FieldSelect}
                  validate={required}
                  disabled={detail || isRemove}
                />
              </Box>
              <Box mb={6} />
              <Field
                name="price"
                decimals={18}
                children={FieldAmount}
                label="Price"
                disabled={isRemove}
              />
              <Box mb={6} />
              <Field
                validate={required}
                name="start_at"
                children={FieldDate}
                label="Start Date"
                disabled={isRemove}
              />
            </Box>

            <Box mt={8}>
              <WrapperConnected type="submit" className="btn-submit">
                <FiledButton
                  isLoading={loading}
                  isDisabled={loading}
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: isRemove
                      ? colors.redPrimary
                      : colors.bluePrimary,
                  }}
                  processInfo={{
                    id: transactionType.idoManage,
                  }}
                  btnSize="h"
                >
                  {isRemove ? 'Remove' : detail ? 'Update' : 'Submit'}
                </FiledButton>
              </WrapperConnected>
            </Box>
          </Flex>
          <Box className="token-info" flex={1}>
            <Text as={'h6'}>Token information</Text>
            {tokenSelected && (
              <>
                <img src={tokenSelected?.thumbnail || TOKEN_ICON_DEFAULT} />

                <Box>
                  <SocialToken theme="light" socials={tokenSelected.social} />
                </Box>

                <Box mt={6} />
                <HorizontalItem label={'Name'} value={tokenSelected?.name} />
                <Box mt={3} />
                <HorizontalItem label={'Symbol'} value={tokenSelected?.symbol} />
                <Box mt={3} />
                <HorizontalItem
                  label={'Total Supply'}
                  value={formatCurrency(
                    web3.utils.fromWei(tokenSelected?.totalSupply),
                  )}
                />
                <Box mt={3} />
                <HorizontalItem
                  label={'Description'}
                  value={truncate(tokenSelected?.description, {
                    length: 50,
                    separator: '...',
                  })}
                />

                <Box mt={6} />
                <FiledButton
                  btnSize="l"
                  variant={'outline'}
                  className="btn-update-info"
                  onClick={() => {
                    router.push(
                      `${ROUTE_PATH.UPDATE_TOKEN_INFO}?address=${tokenSelected?.address}`,
                    );
                    onClose();
                  }}
                >
                  Update token info
                </FiledButton>
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </form>
  );
};

export default IdoTokenManageForm;
