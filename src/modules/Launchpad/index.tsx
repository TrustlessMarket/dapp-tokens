/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CountDownTimer from '@/components/Countdown';
import SocialToken from '@/components/Social';
import FiledButton from '@/components/Swap/button/filedButton';
import ListTable, { ColumnProp } from '@/components/Swap/listTable';
import { TOKEN_ICON_DEFAULT } from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import { IToken } from '@/interfaces/token';
import { getListLaunchpad } from '@/services/launchpad';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import { compareString, formatCurrency } from '@/utils';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import web3 from 'web3';
import LaunchpadStatus, { useLaunchPadStatus } from './Launchpad.Status';
import { StyledIdoContainer } from './Launchpad.styled';
import { ILaunchpad } from '@/interfaces/launchpad';

const LaunchpadContainer = () => {
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const router = useRouter();

  useEffect(() => {
    getData();
  }, [needReload]);

  const getData = async () => {
    try {
      const response: any = await getListLaunchpad({
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
        render(row: ILaunchpad) {
          const token: IToken = row.launchpadToken;
          return (
            <Flex gap={4}>
              <img src={token.thumbnail || TOKEN_ICON_DEFAULT} />
              <Box>
                <Text className="record-title">
                  {token.name} <span>{token.symbol}</span>
                </Text>
                <Text className="note">{token.network}</Text>
              </Box>
            </Flex>
          );
        },
      },
      {
        id: 'price',
        label: 'Balance',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: ILaunchpad) {
          const token: IToken = row.launchpadToken;
          return (
            <Text>{`${
              row.launchpadBalance
                ? `${formatCurrency(row.launchpadBalance, 18)} ${token?.symbol}`
                : 'N/A'
            }`}</Text>
          );
        },
      },
      {
        id: 'supply',
        label: 'Supply',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: ILaunchpad) {
          const token: IToken = row.launchpadToken;
          return (
            <Text>{`${
              token.totalSupply
                ? `${formatCurrency(token.totalSupply, 18)} ${token?.symbol}`
                : 'N/A'
            }`}</Text>
          );
        },
      },
      {
        id: 'ratio',
        label: 'Liquidity reserve',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: ILaunchpad) {
          return (
            <Text>{`${
              row.liquidityRatio
                ? `${formatCurrency(
                    new BigNumber(web3.utils.toWei(row.liquidityRatio).toString())
                      .dividedBy(10000)
                      .toString(),
                    18,
                  )}%`
                : 'N/A'
            }`}</Text>
          );
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
        render(row: ILaunchpad) {
          const [status] = useLaunchPadStatus({ row });

          if (status.value === 'upcoming') {
            return (
              <Box>
                <Text>{moment(row.startTime).format('MMM, DD')}</Text>
                <Text>
                  Start at: <CountDownTimer end_time={row.startTime} />
                </Text>
              </Box>
            );
          }
          if (status.value === 'crowing-funding') {
            return (
              <Box>
                <Text>{moment(row.endTime).format('MMM, DD')}</Text>
                <Text>
                  Ends at: <CountDownTimer end_time={row.endTime} />
                </Text>
              </Box>
            );
          }

          return <></>;
        },
      },
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
        render(row: ILaunchpad) {
          return <LaunchpadStatus row={row} />;
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
        render(row: ILaunchpad) {
          const token: IToken = row.launchpadToken;
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
        render(row: ILaunchpad) {
          const token: IToken = row.launchpadToken;

          if (compareString(row.creatorAddress, account)) {
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
    return router.push(`${ROUTE_PATH.LAUNCHPAD_MANAGE}`);
    // const id = 'manageIdo';
    // const close = () => dispatch(closeModal({ id }));
    // dispatch(
    //   openModal({
    //     id,
    //     theme: 'dark',
    //     title: isRemove ? 'Remove IDO Token' : 'Submit Launchpad',
    //     modalProps: {
    //       centered: true,
    //       size: 'xl',
    //       // contentClassName: styles.modalContent,
    //     },
    //     render: () => (
    //       <IdoTokenManage ido={_ido} onClose={close} isRemove={isRemove} />
    //     ),
    //   }),
    // );
  };

  return (
    <StyledIdoContainer>
      <Text as={'h1'} className="title">
        Launchpad
      </Text>
      <Text className="desc">
        Welcome to our decentralized crowdfunding platform! We're excited to
        introduce the Kickstarter model deployed on Bitcoin. With our platform, you
        can support innovative projects and ideas while leveraging the power of
        blockchain. Join us in revolutionizing the future of crowdfunding!
      </Text>

      <Flex mb={'24px'} mt={'24px'} justifyContent={'center'}>
        <FiledButton btnSize="h" onClick={onShowCreateIDO}>
          <Text>Submit Launchpad</Text>
        </FiledButton>
      </Flex>

      <Box className="content">
        <ListTable
          data={data}
          columns={columns}
          initialLoading={loading}
          onItemClick={(e) => {
            return router.push(
              `${ROUTE_PATH.LAUNCHPAD_DETAIL}?pool_address=${e.launchpad}`,
            );
          }}
        />
      </Box>
    </StyledIdoContainer>
  );
};

export default LaunchpadContainer;
