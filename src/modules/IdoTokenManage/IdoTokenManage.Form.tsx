/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SocialToken from '@/components/Social';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import FieldDate from '@/components/Swap/form/fieldDate';
import FieldSelect from '@/components/Swap/form/fieldDropdown';
import WrapperConnected from '@/components/WrapperConnected';
import { ROUTE_PATH } from '@/constants/route-path';
import { IToken } from '@/interfaces/token';
import { getListTokenForIdo } from '@/services/ido';
import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils';
import { required } from '@/utils/formValidate';
import { Box, Flex, FormLabel, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import web3 from 'web3';

interface IdoTokenManageFormProps {
  handleSubmit?: (_: any) => void;
  loading?: boolean;
  detail?: any;
}

const IdoTokenManageForm: React.FC<IdoTokenManageFormProps> = ({
  handleSubmit,
  loading,
  detail,
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
        <Flex gap={10}>
          <Box flex={1}>
            <Box mb={4}>
              <FormLabel fontSize="xs" fontWeight="medium">
                Token
              </FormLabel>
              <Field
                name="token"
                options={tokens}
                children={FieldSelect}
                validate={required}
                disabled={detail}
              />
            </Box>
            <Field name="price" children={FieldAmount} label="Price" />
            <Box mb={4} />
            <Field
              validate={required}
              name="start_at"
              children={FieldDate}
              label="Start Date"
            />
            <Box mt={8}>
              <WrapperConnected type="submit" className="btn-submit">
                <FiledButton
                  isLoading={loading}
                  isDisabled={loading}
                  type="submit"
                  style={{ width: '100%' }}
                  processInfo={{
                    id: transactionType.idoManage,
                  }}
                >
                  {detail ? 'Update' : 'Submit'}
                </FiledButton>
              </WrapperConnected>
            </Box>
          </Box>
          <Box className="token-info" flex={1}>
            <Text as={'h6'}>Token information</Text>
            {tokenSelected && (
              <>
                {tokenSelected?.thumbnail && <img src={tokenSelected?.thumbnail} />}

                <Text>Name: {tokenSelected?.name}</Text>
                <Text>Symbol: {tokenSelected?.symbol}</Text>
                <Text>
                  Total Supply:{' '}
                  {formatCurrency(web3.utils.fromWei(tokenSelected?.totalSupply))}
                </Text>
                <Text>Description: {tokenSelected?.description}</Text>
                <Box>
                  <SocialToken socials={tokenSelected.social} />
                </Box>
                <Box mt={6} />
                <FiledButton
                  btnSize="l"
                  variant={'outline'}
                  style={{
                    color: colors.white,
                    fontSize: '16px',
                    backgroundColor: 'transparent',
                    borderColor: 'white',
                  }}
                  onClick={() =>
                    router.push(
                      `${ROUTE_PATH.UPDATE_TOKEN_INFO}?address=${tokenSelected?.address}`,
                    )
                  }
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
