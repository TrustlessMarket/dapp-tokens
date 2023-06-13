/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FiledButton from '@/components/Swap/button/filedButton';
import FieldText from '@/components/Swap/form/fieldText';
import { toastError } from '@/constants/error';
import { logErrorToServer } from '@/services/swap';
import {
  IUpdateTokenPayload,
  updateTwitterTokenInfo,
} from '@/services/token-explorer';
import { requestReload } from '@/state/pnftExchange';
import { composeValidators, isTwitter, required } from '@/utils/formValidate';
import { showError } from '@/utils/toast';
import { Box } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const LaunchpadFormStep1UpdateSocialForm: React.FC<any> = ({
  handleSubmit,
  submitting,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="twitter"
        children={FieldText}
        disabled={submitting}
        placeholder={'Enter twitter profile url'}
        // className={cx(styles.inputAmount, styles.collateralAmount)}
        borderColor={'#353945'}
        validate={composeValidators(required, isTwitter)}
        label="Twitter profile url"
      />
      <Box mt={6} />
      <FiledButton isDisabled={submitting} isLoading={submitting} type="submit">
        Update
      </FiledButton>
    </form>
  );
};

const LaunchpadFormStep1UpdateSocial: React.FC<any> = ({
  detail,
  onClose,
  onUpdateTokenSelect,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const { account } = useWeb3React();
  const dispatch = useDispatch();

  console.log('detail', detail);

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      const data: IUpdateTokenPayload = {
        social: {
          twitter: values?.twitter,
        },
      };
      const response: any = await updateTwitterTokenInfo(detail?.address, data);
      toast.success('Update token info successfully!');
      console.log('response', response);

      onUpdateTokenSelect(response);
      dispatch(requestReload());
      onClose();
    } catch (err: any) {
      toastError(showError, err, { address: account });
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <LaunchpadFormStep1UpdateSocialForm
          handleSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </Form>
  );
};

export default LaunchpadFormStep1UpdateSocial;
