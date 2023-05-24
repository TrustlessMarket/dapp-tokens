/* eslint-disable @typescript-eslint/no-explicit-any */
import { toastError } from '@/constants/error';
import useCreateLaunchpad from '@/hooks/contract-operations/launchpad/useCreate';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { getDetailIdo } from '@/services/ido';
import { requestReload, updateCurrentTransaction } from '@/state/pnftExchange';
import { showError } from '@/utils/toast';
import { Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import LaunchManageForm from './LaunchpadManage.Form';
import { StyledLaunchpadManage } from './LaunchpadManage.styled';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { ROUTE_PATH } from '@/constants/route-path';

const LaunchManage = ({ ido, isRemove }: { ido: any; isRemove?: boolean }) => {
  const { account } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [detail, setDetail] = useState<any>(null);

  const { run: createLaunchpad } = useContractOperation({
    operation: useCreateLaunchpad,
  });

  const id = ido?.id;

  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    if (!id) {
      return;
    }

    try {
      const response: any = await Promise.all([getDetailIdo({ id })]);
      setDetail(response[0]);
    } catch (error) {}
  };

  const onSubmit = async (values: any) => {
    if (!account) {
      return;
    }

    try {
      setLoading(true);

      const tokenAddress = values?.launchpadTokenArg?.address;
      const liquidAddress = values?.liquidityTokenArg?.address;

      dispatch(
        updateCurrentTransaction({
          id: transactionType.createLaunchpad,
          status: TransactionStatus.info,
        }),
      );

      if (isRemove) {
        // await removeIdo({
        //   id: ido.id,
        //   signature: signature,
        //   address: account,
        // });
        toast.success(`Removed IDO successfully.`);
      } else {
        const response: any = await createLaunchpad({
          launchpadTokenArg: tokenAddress,
          liquidityTokenArg: liquidAddress,
          liquidityRatioArg: values.liquidityRatioArg,
          startTimeArg: values.startTimeArg,
          endTimeArg: values.endTimeArg,
          launchpadBalance: values.launchpadBalance,
          goalBalance: values.goalBalance,
          faq: '',
          description: values.description,
        });
        console.log('response', response);

        dispatch(
          updateCurrentTransaction({
            status: TransactionStatus.success,
            id: transactionType.createLaunchpad,
            hash: response.hash,
            infoTexts: {
              success: `Created ${values?.launchpadTokenArg?.symbol} - ${values?.liquidityTokenArg?.symbol} launchpad successfully. You can <a href='${ROUTE_PATH.LAUNCHPAD_DETAIL}' >check now!</a>`,
            },
          }),
        );
      }

      dispatch(requestReload());
    } catch (err) {
      toastError(showError, err, { address: account });
      dispatch(updateCurrentTransaction(null));
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledLaunchpadManage>
      <Text as={'h4'}>Create Launchpad</Text>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <LaunchManageForm
            handleSubmit={handleSubmit}
            loading={loading}
            setLoading={setLoading}
            detail={detail}
            isRemove={isRemove}
          />
        )}
      </Form>
    </StyledLaunchpadManage>
  );
};

export default LaunchManage;
