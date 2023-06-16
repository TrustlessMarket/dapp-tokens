import ERC20ABIJson from '@/abis/erc20.json';
import Button from '@/components/Button';
import IconSVG from '@/components/IconSVG';
import Text from '@/components/Text';
import { CDN_URL, WALLET_URL } from '@/configs';
import { ERROR_CODE } from '@/constants/error';
import { AssetsContext } from '@/contexts/assets-context';
import { DappsTabs } from '@/enums/tabs';
import useCreateToken, {
  ICreateTokenParams,
} from '@/hooks/contract-operations/token/useCreateToken';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { DeployContractResponse } from '@/interfaces/contract-operation';
import { showError } from '@/utils/toast';
import { formatBTCPrice } from '@trustless-computer/dapp-core';
import { Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import * as TC_SDK from 'trustless-computer-sdk';
import { StyledModalUpload, Title, WrapInput } from './ModalCreate.styled';

type Props = {
  show: boolean;
  handleClose: () => void;
};

interface IFormValue {
  name: string;
  symbol: string;
  supply: string;
}

enum optionFees {
  economy = 'Economy',
  faster = 'Faster',
  fastest = 'Fastest',
}

const ModalCreateToken: React.FC<Props> = (props: Props) => {
  const { show, handleClose } = props;
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectFee, setSelectFee] = useState<number>(0);
  const [activeFee, setActiveFee] = useState(optionFees.fastest);

  const [estBTCFee, setEstBTCFee] = useState({
    economy: '0',
    faster: '0',
    fastest: '0',
  });

  const { feeRate } = useContext(AssetsContext);

  const { run } = useContractOperation<
    ICreateTokenParams,
    DeployContractResponse | null
  >({
    operation: useCreateToken,
  });

  const handleEstFee = async (): Promise<void> => {
    const byteCode = ERC20ABIJson.bytecode;

    const estimatedFastestFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: Buffer.byteLength(byteCode),
      feeRatePerByte: feeRate.fastestFee,
    });
    const estimatedFasterFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: Buffer.byteLength(byteCode),
      feeRatePerByte: feeRate.halfHourFee,
    });
    const estimatedEconomyFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: Buffer.byteLength(byteCode),
      feeRatePerByte: feeRate.hourFee,
    });

    setEstBTCFee({
      fastest: estimatedFastestFee.totalFee.toString(),
      faster: estimatedFasterFee.totalFee.toString(),
      economy: estimatedEconomyFee.totalFee.toString(),
    });

    // setEstBTCFee(estimatedFee.totalFee.toString());
  };

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
        // selectFee,
      });
      toast.success('Transaction has been created. Please wait for few minutes.');
      handleClose();
    } catch (err) {
      if ((err as Error).message === ERROR_CODE.PENDING) {
        showError({
          message:
            'You have some pending transactions. Please complete all of them before moving on.',
          url: `${WALLET_URL}/?tab=${DappsTabs.TRANSACTION}`,
          linkText: 'Go to Wallet',
        });
      } else if ((err as Error).message === ERROR_CODE.INSUFFICIENT_BALANCE) {
        const byteCode = ERC20ABIJson.bytecode;

        const estimatedFee = TC_SDK.estimateInscribeFee({
          tcTxSizeByte: Buffer.byteLength(byteCode),
          feeRatePerByte: selectFee,
        });

        showError({
          message: `Your balance is insufficient. Please top up at least ${formatBTCPrice(
            estimatedFee.totalFee.toString(),
          )} BTC to pay network fee.`,
          url: `${WALLET_URL}`,
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

  const renderEstFee = ({
    title,
    estFee,
    feeRate,
  }: {
    title: optionFees;
    estFee: string;
    feeRate: number;
  }) => {
    return (
      <div
        className={`est-fee-item ${activeFee === title ? 'active' : ''}`}
        onClick={() => {
          setSelectFee(feeRate);
          setActiveFee(title);
        }}
      >
        <div>
          <Text fontWeight="medium" color="text1" size="regular">
            {title}
          </Text>
          <Text color="text2" className="mb-10">
            {feeRate} sats/vByte
          </Text>
          <p className="ext-price">
            {formatBTCPrice(estFee)} <span>BTC</span>
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    handleEstFee();
  }, []);

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
        <Title className="font-medium">Create SMART BRC-20</Title>
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

              <div className="est-fee">
                <Text
                  size="regular"
                  fontWeight="medium"
                  color="text1"
                  className="mb-8"
                >
                  Select the network fee
                </Text>
                <div className="est-fee-options">
                  {renderEstFee({
                    title: optionFees.economy,
                    estFee: estBTCFee.economy,
                    feeRate: feeRate.hourFee,
                  })}
                  {renderEstFee({
                    title: optionFees.faster,
                    estFee: estBTCFee.faster,
                    feeRate: feeRate.halfHourFee,
                  })}
                  {renderEstFee({
                    title: optionFees.fastest,
                    estFee: estBTCFee.fastest,
                    feeRate: feeRate.fastestFee,
                  })}
                </div>
              </div>

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
