/* eslint-disable @typescript-eslint/no-explicit-any */
import FormFieldInputAmount from '@/components/FormField/FormField.InputAmount';
import FormFieldSelect from '@/components/FormField/FormField.Select';
import HorizontalItem from '@/components/HorizontalItem';
import Text from '@/components/Text';
import WrapperConnected from '@/components/WrapperConnected';
import pairsMock from '@/dataMock/tokens.json';
import { IToken } from '@/interfaces/token';
import { camelCaseKeys } from '@/utils';
import { Field, useFormikContext } from 'formik';
import React, { useState } from 'react';

interface AddPoolFormProps {
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
}

const AddPoolsForm: React.FC<AddPoolFormProps> = ({ handleSubmit }) => {
  const { values } = useFormikContext() as { values: any };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pairs, setPairs] = useState<IToken[]>(camelCaseKeys(pairsMock));

  const convertOptions = (_pairs: IToken[]) => {
    return _pairs.map((p) => ({ ...p, label: p.name, value: p.address }));
  };

  return (
    <form onSubmit={handleSubmit} className="form-wrap">
      <label>Select Pair</label>
      <div className="row">
        <Field
          component={FormFieldSelect}
          name="from_token"
          placeholder="Select a Token"
          options={convertOptions(pairs)}
        />
        <Field
          component={FormFieldSelect}
          name="to_token"
          placeholder="Select a Token"
          options={convertOptions(pairs)}
        />
      </div>
      <label>Deposit Amounts</label>
      <div className="row">
        <Field
          component={FormFieldInputAmount}
          name="from_amount_token"
          placeholder="0"
          bottomNote={<HorizontalItem label="Avl Balance" value="0" />}
        />
        <Field
          component={FormFieldInputAmount}
          name="to_amount_token"
          placeholder="0"
          bottomNote={<HorizontalItem label="Avl Balance" value="0" />}
        />
      </div>
      <WrapperConnected type="submit" className="btn-confirm">
        <span>Confirm</span>
      </WrapperConnected>
      <Text className="fee-note">
        Fee tier: <b>{values?.fee_tier}%</b>
      </Text>
    </form>
  );
};

export default AddPoolsForm;
