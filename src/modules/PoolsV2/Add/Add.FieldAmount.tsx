/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import { Box } from '@chakra-ui/react';
import React from 'react';
import s from './styles.module.scss';
import Empty from '@/components/Empty';
import { CDN_URL } from '@/configs';
import { Field } from 'react-final-form';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import { IToken } from '@/interfaces/token';
import AddTokenBalance from './Add.TokenBalance';
import AddItemToken from './Add.ItemToken';

interface IAddFieldAmount {
  isDisabledBaseAmount: boolean;
  fieldName: string;
  amountName: string;
  validate: any;
  fieldChanged: any;
  token: IToken;
}

const AddFieldAmount: React.FC<IAddFieldAmount> = ({
  isDisabledBaseAmount,
  fieldName,
  amountName,
  validate,
  fieldChanged,
  token,
}) => {
  return (
    <Box className={s.amountWrap}>
      {isDisabledBaseAmount ? (
        <Box className={s.amountWrap__locked}>
          <Empty
            src={`${CDN_URL}/icons/ic-locked-2.svg`}
            size={24}
            infoText="The market price is outside your specified price range. Single-asset deposit only."
          />
        </Box>
      ) : (
        <Field
          name={fieldName}
          children={FieldAmount}
          validate={validate}
          fieldChanged={fieldChanged}
          disabled={isDisabledBaseAmount}
          decimals={token?.decimal || 18}
          className={s.inputAmount}
          appendComp={
            token && (
              <>
                <AddItemToken token={token} hideName={true} />
              </>
            )
          }
          note={
            token && (
              <>
                <Box />
                <AddTokenBalance token={token} name={amountName} />
              </>
            )
          }
        />
      )}
    </Box>
  );
};

export default AddFieldAmount;
