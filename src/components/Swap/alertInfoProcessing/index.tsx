/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { WALLET_URL } from '@/configs';
import { TC_EXPLORER } from '@/configs';
import {
  TransactionStatus,
  WalletTransactionData,
} from '@/interfaces/walletTransaction';
import { useAppSelector } from '@/state/hooks';
import {
  selectCurrentTransaction,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import { compareString, shortCryptoAddress } from '@/utils';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

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
  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true });
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);

  const handleClose = () => {
    dispatch(updateCurrentTransaction(null));
    onClose();
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
  } else if (currentTransaction?.infoTexts?.info) {
    _title = currentTransaction?.infoTexts?.info;
  }

  const theme = processInfo?.theme || 'dark';

  return (
    <Alert
      status={currentTransaction?.status}
      variant="subtle"
      flexDirection={processInfo?.size === 'sm' ? 'row' : 'column'}
      alignItems="center"
      justifyContent={processInfo?.size === 'sm' ? 'flex-start' : 'center'}
      textAlign="center"
      borderRadius={8}
      py={processInfo?.size === 'sm' ? 2 : 4}
      gap={2}
      mb={3}
      backgroundColor={theme === 'dark' ? colors.dark : colors.dark100}
      border={`1px solid ${
        theme === 'dark' ? colors.darkBorderColor : colors.dark100
      }`}
    >
      <AlertIcon boxSize="40px" mr={0} mb={2} />
      <Flex direction={'column'}>
        <AlertTitle
          fontSize={processInfo?.size === 'sm' ? 'smaller' : 'sm'}
          lineHeight={processInfo?.size === 'sm' ? 'xs' : 'md'}
          color={theme === 'dark' ? colors.white : colors.black}
          dangerouslySetInnerHTML={{ __html: _title }}
        />
        {currentTransaction && currentTransaction.hash && (
          <AlertDescription
            color={theme === 'dark' ? colors.white : colors.black}
            fontSize="x-small"
          >
            {currentTransaction?.status === TransactionStatus.success ? (
              <a
                target="_blank"
                href={`${TC_EXPLORER}/tx/${currentTransaction.hash}`}
                style={{ color: colors.bluePrimary }}
              >
                {shortCryptoAddress(currentTransaction.hash, 30)}
              </a>
            ) : (
              shortCryptoAddress(currentTransaction.hash, 30)
            )}
          </AlertDescription>
        )}
        {/* {count >= MAXIMUM_TIME_REQUEST &&
          loading &&
          currentTransaction &&
          compareString(currentTransaction.status, TransactionStatus.pending) &&
          currentTransaction?.hash && (
            <StyledWarningNote>
              {`Transaction taking too long, please open "Metamask" and click "Speed up".`}
            </StyledWarningNote>
          )} */}
      </Flex>
      {currentTransaction &&
        [TransactionStatus.error, TransactionStatus.success].includes(
          currentTransaction?.status,
        ) && (
          <CloseButton
            position="absolute"
            onClick={handleClose}
            top={'5px'}
            right={'5px'}
            style={{
              backgroundColor: 'transparent',
            }}
            color={theme === 'dark' ? colors.white : colors.black}
          />
        )}
    </Alert>
  );
};

export default AlertInfoProcess;
