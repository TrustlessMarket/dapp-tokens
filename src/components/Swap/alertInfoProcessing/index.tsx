/* eslint-disable @typescript-eslint/no-explicit-any */
import { WALLET_URL } from '@/configs';
import useInterval from '@/hooks/useInterval';
import {
  TransactionStatus,
  WalletTransactionData,
} from '@/interfaces/walletTransaction';
import { useAppSelector } from '@/state/hooks';
import { selectCurrentTransaction } from '@/state/pnftExchange';
import { compareString, shortCryptoAddress } from '@/utils';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledWarningNote = styled(AlertDescription)`
  background-color: #ff600038;
  border-radius: 8px;
  padding: 6px 12px;
  margin-top: 10px;
  text-align: left;
  color: #ff6000;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px !important;
  a {
    font-weight: bold;
  }
`;

interface AlertInfoProcessProps {
  loading?: boolean;
  processInfo: any;
}

const getTitle = {
  info: 'Please confirm the transaction.',
  loading: 'Please wait while the transaction is being confirmed.',
  success: 'Transaction successfully',
  error: 'Transaction has failed. Try again',
};

export const MAXIMUM_TIME_REQUEST = 10; // 10s

const AlertInfoProcess: React.FC<AlertInfoProcessProps> = ({
  loading,
  processInfo,
}) => {
  const currentTransaction: WalletTransactionData | undefined = useAppSelector(
    selectCurrentTransaction,
  );

  const [count, setCount] = useState(1);

  useInterval(
    () => {
      setCount((c) => c + 1);
    },
    // Delay in milliseconds or null to stop it
    loading &&
      Boolean(processInfo) &&
      compareString(currentTransaction?.status, TransactionStatus.pending)
      ? 1000
      : null,
  );

  useEffect(() => {
    if (!loading) {
      setCount(1);
    }
  }, [loading]);

  useEffect(() => {
    getTransactionInfo();
  }, [JSON.stringify(currentTransaction)]);

  const getTransactionInfo = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  if (
    !Boolean(currentTransaction?.status) ||
    !compareString(currentTransaction?.id, processInfo?.id)
  ) {
    return null;
  }

  let _title = currentTransaction ? getTitle?.[currentTransaction.status] : '';

  if (currentTransaction?.infoTexts?.success) {
    _title = currentTransaction?.infoTexts?.success;
  } else if (currentTransaction?.infoTexts?.error) {
    _title = currentTransaction?.infoTexts?.error;
  } else if (currentTransaction?.infoTexts?.pending) {
    _title = currentTransaction?.infoTexts?.pending;
  }

  return (
    <Alert
      status={currentTransaction?.status}
      variant="subtle"
      flexDirection={processInfo?.size === 'sm' ? 'row' : 'column'}
      alignItems="center"
      justifyContent={processInfo?.size === 'sm' ? 'flex-start' : 'center'}
      textAlign="center"
      borderRadius={4}
      // mb={2}
      opacity={0.8}
      py={processInfo?.size === 'sm' ? 2 : 4}
      gap={2}
    >
      <AlertIcon boxSize="40px" mr={0} />
      <Flex direction={'column'}>
        <AlertTitle
          fontSize={processInfo?.size === 'sm' ? 'xs' : 'md'}
          lineHeight={processInfo?.size === 'sm' ? 'xs' : 'md'}
        >
          {_title}
        </AlertTitle>
        {currentTransaction && currentTransaction.hash && (
          <AlertDescription
            // style={{
            //   cursor: "pointer",
            //   fontWeight: 500,
            // }}
            // onClick={() =>
            //   window.open(
            //     getLinkEvmExplorer(
            //       currentTransaction?.hash,
            //       "tx",
            //       currentTransaction.network
            //     )
            //   )
            // }
            fontSize="x-small"
          >
            {shortCryptoAddress(currentTransaction.hash, 30)}
          </AlertDescription>
        )}
        {count >= MAXIMUM_TIME_REQUEST &&
          loading &&
          currentTransaction &&
          compareString(currentTransaction.status, TransactionStatus.pending) &&
          currentTransaction?.hash && (
            <StyledWarningNote className="warning-note">
              To process a transaction, please follow these steps:
              <br />
              1. Go to{' '}
              <a href={WALLET_URL} target="_blank">
                {WALLET_URL}
              </a>
              <br />
              2. Click on the "Transaction" tab
              <br />
              3. Locate the pending transaction you wish to resume and click on it
            </StyledWarningNote>
          )}
      </Flex>
    </Alert>
  );
};

export default AlertInfoProcess;
