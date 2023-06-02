/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CountDownTimer from '@/components/Countdown';
import SocialToken from '@/components/Social';
import FiledButton from '@/components/Swap/button/filedButton';
import InfoTooltip from '@/components/Swap/infoTooltip';
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import {TOKEN_ICON_DEFAULT} from '@/constants/common';
import {ROUTE_PATH} from '@/constants/route-path';
import {ILaunchpad} from '@/interfaces/launchpad';
import {IToken} from '@/interfaces/token';
import {getListLaunchpad} from '@/services/launchpad';
import {useAppSelector} from '@/state/hooks';
import {selectPnftExchange} from '@/state/pnftExchange';
import {colors} from '@/theme/colors';
import {compareString, formatCurrency} from '@/utils';
import {Box, Flex, Progress, Text} from '@chakra-ui/react';
import {px2rem} from '@trustless-computer/dapp-core';
import {useWeb3React} from '@web3-react/core';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import {useRouter} from 'next/router';
import {useEffect, useMemo, useState} from 'react';
import {BsBoxArrowUpRight, BsPencil} from 'react-icons/bs';
import {ImClock2} from 'react-icons/im';
import {useDispatch} from 'react-redux';
import web3 from 'web3';
import LaunchpadStatus, {LAUNCHPAD_STATUS, LaunchpadLabelStatus, useLaunchPadStatus,} from './Launchpad.Status';
import {StyledIdoContainer} from './Launchpad.styled';

const LaunchpadContainer = () => {
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const router = useRouter();

  useEffect(() => {
    getData();
  }, [needReload, account]);

  const getData = async () => {
    try {
      const response: any = await getListLaunchpad({
        page: 1,
        limit: 50,
        address: account,
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
        id: 'rewards',
        label: 'Reward Pool',
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
          let percent = 0;
          if (Number(row.launchpadBalance) > 0 && Number(token.totalSupply) > 0) {
            percent = new BigNumber(row.launchpadBalance)
              .div(token.totalSupply)
              .multipliedBy(100)
              .toNumber();
          }

          return row.launchpadBalance ? (
            <Flex direction={'column'}>
              <Text>
                {formatCurrency(row.launchpadBalance, 18)} {token?.symbol}
              </Text>
              <Text className="note">{formatCurrency(percent, 2)}% of Supply</Text>
            </Flex>
          ) : (
            'N/A'
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
                    )}% of funded`
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
          const color = colors.white;

          // if (isLaunchPad) {
          //   if (status.value !== 'upcoming') {
          //     if (Number(row.totalValue) >= Number(row.goalBalance)) {
          //       color = colors.greenPrimary;
          //     } else if (Number(row.totalValue) < Number(row.goalBalance)) {
          //       color = colors.redPrimary;
          //     }
          //   }
          // }

          return [LaunchpadLabelStatus.draft.value,
            LaunchpadLabelStatus.pending.value,
            LaunchpadLabelStatus.voting.value].includes(status.value) ? (
            <Box>
              <Text
                color={color}
              >{`${row.goalBalance} ${row.liquidityToken.symbol}`}</Text>
            </Box>
          ) : (
            <Box>
              <Flex color={color} alignItems={'center'} gap={1}>
                {`${row.totalValue} / ${row.goalBalance} `}
                <Flex className={'liquidity-token'} alignItems={'center'} gap={1}>
                  <img src={row.liquidityToken.thumbnail || TOKEN_ICON_DEFAULT} />
                  {row.liquidityToken.symbol}
                </Flex>
              </Flex>
              <Box mb={2} />
              <Progress
                max={100}
                value={(Number(row.totalValue) / Number(row.goalBalance)) * 100}
                h="6px"
                className={'progress-bar'}
              />
              <Text className="note" mt={1}>
                ${formatCurrency(row.totalValueUsd, 2)}
              </Text>
            </Box>
          );
        },
      },
      {
        id: 'hardCap',
        label: 'Hard Cap',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: ILaunchpad) {
          const color = colors.white;
          return Number(row?.thresholdBalance || 0) > 0 ? (
            <Box>
              <Text
                color={color}
              >{`${formatCurrency(row.thresholdBalance)} ${row.liquidityToken.symbol}`}</Text>
            </Box>
          ) : 'N/A';
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
          if ([LaunchpadLabelStatus.draft.value, LaunchpadLabelStatus.pending.value].includes(status.value)) {
            return (
              <Box>
                <Text>
                    <span style={{ color: colors.white500, fontSize: px2rem(14) }}>
                      Starts at:
                    </span>{' '}
                  {moment(row.launchStart).format('MMM, DD')}
                </Text>
                <Flex mt={1} alignItems={'center'} gap={2}>
                  <ImClock2 />
                  <Text>
                    <CountDownTimer end_time={row.launchStart} />
                  </Text>
                </Flex>
              </Box>
            );
          }
          if (status.value === LaunchpadLabelStatus.voting.value) {
            return (
              <Box>
                <Text>
                    <span style={{ color: colors.white500, fontSize: px2rem(14) }}>
                      Ends at:
                    </span>{' '}
                  {moment(row?.voteEnd).format('MMM, DD')}
                </Text>
                <Flex mt={1} alignItems={'center'} gap={2}>
                  <ImClock2 />
                  <Text>
                    <CountDownTimer end_time={row?.voteEnd} />
                  </Text>
                </Flex>
              </Box>
            );
          }
          if (status.value === LaunchpadLabelStatus.launching.value) {
            return (
              <Box>
                <Text>
                    <span style={{ color: colors.white500, fontSize: px2rem(14) }}>
                      Ends at:
                    </span>{' '}
                  {moment(row.launchEnd).format('MMM, DD')}
                </Text>
                <Flex mt={1} alignItems={'center'} gap={2}>
                  <ImClock2 />
                  <Text>
                    <CountDownTimer end_time={row.launchEnd} />
                  </Text>
                </Flex>
              </Box>
            );
          }
          if (
            [LaunchpadLabelStatus.successful.value, LaunchpadLabelStatus.failed.value].includes(status.value)
          ) {
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
          if (
            compareString(row.creatorAddress, account) &&
            [LAUNCHPAD_STATUS.Pending].includes(row?.state)
          ) {
            return (
              <Flex alignItems={'center'} gap={4}>
                <Box
                  cursor={'pointer'}
                  onClick={() =>
                    router.push(`${ROUTE_PATH.LAUNCHPAD_MANAGE}?id=${row.id}`)
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

          return (
            <Flex alignItems={'center'} gap={4}>
              {compareString(row.creatorAddress, account) &&
                (!row?.proposalId ||
                  moment(row?.userProposal?.voteStart).unix() > moment().unix()) && (
                  <InfoTooltip label={'Edit Proposal'}>
                    <Box
                      cursor={'pointer'}
                      onClick={() =>
                        router.push(`${ROUTE_PATH.LAUNCHPAD_MANAGE}?id=${row.id}`)
                      }
                    >
                      <BsPencil />
                    </Box>
                  </InfoTooltip>
                )}
              {[LAUNCHPAD_STATUS.Voting].includes(row?.state) && (
                <InfoTooltip label={'Proposal Detail'}>
                  <Box
                    cursor={'pointer'}
                    onClick={() =>
                      router.push(
                        `${ROUTE_PATH.LAUNCHPAD_PROPOSAL}?proposal_id=${row?.proposalId}`,
                      )
                    }
                  >
                    <BsBoxArrowUpRight />
                  </Box>
                </InfoTooltip>
              )}
            </Flex>
          );
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
          <Text>Submit Your Launchpad</Text>
        </FiledButton>
      </Flex>

      <Box className="content">
        <ListTable
          data={data}
          columns={columns}
          initialLoading={loading}
          onItemClick={(e: ILaunchpad) => {
            if (!e.id) {
              return null;
            }
            return router.push(`${ROUTE_PATH.LAUNCHPAD_DETAIL}?id=${e.id}`);
            // const isLaunchPad = checkIsLaunchpad(e);
            // if (isLaunchPad) {
            //   return router.push(`${ROUTE_PATH.LAUNCHPAD_DETAIL}?id=${e.id}`);
            // } else if (e.proposalId) {
            //   return router.push(
            //     `${ROUTE_PATH.LAUNCHPAD_PROPOSAL}?proposal_id=${e.proposalId}`,
            //   );
            // } else {
            //   return router.push(`${ROUTE_PATH.LAUNCHPAD_MANAGE}?id=${e.id}`);
            // }
          }}
        />
      </Box>
    </StyledIdoContainer>
  );
};

export default LaunchpadContainer;