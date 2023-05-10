/* eslint-disable @typescript-eslint/no-explicit-any */
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { toastError } from '@/constants/error';
import { ROUTE_PATH } from '@/constants/route-path';
import { WalletContext } from '@/contexts/wallet-context';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { getDetailIdo, submitIdo } from '@/services/ido';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { showError } from '@/utils/toast';
import { Flex, Heading, Icon, IconButton } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { toast } from 'react-hot-toast';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import IdoTokenManageForm from './IdoTokenManage.Form';
import { StyledIdoManage } from './IdoTokenManage.styled';

const IdoTokenManage = () => {
  const { getSignature } = useContext(WalletContext);
  const { account } = useWeb3React();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [detail, setDetail] = useState<any>(null);

  const id = router?.query?.id;

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
    console.log(values);
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

      await submitIdo({
        id: values.id,
        user_wallet_address: account,
        token_address: tokenAddress,
        start_at: moment(values?.start_at).format(),
        price: values?.price,
        signature,
      });

      toast.success(`Submitted IDO successfully.`);
    } catch (err) {
      toastError(showError, err, { address: account });
    } finally {
      dispatch(updateCurrentTransaction(null));
      setLoading(false);
    }
  };

  return (
    <StyledIdoManage>
      <Flex
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        position={'relative'}
      >
        <IconButton
          position={'absolute'}
          left={0}
          top={'6px'}
          size={'sm'}
          borderColor={'#FFFFFF'}
          borderWidth={1}
          colorScheme="whiteAlpha"
          isRound
          variant="outline"
          icon={<Icon as={IoArrowBackOutline} color={'#FFFFFF'} />}
          onClick={() => router.replace(`${ROUTE_PATH.IDO}`)}
          aria-label={''}
        />
        <Heading as={'h6'}>{'Submit IDO Token'}</Heading>
      </Flex>

      <Form
        onSubmit={onSubmit}
        // initialValues={{
        //   id: detail?.id,
        //   price: detail?.price,
        //   start_at: detail?.startAt
        //     ? new Date(moment(detail?.startAt).format('MMMM d, yyyy h:mm aa'))
        //     : undefined,
        // }}
      >
        {({ handleSubmit }) => (
          <IdoTokenManageForm
            handleSubmit={handleSubmit}
            loading={loading}
            detail={detail}
          />
        )}
      </Form>
    </StyledIdoManage>
  );
};

export default IdoTokenManage;
