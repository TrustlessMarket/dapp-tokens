/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { toastError } from '@/constants/error';
import { WalletContext } from '@/contexts/wallet-context';
import useCreateLaunchpad from '@/hooks/contract-operations/launchpad/useCreate';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { ILaunchpad } from '@/interfaces/launchpad';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import {
  getDetailLaunchpad,
  scanLaunchpadTxHash,
  updateLaunchpadDescription,
} from '@/services/launchpad';
import { requestReload, updateCurrentTransaction } from '@/state/pnftExchange';
import { showError } from '@/utils/toast';
import { Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { filter } from 'lodash';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import LaunchManageForm from './LaunchpadManage.Form';
import { StyledLaunchpadManage } from './LaunchpadManage.styled';

const LaunchManage = () => {
  const { account } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [detail, setDetail] = useState<ILaunchpad | undefined>(undefined);

  const { run: createLaunchpad } = useContractOperation({
    operation: useCreateLaunchpad,
  });

  const { getSignature } = useContext(WalletContext);

  const router = useRouter();

  const id = router.query?.id;

  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    if (!id) {
      return;
    }

    try {
      const response: any = await Promise.all([
        getDetailLaunchpad({ pool_address: id }),
      ]);
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

      const faqs = filter(Object.keys(values), (v) => v?.includes('faq_q')).map(
        (v, i) => ({
          value: values?.[v],
          label: values?.[`faq_a_${i + 1}`],
        }),
      );

      const signature = await getSignature(account);

      if (detail) {
        await updateLaunchpadDescription({
          launchpad: detail.launchpad,
          user_address: account,
          video: values?.video,
          image: values?.image,
          description: values?.description,
          signature,
          qand_a: JSON.stringify(faqs),
        });

        toast.success(`Updated launchpad successfully.`);
        dispatch(updateCurrentTransaction(null));
      } else {
        const response: any = await createLaunchpad({
          launchpadTokenArg: tokenAddress,
          liquidityTokenArg: liquidAddress,
          liquidityRatioArg: values.liquidityRatioArg,
          startTimeArg: values.startTimeArg,
          endTimeArg: values.endTimeArg,
          launchpadBalance: values.launchpadBalance,
          goalBalance: values.goalBalance,
        });

        updateLaunchpadDescription({
          tx_hash: response.hash,
          user_address: account,
          video: values?.video,
          image: values?.image,
          description: values?.description,
          signature,
          qand_a: JSON.stringify(faqs),
        });

        dispatch(
          updateCurrentTransaction({
            status: TransactionStatus.success,
            id: transactionType.createLaunchpad,
            hash: response.hash,
            infoTexts: {
              success: `Created ${values?.launchpadTokenArg?.symbol} - ${values?.liquidityTokenArg?.symbol} launchpad successfully.`,
            },
          }),
        );
        await scanLaunchpadTxHash({ tx_hash: response.hash });
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
          />
        )}
      </Form>
    </StyledLaunchpadManage>
  );
};

export default LaunchManage;
