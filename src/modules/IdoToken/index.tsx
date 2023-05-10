/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Text } from '@chakra-ui/react';
import { StyledIdoContainer } from './IdoToken.styled';
import FiledButton from '@/components/Swap/button/filedButton';
import { BsPencil, BsPlusLg, BsTrash } from 'react-icons/bs';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';
import ListTable, { ColumnProp } from '@/components/Swap/listTable';
import { getListIdo } from '@/services/ido';
import moment from 'moment';
import { IToken } from '@/interfaces/token';
import { TOKEN_ICON_DEFAULT } from '@/constants/common';
import { compareString, formatCurrency } from '@/utils';
import SocialToken from '@/components/Social';
import CountDownTimer from '@/components/Countdown';
import { useWeb3React } from '@web3-react/core';
import { colors } from '@/theme/colors';
import { useDispatch } from 'react-redux';
import { openModal } from '@/state/modal';
import { closeModal } from '@/state/modal';
import IdoTokenRemove from './IdoToken.Remove';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';

const IdoTokenContainer = () => {
  const router = useRouter();
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const needReload = useAppSelector(selectPnftExchange).needReload;

  useEffect(() => {
    getData();
  }, [needReload]);

  const getData = async () => {
    try {
      const response: any = await getListIdo({
        page: 1,
        limit: 50,
      });
      setData(response);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onConfirmRemove = (_ido: any) => {
    const id = 'removeIdo';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Confirm remove ido',
        modalProps: {
          centered: true,
          // contentClassName: styles.modalContent,
        },
        render: () => <IdoTokenRemove ido={_ido} onClose={close} />,
      }),
    );
  };

  const columns: ColumnProp[] = useMemo(() => {
    return [
      {
        id: 'status',
        label: 'Status',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          return (
            <Box>
              <Text className="up-coming">Upcoming</Text>
              <Text>{moment(row.startAt).format('MMM, DD')}</Text>
            </Box>
          );
        },
      },
      {
        id: 'start_at',
        label: 'Start at',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          return (
            <Text>
              <CountDownTimer end_time={row.startAt} />
            </Text>
          );
        },
      },
      {
        id: 'token',
        label: 'Token',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          const token: IToken = row.token;
          return (
            <Flex gap={4}>
              <img src={token.thumbnail || TOKEN_ICON_DEFAULT} />
              <Box>
                <Text>
                  {token.name} ({token.symbol})
                </Text>
                <Text className="desc">#{token.index}</Text>
              </Box>
            </Flex>
          );
        },
      },
      {
        id: 'description',
        label: 'Description',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          const token: IToken = row.token;
          return <Text>{token.description}</Text>;
        },
      },
      {
        id: 'price',
        label: 'Price',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          const token: IToken = row.token;
          return (
            <Text>{`${
              row.price ? `$${formatCurrency(row.price, 18)}` : 'N/A'
            }`}</Text>
          );
        },
      },
      {
        id: 'link',
        label: 'Link',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          const token: IToken = row.token;
          return <SocialToken socials={token.social} />;
        },
      },
      {
        id: 'action',
        label: '',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          const token: IToken = row.token;

          if (compareString(token.owner, account)) {
            return (
              <Flex alignItems={'center'} gap={4}>
                <Box
                  cursor={'pointer'}
                  onClick={() =>
                    router.push(`${ROUTE_PATH.IDO_MANAGE}?id=${row.id}`)
                  }
                >
                  <BsPencil />
                </Box>
                <Box cursor={'pointer'} onClick={() => onConfirmRemove(row)}>
                  <BsTrash style={{ color: colors.redPrimary }} />
                </Box>
              </Flex>
            );
          }

          return <></>;
        },
      },
    ];
  }, [account]);

  return (
    <StyledIdoContainer>
      <Text as={'h1'} className="title">
        Upcoming <span>IDO</span>
      </Text>

      <Box className="content">
        <Flex mb={4} justifyContent={'flex-end'}>
          <FiledButton onClick={() => router.push(ROUTE_PATH.IDO_MANAGE)}>
            <Text ml={1}>Submit IDO Token</Text>
          </FiledButton>
        </Flex>

        <ListTable data={data} columns={columns} initialLoading={loading} />
      </Box>
    </StyledIdoContainer>
  );
};

export default IdoTokenContainer;
