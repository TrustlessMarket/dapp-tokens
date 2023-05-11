/* eslint-disable @typescript-eslint/no-explicit-any */
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { toastError } from '@/constants/error';
import { WalletContext } from '@/contexts/wallet-context';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { getDetailIdo, removeIdo, submitIdo } from '@/services/ido';
import { requestReload, updateCurrentTransaction } from '@/state/pnftExchange';
import { showError } from '@/utils/toast';
import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import IdoTokenManageForm from './IdoTokenManage.Form';
import { StyledIdoManage } from './IdoTokenManage.styled';

const IdoTokenManage = ({
  ido,
  onClose,
  isRemove,
}: {
  ido: any;
  onClose: () => void;
  isRemove?: boolean;
}) => {
  const { getSignature } = useContext(WalletContext);
  const { account } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [detail, setDetail] = useState<any>(null);

  const id = ido?.id;

  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    if (!id) {
      return;
    }

    try {
      const response: any = await getDetailIdo({ id });
      setDetail(response);
    } catch (error) {}
  };

  const onSubmit = async (values: any) => {
    if (!account) {
      return;
    }

    try {
      setLoading(true);

      const tokenAddress = values?.token?.address;

      dispatch(
        updateCurrentTransaction({
          id: transactionType.idoManage,
          status: TransactionStatus.info,
          infoTexts: {
            info: `Confirm sign with message ${tokenAddress}`,
          },
        }),
      );

      const signature: string = await getSignature(tokenAddress);

      dispatch(
        updateCurrentTransaction({
          id: transactionType.idoManage,
          status: TransactionStatus.pending,
          infoTexts: {
            pending: `Signing with message ${tokenAddress}`,
          },
        }),
      );

      if (isRemove) {
        await removeIdo({
          id: ido.id,
          signature: signature,
          address: account,
        });
        toast.success(`Removed IDO successfully.`);
      } else {
        await submitIdo({
          id: values.id,
          user_wallet_address: account,
          token_address: tokenAddress,
          start_at: moment(values?.start_at).format(),
          price: values?.price,
          signature,
        });
        toast.success(`Submitted IDO successfully.`);
      }

      dispatch(requestReload());
      onClose();
    } catch (err) {
      toastError(showError, err, { address: account });
    } finally {
      dispatch(updateCurrentTransaction(null));
      setLoading(false);
    }
  };

  return (
    <StyledIdoManage>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <IdoTokenManageForm
            handleSubmit={handleSubmit}
            loading={loading}
            detail={detail}
            onClose={onClose}
            isRemove={isRemove}
          />
        )}
      </Form>
    </StyledIdoManage>
  );
};

export default IdoTokenManage;
