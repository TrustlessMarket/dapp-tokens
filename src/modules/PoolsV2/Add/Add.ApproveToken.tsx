/* eslint-disable @typescript-eslint/no-explicit-any */
import ModalConfirmApprove from '@/components/ModalConfirmApprove';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import { UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS } from '@/configs';
import { toastError } from '@/constants/error';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { IToken } from '@/interfaces/token';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { logErrorToServer } from '@/services/swap';
import { closeModal, openModal } from '@/state/modal';
import { requestReload, updateCurrentTransaction } from '@/state/pnftExchange';
import { getExplorer } from '@/utils';
import { showError, showSuccess } from '@/utils/toast';
import { Box } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

interface IAddApproveToken {
  token: IToken;
}

const AddApproveToken: React.FC<IAddApproveToken> = ({ token }) => {
  const { account } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { run: approveToken } = useContractOperation({
    operation: useApproveERC20Token,
  });

  const onShowModalApprove = () => {
    const id = 'modalTokenApprovePoolsV2';
    const onClose = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: `APPROVE USE OF ${token.symbol}`,
        // className: styles.modalConfirmApprove,
        modalProps: {
          centered: true,
          // size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <ModalConfirmApprove onApprove={onApprove} onClose={onClose} />
        ),
      }),
    );
  };

  const onApprove = async () => {
    try {
      setLoading(true);
      await requestApproveToken(token);
      dispatch(requestReload());
    } catch (err) {
      const message =
        (err as Error).message || 'Something went wrong. Please try again later.';
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: message,
      });
      toastError(showError, err, { address: account });
    } finally {
      setLoading(false);
    }
  };

  const requestApproveToken = async (
    token: IToken,
    approveContract: string = UNIV3_NONFUNGBILE_POSITION_MANAGER_ADDRESS,
  ) => {
    try {
      dispatch(
        updateCurrentTransaction({
          id: transactionType.createPoolApprove,
          status: TransactionStatus.info,
        }),
      );

      const response: any = await approveToken({
        erc20TokenAddress: token.address,
        address: approveContract,
      });

      showSuccess({
        message: `${token?.symbol} has been approved successfully.`,
        url: getExplorer(response.hash),
      });
    } catch (error) {
      throw error;
    } finally {
      dispatch(updateCurrentTransaction(null));
    }
  };

  return (
    <>
      <FiledButton
        isDisabled={loading}
        isLoading={loading}
        onClick={onShowModalApprove}
        type="button"
        btnSize="h"
        processInfo={{
          id: transactionType.createPoolApprove,
        }}
      >
        Approve {token.symbol}
      </FiledButton>
      <Box mb={2} />
    </>
  );
};

export default AddApproveToken;
