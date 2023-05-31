/* eslint-disable @typescript-eslint/no-explicit-any */
import SocialToken from '@/components/Social';
import BodyContainer from '@/components/Swap/bodyContainer';
import InfoTooltip from '@/components/Swap/infoTooltip';
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import {TOKEN_ICON_DEFAULT} from '@/constants/common';
import {ROUTE_PATH} from '@/constants/route-path';
import useTCWallet from '@/hooks/useTCWallet';
import {IProposal} from '@/interfaces/proposal';
import {IToken} from '@/interfaces/token';
import ProposalStatus from '@/modules/Proposal/Proposal.Status';
import {getListProposals} from '@/services/proposal';
import {useAppSelector} from '@/state/hooks';
import {selectPnftExchange} from '@/state/pnftExchange';
import {colors} from '@/theme/colors';
import {compareString, formatCurrency} from '@/utils';
import px2rem from '@/utils/px2rem';
import {Box, Flex, Text} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import {useRouter} from 'next/router';
import {useEffect, useMemo, useState} from 'react';
import {BsPencil} from 'react-icons/bs';
import web3 from 'web3';
import styles from './styles.module.scss';

const ProposalList = () => {
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const { tcWalletAddress: account } = useTCWallet();
  // const dispatch = useDispatch();
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const router = useRouter();

  useEffect(() => {
    getData();
  }, [needReload]);

  const getData = async () => {
    try {
      const response: any = await getListProposals({
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
        render(row: IProposal) {
          const token: IToken = row?.userPool?.launchpadToken;
          return (
            <Flex gap={4} color={'#FFFFFF'} alignItems={'center'}>
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
        render(row: IProposal) {
          const token: IToken = row?.userPool?.launchpadToken;
          const userPool = row?.userPool;
          let percent = 0;
          if (
            Number(userPool.launchpadBalance) > 0 &&
            Number(token.totalSupply) > 0
          ) {
            percent = new BigNumber(userPool.launchpadBalance)
              .div(token.totalSupply)
              .multipliedBy(100)
              .toNumber();
          }

          return userPool.launchpadBalance ? (
            <Flex direction={'column'} color={'#FFFFFF'}>
              <Text>
                {formatCurrency(userPool.launchpadBalance, 18)} {token?.symbol}
              </Text>
              <Text fontSize={'xs'} color={'rgba(255,255,255,0.7)'}>
                {formatCurrency(percent, 2)}% of Supply
              </Text>
            </Flex>
          ) : (
            <Text color={'#FFFFFF'}>N/A</Text>
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
        render(row: IProposal) {
          const token: IToken = row?.userPool?.launchpadToken;
          return (
            <Text color={'#FFFFFF'}>{`${
              token.totalSupply ? (
                `${formatCurrency(token.totalSupply, 18)} ${token?.symbol}`
              ) : (
                <Text color={'#FFFFFF'}>N/A</Text>
              )
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
        render(row: IProposal) {
          const token: IToken = row?.userPool?.launchpadToken;
          const userPool = row?.userPool;
          return (
            <Box color={'#FFFFFF'}>
              <Text>{`${
                userPool.liquidityRatio
                  ? `${formatCurrency(
                    new BigNumber(
                      web3.utils.toWei(userPool.liquidityRatio).toString(),
                    )
                      .dividedBy(10000)
                      .toString(),
                    18,
                  )}%`
                  : 'N/A'
              }`}</Text>
              <Text>{`${
                token.totalSupply
                  ? `${formatCurrency(userPool.liquidityBalance, 18)} ${
                    token?.symbol
                  }`
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
        render(row: IProposal) {
          const userPool = row?.userPool;
          return (
            <Flex direction={'column'} color={'#FFFFFF'}>
              <Text>{`${userPool.goalBalance} ${userPool?.liquidityToken.symbol}`}</Text>
              <Text mt={2}>${formatCurrency(userPool.totalValueUsd, 2)}</Text>
            </Flex>
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
        render(row: IProposal) {
          console.log('row', row);
          // const [status] = useProposalStatus({ row });

          // console.log('useProposalStatus', status);

          // if (status.value === 'upcoming') {
          //   return (
          //     <Box>
          //       <Text>
          //         <span style={{ color: colors.white500, fontSize: px2rem(14) }}>
          //           Starts at:
          //         </span>{' '}
          //         {moment(row.startTime).format('MMM, DD')}
          //       </Text>
          //       <Flex mt={1} alignItems={'center'} gap={2}>
          //         <ImClock2 />
          //         <Text>
          //           <CountDownTimer end_time={row.startTime} />
          //         </Text>
          //       </Flex>
          //     </Box>
          //   );
          // }
          // if (status.value === 'crowing-funding') {
          //   return (
          //     <Box>
          //       <Text>
          //         <span style={{ color: colors.white500, fontSize: px2rem(14) }}>
          //           Ends at:
          //         </span>{' '}
          //         {moment(row.endTime).format('MMM, DD')}
          //       </Text>
          //       <Flex mt={1} alignItems={'center'} gap={2}>
          //         <ImClock2 />
          //         <Text>
          //           <CountDownTimer end_time={row.endTime} />
          //         </Text>
          //       </Flex>
          //     </Box>
          //   );
          // }
          // if (status.value === 'success' && status.key !== LAUNCHPAD_STATUS.Closed) {
          //   return (
          //     <Box>
          //       <Text>
          //         <span style={{ color: colors.white500, fontSize: px2rem(14) }}>
          //           Release time:
          //         </span>{' '}
          //       </Text>
          //       <Flex mt={1} alignItems={'center'} gap={2}>
          //         <ImClock2 />
          //         <Text>{moment(row.lpTokenReleaseTime).format('LL')}</Text>
          //       </Flex>
          //     </Box>
          //   );
          // }

          return (
            <Box>
              <Flex gap={1}>
                <Text color={colors.white500} fontSize={px2rem(14)}>
                  Starts at:
                </Text>
                <Text color={colors.white}>
                  {moment(row.voteStart).format('LLL')}
                </Text>
              </Flex>
              <Flex gap={1}>
                <Text color={colors.white500} fontSize={px2rem(14)}>
                  Ends at:
                </Text>
                <Text color={colors.white}>{moment(row.voteEnd).format('LLL')}</Text>
              </Flex>
            </Box>
          );

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
        render(row: IProposal) {
          return <ProposalStatus row={row} />;
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
        render(row: IProposal) {
          const token: IToken = row?.userPool?.launchpadToken;
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
        render(row: IProposal) {
          const userPool = row?.userPool;
          if (compareString(userPool.creatorAddress, account)) {
            return (
              <Flex alignItems={'center'} gap={4}>
                <Box
                  cursor={'pointer'}
                  onClick={() =>
                    router.push(
                      `${ROUTE_PATH.LAUNCHPAD_MANAGE}?id=${userPool.launchpad}`,
                    )
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

  // const onShowCreateIDO = async (_ido?: any) => {
  //   return router.push(`${ROUTE_PATH.LAUNCHPAD_MANAGE}`);
  // };

  return (
    <BodyContainer className={styles.wrapper}>
      <Text as={'h1'} className="title" color={'#FFFFFF'} textAlign={'center'}>
        Proposal
      </Text>
      <Text
        className="desc"
        color={'#FFFFFF'}
        textAlign={'center'}
        maxWidth={'1024px'}
        marginX={'auto'}
      >
        Welcome to DeFi crowdfunding on Bitcoin. A place where you can support
        innovative projects and ideas all while leveraging the power of blockchain.
        Join us as we revolutionize the future of crowdfunding!
      </Text>

      <Flex mb={'24px'} mt={'24px'} justifyContent={'center'}>
        {/*<FiledButton btnSize="h" onClick={onShowCreateIDO}>
          <Text>Submit Your Proposal</Text>
        </FiledButton>*/}
      </Flex>

      <Box className="content">
        <ListTable
          data={data}
          columns={columns}
          initialLoading={loading}
          onItemClick={(e) => {
            return router.push(
              `${ROUTE_PATH.LAUNCHPAD_PROPOSAL}?proposal_id=${e.proposalId}`,
            );
          }}
        />
      </Box>
    </BodyContainer>
  );
};

export default ProposalList;
