/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import WrapperConnected from '@/components/WrapperConnected';
import { IToken } from '@/interfaces/token';
import { composeValidators, requiredAmount } from '@/utils/formValidate';
import { Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useForm, useFormState } from 'react-final-form';
import AddApproveToken from '../Add/Add.ApproveToken';
import AddConfirm from '../Add/Add.Confirm';
import AddFieldAmount from '../Add/Add.FieldAmount';
import sAdd from '../Add/styles.module.scss';
import {
  checkBalanceIsApprove,
  handleChangeAmount,
  validateBaseAmount,
  validateQuoteAmount,
} from '../utils';
import { forwardRef, useImperativeHandle } from 'react';

const IncreaseForm = forwardRef<any, any>(
  ({ positionDetail, handleSubmit, submitting }: any, ref) => {
    const { change, restart } = useForm();
    const { values } = useFormState();
    const baseToken: IToken = values?.baseToken;
    const quoteToken: IToken = values?.quoteToken;
    const currentTick: any = values?.currentTick;
    const tickLower: any = values?.tickLower;
    const tickUpper: any = values?.tickUpper;
    const maxPrice: any = values?.maxPrice;
    const minPrice: any = values?.minPrice;
    const currentPrice: any = values?.currentPrice;
    const baseAmount: any = values?.newBaseAmount || 0;
    const quoteAmount: any = values?.newQuoteAmount || 0;
    const baseTokenAmountApprove: string = values?.baseTokenAmountApprove || '0';
    const quoteTokenAmountApprove: string = values?.quoteTokenAmountApprove || '0';

    const isBaseTokenApprove = checkBalanceIsApprove(
      baseTokenAmountApprove,
      baseAmount,
    );

    const isQuoteTokenApprove = checkBalanceIsApprove(
      quoteTokenAmountApprove,
      quoteAmount,
    );

    const isTokenApproved = isBaseTokenApprove && isQuoteTokenApprove;

    const isDisabledBaseAmount = new BigNumber(maxPrice).lt(currentPrice);

    const isDisabledQuoteAmount = new BigNumber(minPrice).gt(currentPrice);

    useImperativeHandle(ref, () => {
      return {
        reset: () =>
          restart({
            ...values,
            newBaseAmount: '0',
            newQuoteAmount: '0',
          }),
      };
    });

    const onChangeBaseAmount = (_amount: any) => {
      const value = handleChangeAmount('baseAmount', {
        currentTick,
        tickLower,
        tickUpper,
        _amount,
      });

      change('newQuoteAmount', value);
    };

    const onChangeQuoteAmount = (_amount: any) => {
      const value = handleChangeAmount('quoteAmount', {
        currentTick,
        tickLower,
        tickUpper,
        _amount,
      });

      change('newBaseAmount', value);
    };

    return (
      <form onSubmit={handleSubmit}>
        <AddConfirm
          values={values as any}
          onClose={() => {
            //
          }}
        />
        <Box mt={5} />
        <Box className={sAdd.formContainer}>
          <Box className={sAdd.formContainer__left}>
            <InputWrapper label="Add more liquidity">
              <AddFieldAmount
                fieldName="newBaseAmount"
                amountName="baseToken"
                token={baseToken}
                validate={composeValidators(requiredAmount, validateBaseAmount)}
                fieldChanged={onChangeBaseAmount}
                isDisabledBaseAmount={isDisabledBaseAmount}
              />
              <Box mt={2} />
              <AddFieldAmount
                fieldName="newQuoteAmount"
                amountName="quoteToken"
                token={quoteToken}
                validate={composeValidators(requiredAmount, validateQuoteAmount)}
                fieldChanged={onChangeQuoteAmount}
                isDisabledBaseAmount={isDisabledQuoteAmount}
              />
            </InputWrapper>
          </Box>
          <WrapperConnected>
            <Box>
              {!isTokenApproved && (
                <AddApproveToken
                  token={isBaseTokenApprove ? quoteToken : baseToken}
                />
              )}

              <FiledButton
                isDisabled={!isTokenApproved || submitting}
                isLoading={submitting}
                className={
                  !isTokenApproved ? sAdd.formContainer__right__btnInActive : ''
                }
                type="submit"
                btnSize="h"
                processInfo={{
                  id: transactionType.createPool,
                }}
              >
                Preview
              </FiledButton>
            </Box>
          </WrapperConnected>
        </Box>
      </form>
    );
  },
);

export default IncreaseForm;
