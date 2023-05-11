/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CountDownTimer from '@/components/Countdown';
import SocialToken from '@/components/Social';
import FiledButton from '@/components/Swap/button/filedButton';
import ListTable, { ColumnProp } from '@/components/Swap/listTable';
import { TOKEN_ICON_DEFAULT } from '@/constants/common';
import { IToken } from '@/interfaces/token';
import { getListIdo } from '@/services/ido';
import { useAppSelector } from '@/state/hooks';
import { closeModal, openModal } from '@/state/modal';
import { selectPnftExchange } from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import { compareString, formatCurrency } from '@/utils';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { truncate } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import IdoTokenManage from '../IdoTokenManage';
import IdoTokenStatus from './IdoToken.Status';
import { StyledIdoContainer } from './IdoToken.styled';

const IdoTokenContainer = () => {
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
          return <IdoTokenStatus row={row} />;
        },
      },
      {
        id: 'date',
        label: 'Date',
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
                <Text className="record-title">
                  {token.name} <span>{token.symbol}</span>
                </Text>
                <Text className="note">#{token.index}</Text>
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
          return (
            <Text className="description">
              {truncate(token.description, {
                length: 100,
                separator: '...',
              })}
            </Text>
          );
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
                <Box cursor={'pointer'} onClick={() => onShowCreateIDO(row)}>
                  <BsPencil />
                </Box>
                <Box cursor={'pointer'} onClick={() => onShowCreateIDO(row, true)}>
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

  const onShowCreateIDO = async (_ido?: any, isRemove?: boolean) => {
    const id = 'manageIdo';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: isRemove ? 'Remove IDO Token' : 'Submit IDO Token',
        modalProps: {
          centered: true,
          size: 'xl',
          // contentClassName: styles.modalContent,
        },
        render: () => (
          <IdoTokenManage ido={_ido} onClose={close} isRemove={isRemove} />
        ),
      }),
    );
  };

  return (
    <StyledIdoContainer>
      <Text as={'h1'} className="title">
        Upcoming IDO
      </Text>
      <Text className="desc">
        This page dedicate to providing information about upcoming token public
        sales. Here, you will find a comprehensive list of upcoming token public
        sales, along with detailed information about each project and the respective
        tokens being offered.
      </Text>

      <Flex mb={'24px'} mt={'24px'} justifyContent={'center'}>
        <FiledButton onClick={onShowCreateIDO}>
          <Text ml={1}>Submit IDO Token</Text>
        </FiledButton>
      </Flex>

      <Box className="content">
        <ListTable data={data} columns={columns} initialLoading={loading} />
      </Box>
    </StyledIdoContainer>
  );
};

export default IdoTokenContainer;
