/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CountDownTimer from '@/components/Countdown';
import SocialToken from '@/components/Social';
import FiledButton from '@/components/Swap/button/filedButton';
import ListTable, { ColumnProp } from '@/components/Swap/listTable';
import { TOKEN_ICON_DEFAULT } from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import { ILaunchpad } from '@/interfaces/launchpad';
import { IToken } from '@/interfaces/token';
import { getListLaunchpad } from '@/services/launchpad';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import { compareString, formatCurrency } from '@/utils';
import { Box, Flex, Progress, Text } from '@chakra-ui/react';
import { px2rem } from '@trustless-computer/dapp-core';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { ImClock2 } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import web3 from 'web3';
import LaunchpadStatus, {
  LAUNCHPAD_STATUS,
  useLaunchPadStatus,
} from './Launchpad.Status';
import { StyledIdoContainer } from './Launchpad.styled';
import InfoTooltip from '@/components/Swap/infoTooltip';

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
        label: 'Rewards',
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
        label: (
          <InfoTooltip
            showIcon={true}
            label="Liquidity Reserve refers to a percentage of the funds that are used to add initial liquidity for trading purposes after the crowdfunding ends"
          >
            Liquidity reserve
          </InfoTooltip>
        ),
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
            <Box>
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
              <Text>{`${
                token.totalSupply
                  ? `${formatCurrency(row.liquidityBalance, 18)} ${token?.symbol}`
                  : 'N/A'
              }`}</Text>
            </Box>
          );
        },
      },
      {
        id: 'goal',
        label: 'Funding Goal',
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
          let color = colors.white;
          if (status.value !== 'upcoming') {
            if (Number(row.totalValue) >= Number(row.goalBalance)) {
              color = colors.greenPrimary;
            } else if (Number(row.totalValue) < Number(row.goalBalance)) {
              color = colors.redPrimary;
            }
          }
          return (
            <Box>
              <Text
                color={color}
              >{`${row.totalValue} / ${row.goalBalance} ${row.liquidityToken.symbol}`}</Text>
              <Box mb={2} />
              <Progress
                max={100}
                value={(Number(row.totalValue) / Number(row.goalBalance)) * 100}
                size="xs"
              />
              <Text mt={2}>${formatCurrency(row.totalValueUsd, 2)}</Text>
            </Box>
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
                <Text>
                  <span style={{ color: colors.white500, fontSize: px2rem(14) }}>
                    Starts at:
                  </span>{' '}
                  {moment(row.startTime).format('MMM, DD')}
                </Text>
                <Flex mt={1} alignItems={'center'} gap={2}>
                  <ImClock2 />
                  <Text>
                    <CountDownTimer end_time={row.startTime} />
                  </Text>
                </Flex>
              </Box>
            );
          }
          if (status.value === 'crowing-funding') {
            return (
              <Box>
                <Text>
                  <span style={{ color: colors.white500, fontSize: px2rem(14) }}>
                    Ends at:
                  </span>{' '}
                  {moment(row.endTime).format('MMM, DD')}
                </Text>
                <Flex mt={1} alignItems={'center'} gap={2}>
                  <ImClock2 />
                  <Text>
                    <CountDownTimer end_time={row.endTime} />
                  </Text>
                </Flex>
              </Box>
            );
          }
          if (status.value === 'success' && status.key !== LAUNCHPAD_STATUS.Closed) {
            return (
              <Box>
                <Text>
                  <span style={{ color: colors.white500, fontSize: px2rem(14) }}>
                    Release time:
                  </span>{' '}
                </Text>
                <Flex mt={1} alignItems={'center'} gap={2}>
                  <ImClock2 />
                  <Text>{moment(row.lpTokenReleaseTime).format('LL')}</Text>
                </Flex>
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
          if (compareString(row.creatorAddress, account)) {
            return (
              <Flex alignItems={'center'} gap={4}>
                <Box
                  cursor={'pointer'}
                  onClick={() =>
                    router.push(`${ROUTE_PATH.LAUNCHPAD_MANAGE}?id=${row.launchpad}`)
                  }
                >
                  <BsPencil />
                </Box>
                {/* <Box cursor={'pointer'} onClick={() => onShowCreateIDO(row, true)}>
                  <BsTrash style={{ color: colors.redPrimary }} />
                </Box> */}
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
        Welcome to DeFi crowdfunding on Bitcoin. A place where you can support
        innovative projects and ideas all while leveraging the power of blockchain.
        Join us as we revolutionize the future of crowdfunding!
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
