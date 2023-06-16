/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CountDownTimer from '@/components/Countdown';
import SocialToken from '@/components/Social';
import FiledButton from '@/components/Swap/button/filedButton';
import Faq from '@/components/Swap/faq';
import InfoTooltip from '@/components/Swap/infoTooltip';
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import SectionContainer from '@/components/Swap/sectionContainer';
import {ROUTE_PATH} from '@/constants/route-path';
import {ILaunchpad} from '@/interfaces/launchpad';
import {IToken} from '@/interfaces/token';
import VerifiedBadgeLaunchpad from '@/modules/Launchpad/verifiedBadgeLaunchpad';
import {getListLaunchpad} from '@/services/launchpad';
import {useAppSelector} from '@/state/hooks';
import {selectPnftExchange} from '@/state/pnftExchange';
import {colors} from '@/theme/colors';
import {abbreviateNumber, compareString, formatCurrency, getTokenIconUrl,} from '@/utils';
import {Box, Flex, Progress, Text, Tooltip} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import {useRouter} from 'next/router';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {BsPencil, BsPencilFill} from 'react-icons/bs';
import {FaFireAlt} from 'react-icons/fa';
import {useDispatch, useSelector} from 'react-redux';
import {FAQStyled} from '../LaunchpadManage/LaunchpadManage.styled';
import LaunchpadStatus, {LAUNCHPAD_STATUS, LaunchpadLabelStatus, useLaunchPadStatus,} from './Launchpad.Status';
import {StyledIdoContainer} from './Launchpad.styled';
import {getIsAuthenticatedSelector} from "@/state/user/selector";
import {showError} from "@/utils/toast";
import {WalletContext} from "@/contexts/wallet-context";
import ModalCreateToken from "@/modules/Tokens/ModalCreateToken";
import Button from '@/components/Button';

const LaunchpadContainer = () => {
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const { account } = useWeb3React();
  // const dispatch = useDispatch();
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const router = useRouter();
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const { onDisconnect, onConnect, requestBtcAddress } = useContext(WalletContext);
  const [showModal, setShowModal] = useState(false);

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
              <div className="avatar">
                {compareString(token.owner, account) && (
                  <Box title="Update token info" className="update-info">
                    <BsPencilFill attributeName="action" />
                    <div
                      className="fade-action"
                      aria-current="true"
                      onClick={() =>
                        router.push(
                          `${ROUTE_PATH.UPDATE_TOKEN_INFO}?address=${token.address}`,
                        )
                      }
                    />
                  </Box>
                )}
                <img src={getTokenIconUrl(token)} />
              </div>
              <Box>
                <Flex gap={1} alignItems={'center'} className="record-title">
                  {token.name} <span>{token.symbol}</span>
                  <VerifiedBadgeLaunchpad launchpad={row} />
                </Flex>
                <Text className="note">{token.network}</Text>
              </Box>
            </Flex>
          );
        },
      },
      {
        id: 'rewards',
        label: (
          <InfoTooltip
            showIcon={true}
            label="The total number of tokens that the contributors will receive after the crowdfunding ends."
          >
            Reward pool
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
          let percent = 0;
          if (Number(row.launchpadBalance) > 0 && Number(token.totalSupply) > 0) {
            percent = new BigNumber(row.launchpadBalance)
              .div(token.totalSupply)
              .multipliedBy(100)
              .toNumber();
          }

          return row.launchpadBalance ? (
            <Flex direction={'column'}>
              <Tooltip
                placement="bottom"
                label={`${formatCurrency(row.launchpadBalance)} ${token?.symbol}`}
              >
                <Text>
                  {abbreviateNumber(row.launchpadBalance)} {token?.symbol}
                </Text>
              </Tooltip>

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
            <Tooltip
              placement="bottom"
              label={`${
                Number(token.totalSupply) > 10 ** 6
                  ? formatCurrency(token.totalSupply)
                  : formatCurrency(token.totalSupply, Number(token?.decimal || 18))
              } ${token?.symbol}`}
            >
              <Text>{`${
                token.totalSupply
                  ? `${
                      Number(token.totalSupply) > 10 ** 6
                        ? abbreviateNumber(token.totalSupply)
                        : formatCurrency(
                            token.totalSupply,
                            Number(token?.decimal || 18),
                          )
                    } ${token?.symbol}`
                  : 'N/A'
              }`}</Text>
            </Tooltip>
          );
        },
      },
      {
        id: 'ratio',
        label: (
          <InfoTooltip
            showIcon={true}
            label="The amount of your token that is used to add initial liquidity for trading purposes after the crowdfunding ends"
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
                  ? `${formatCurrency(row.liquidityRatio)}% of funded`
                  : 'N/A'
              }`}</Text>
              <Tooltip
                label={`${formatCurrency(row.liquidityBalance)} ${token?.symbol}`}
              >
                <Text className="note">{`${
                  token.totalSupply
                    ? `${abbreviateNumber(row.liquidityBalance)} ${token?.symbol}`
                    : 'N/A'
                }`}</Text>
              </Tooltip>
            </Box>
          );
        },
      },
      {
        id: 'goal',
        label: (
          <InfoTooltip
            showIcon={true}
            label="The minimum amount that the project would like to raise. If the crowdfunding does not reach the Funding Goal, the funded amount will be returned to the contributors"
          >
            Funding Goal
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

          return [
            LaunchpadLabelStatus.draft.value,
            LaunchpadLabelStatus.pending.value,
            LaunchpadLabelStatus.voting.value,
          ].includes(status.value) ? (
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
                  <img src={getTokenIconUrl(row.liquidityToken)} />
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
        label: (
          <InfoTooltip
            showIcon={true}
            label="The maximum amount that the project would like to raise. The crowdfunding will stop upon reaching its hard cap"
          >
            Hard Cap
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
          const color = colors.white;
          return Number(row?.thresholdBalance || 0) > 0 ? (
            <Box>
              <Text color={color}>{`${formatCurrency(row.thresholdBalance)} ${
                row.liquidityToken.symbol
              }`}</Text>
            </Box>
          ) : (
            'N/A'
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
          if ([LAUNCHPAD_STATUS.Pending].includes(row?.state)) {
            return (
              <Box>
                <Flex mt={1} alignItems={'center'} gap={2}>
                  <FaFireAlt />
                  <Text>
                    <CountDownTimer end_time={row.voteStart} />
                  </Text>
                </Flex>
                <Text className="note">Time left</Text>
              </Box>
            );
          }
          if ([LAUNCHPAD_STATUS.Voting].includes(row?.state)) {
            return (
              <Box>
                <Flex mt={1} alignItems={'center'} gap={2}>
                  <FaFireAlt />
                  <Text>
                    <CountDownTimer end_time={row?.voteEnd} />
                  </Text>
                </Flex>
                <Text className="note">Ends at</Text>
              </Box>
            );
          }
          if ([LAUNCHPAD_STATUS.PrepareLaunching].includes(row?.state)) {
            return (
              <Box>
                <Flex mt={1} alignItems={'center'} gap={2}>
                  <FaFireAlt />
                  <Text>
                    <CountDownTimer end_time={row.launchStart} />
                  </Text>
                </Flex>
                <Text className="note">Time left</Text>
              </Box>
            );
          }
          if ([LAUNCHPAD_STATUS.Launching].includes(row?.state)) {
            return (
              <Box>
                <Flex mt={1} alignItems={'center'} gap={2}>
                  <FaFireAlt />
                  <Text>
                    <CountDownTimer end_time={row.launchEnd} />
                  </Text>
                </Flex>
                <Text className="note">Ends at</Text>
              </Box>
            );
          }
          if (
            [
              LAUNCHPAD_STATUS.Successful,
              LAUNCHPAD_STATUS.Failed,
            ].includes(row?.state)
          ) {
            return (
              <Box>
                <Flex mt={1} alignItems={'center'} gap={2}>
                  <FaFireAlt />
                  <Text>{moment(row.lpTokenReleaseTime).format('LL')}</Text>
                </Flex>
                <Text className="note">Release time</Text>
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
          return (
            <Flex alignItems={'center'} gap={2}>
              <LaunchpadStatus row={row} />
              {
                compareString(row.creatorAddress, account) &&
                [
                  LAUNCHPAD_STATUS.Draft,
                  LAUNCHPAD_STATUS.Pending,
                  LAUNCHPAD_STATUS.Voting,
                  LAUNCHPAD_STATUS.PrepareLaunching
                ].includes(row?.state) && (
                  <Box
                    cursor={'pointer'}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      router.push(`${ROUTE_PATH.LAUNCHPAD_MANAGE}?id=${row.id}`)
                    }}
                    paddingX={2}
                  >
                    <BsPencil />
                  </Box>
                )
              }
            </Flex>
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
        render(row: ILaunchpad) {
          const token: IToken = row.launchpadToken;
          return <SocialToken socials={token.social} />;
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

  const handleConnectWallet = async () => {
    try {
      await onConnect();
      await requestBtcAddress();
    } catch (err) {
      showError({
        message: (err as Error).message,
      });
      console.log(err);
      onDisconnect();
    }
  };

  const handleCreateToken = () => {
    if (!isAuthenticated) {
      handleConnectWallet();
      // router.push(ROUTE_PATH.CONNECT_WALLET);
    } else {
      setShowModal(true);
    }
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

      <Flex mb={8} mt={8} justifyContent={'center'} gap={8}>
        <FiledButton btnSize="h" onClick={onShowCreateIDO}>
          <Text>Submit Your Launchpad</Text>
        </FiledButton>
        <Button
            className="button-create-box"
            background={'white'}
            onClick={handleCreateToken}
          >
            <Text
              size="medium"
              color={'black'}
              className="button-text"
              fontWeight="medium"
            >
              Create SMART BRC-20
            </Text>
          </Button>
      </Flex>

      <Box className="content">
        <ListTable
          data={data}
          columns={columns}
          initialLoading={loading}
          onItemClick={(e: ILaunchpad) => {
            console.log(e);

            if (!e.id) {
              return null;
            }
            return router.push(`${ROUTE_PATH.LAUNCHPAD_DETAIL}?id=${e.id}`);
          }}
        />
      </Box>
      <SectionContainer>
        <FAQStyled style={{ border: 'none' }}>
          <Text as={'h3'}>FAQs</Text>
          <Faq
            data={[
              {
                q: 'I am new to New Bitcoin DEX. How do I start voting and contributing to projects on the launchpad?',
                a: `You can follow this step-by-step instruction: <a href="${ROUTE_PATH.LAUNCHPAD_GET_STARTED}">Get started</a>`,
              },
              {
                q: 'Is the launchpad run by smart contracts?',
                a: `Yes, the Trustless Launchpad operates entirely through smart contracts to ensure fairness and decentralization\n\nPlease note that the launchpad is permissionless, allowing anyone to submit their project. Therefore, it is crucial to DYOR (Do Your Own Research) before voting and contributing to projects`,
              },
              {
                q: 'What benefits do I receive by voting for projects on Trustless Launchpad?',
                a: `Here is the Trustless Launchpad voting mechanism:\n\n    - TM token holders will have the governance right to vote if a project should be on the launchpad or not.\n    - The voting period for each project will be 3 days\n    - 1 TM = 1 vote (you can vote with any amount of TM, even fractional amounts such as 0.1)\n    - Your TM tokens will be locked for 30 days after voting\n    - Projects that receive a minimum of 100 votes will proceed to the launchpad\n    - If a project is listed on the launchpad, <b>voters will receive 5% of the project's total crowdfunding amount proportionally in project’s tokens</b>
            `,
              },
              {
                q: 'How do I get TM token to vote for projects?',
                a: `If you don’t have $TM, you can earn 1 $TM for each time you add liquidity and 0.1 $TM for each swap on <a href="${ROUTE_PATH.MARKETS}">New Bitcoin DEX</a>. Alternatively, join our <a href="https://discord.com/invite/HPuZHUexgv">Discord channel</a> for updates about potential $TM airdrops.
            `,
              },
            ]}
          />
        </FAQStyled>
      </SectionContainer>
      <ModalCreateToken show={showModal} handleClose={() => setShowModal(false)} />
    </StyledIdoContainer>
  );
};

export default LaunchpadContainer;
