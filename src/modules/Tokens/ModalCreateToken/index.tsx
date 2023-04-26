import Button from '@/components/Button';
import Text from '@/components/Text';
import useCreateToken, {
  ICreateTokenParams,
} from '@/hooks/contract-operations/token/useCreateToken';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { DeployContractResponse } from '@/interfaces/contract-operation';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { StyledModalUpload, Title, WrapInput } from './ModalCreate.styled';
import { showError } from '@/utils/toast';
import { CDN_URL, TC_WEB_URL } from '@/configs';
import { DappsTabs } from '@/enums/tabs';
import IconSVG from '@/components/IconSVG';

type Props = {
  show: boolean;
  handleClose: () => void;
};

interface IFormValue {
  name: string;
  symbol: string;
  supply: string;
}

const ModalCreateToken: React.FC<Props> = (props: Props) => {
  const { show, handleClose } = props;
  const [isProcessing, setIsProcessing] = useState(false);
  const { run } = useContractOperation<
    ICreateTokenParams,
    DeployContractResponse | null
  >({
    operation: useCreateToken,
  });

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.name) {
      errors.name = 'Name is required.';
    }
    if (!values.symbol) {
      errors.symbol = 'Symbol is required.';
    }

    if (!values.supply) {
      errors.supply = 'Max supply is required.';
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValue): Promise<void> => {
    const { name, symbol, supply } = values;

    try {
      setIsProcessing(true);
      await run({
        name,
        symbol,
        maxSupply: Number(supply),
      });
      toast.success('Transaction has been created. Please wait for few minutes.');
      handleClose();
    } catch (err) {
      if ((err as Error).message === 'pending') {
        showError({
          message:
            'You have some pending transactions. Please complete all of them before moving on.',
          url: `${TC_WEB_URL}/?tab=${DappsTabs.TRANSACTION}`,
          linkText: 'Go to Wallet',
        });
      } else {
        showError({
          message:
            (err as Error).message ||
            'Something went wrong. Please try again later.',
        });
      }
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <StyledModalUpload show={show} onHide={handleClose} centered>
      <Modal.Header>
        <IconSVG
          className="cursor-pointer"
          onClick={handleClose}
          src={`${CDN_URL}/icons/ic-close.svg`}
          maxWidth={'22px'}
        />
      </Modal.Header>
      <Modal.Body>
        <Title className="font-medium">Create BRC-20</Title>
        <Formik
          key="create"
          initialValues={{
            name: '',
            symbol: '',
            supply: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <WrapInput>
                <input
                  id="name"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  className="input"
                  placeholder={`Enter token name`}
                />
                {errors.name && touched.name && (
                  <p className="error">{errors.name}</p>
                )}
              </WrapInput>

              <WrapInput>
                <input
                  id="symbol"
                  type="text"
                  name="symbol"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.symbol}
                  className="input"
                  placeholder={`Enter symbol`}
                />
                {errors.symbol && touched.symbol && (
                  <p className="error">{errors.symbol}</p>
                )}
              </WrapInput>

              <WrapInput>
                <input
                  id="supply"
                  type="text"
                  name="supply"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.supply}
                  className="input"
                  placeholder={`Enter max supply`}
                />
                {errors.supply && touched.supply && (
                  <p className="error">{errors.supply}</p>
                )}
              </WrapInput>

              {/* <div className="upload-fee">
                <Text size="regular">Fee create</Text>
                <Text size="regular" fontWeight="semibold">
                  0.000214 BTC + 0.000214 TC
                </Text>
              </div> */}
              <Button disabled={isProcessing} type="submit" className="confirm-btn">
                <Text size="medium" fontWeight="medium" className="confirm-text">
                  {isProcessing ? 'Processing...' : 'Create'}
                </Text>
              </Button>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </StyledModalUpload>
  );
};

export default ModalCreateToken;
