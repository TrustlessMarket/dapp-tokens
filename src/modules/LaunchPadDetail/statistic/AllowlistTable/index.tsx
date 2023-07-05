/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Empty from '@/components/Empty';
import { AutoSizer, List } from '@/components/ReactVirtualized';
import SvgInset from '@/components/SvgInset';
import { CDN_URL } from '@/configs';
import Search from '@/modules/LaunchPadDetail/statistic/Search';
import {
  getDepositResultLaunchpad,
  getUserDepositInfoLaunchpad,
} from '@/services/launchpad';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import {
  abbreviateNumber,
  compareString,
  formatCurrency,
  shortenAddress,
} from '@/utils';
import px2rem from '@/utils/px2rem';
import {
  Box,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { useWeb3React } from '@web3-react/core';
import cx from 'classnames';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import styles from './styles.module.scss';
import { closeModal, openModal } from '@/state/modal';
import ContributeHistory from '@/modules/LaunchPadDetail/contributeHistory';
import {IResourceChain} from "@/interfaces/chain";
import {L2_CHAIN_INFO} from "@/constants/chains";

const AllowlistTable = ({
  poolDetail,
  isFull = true,
  handleViewMore,
  userBoost,
}: any) => {
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const [depositList, setDepositList] = useState<any[]>([]);
  const [rawDepositList, setRawDepositList] = useState<any[]>([]);
  const [scrollToIndex, setScrollToIndex] = useState<any>(undefined);
  const { mobileScreen, tabletScreen } = useWindowSize();
  const [isLoading, setIsLoading] = useState(true);
  const currentChain: IResourceChain = useAppSelector(selectPnftExchange).currentChain || L2_CHAIN_INFO;

  const { account } = useWeb3React();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (poolDetail?.id) {
      fetchDepositInfo();
    }
  }, [account, poolDetail?.id, needReload, currentChain?.chain]);

  const fetchDepositInfo = async () => {
    try {
      setIsLoading(true);
      const [deposits, userDeposit] = await Promise.all([
        getDepositResultLaunchpad({ pool_address: poolDetail?.launchpad, network: currentChain?.chain?.toLowerCase() }),
        getUserDepositInfoLaunchpad({
          pool_address: poolDetail?.launchpad,
          address: account,
          network: currentChain?.chain?.toLowerCase()
        }),
      ]);
      const list = deposits?.map((item: any, index: number) => ({
        ...item,
        index: index + 1,
        isCurrentUser: compareString(item?.userAddress, account),
      }));

      let drawList = list;
      setRawDepositList(drawList);
      let you = list.find((item: any) => item?.isCurrentUser);

      if (!you && userDeposit?.userAddress) {
        you = {
          ...userDeposit,
          index: list?.length + 1,
          isCurrentUser: true,
        };
        drawList = [
          ...list, you
        ];
        setRawDepositList(drawList);
      }

      if (isFull) {
        setDepositList(drawList);
      } else {
        if (you) {
          const index = drawList.findIndex((item: any) => {
            return compareString(item.userAddress, you.userAddress);
          });

          if(index > 2) {
            setDepositList([you, ...drawList.slice(0, 2)]);
          } else {
            setDepositList(drawList.slice(0, 3));
          }
        } else {
          setDepositList(drawList.slice(0, 3));
        }
      }
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRowHeight = () => {
    if (mobileScreen) {
      return 120;
    } else if (tabletScreen) {
      return 80;
    }
    return 110;
  };

  const RowRenderer = ({
   index,
   key,
   style,
   data,
   onShowContributeHistory,
  }: any) => {
    const item = data[index];

    let _boost = 0;

    if (userBoost?.user?.address) {
      _boost = userBoost?.boost;
    }

    return (
      <Box
        key={key}
        style={style}
        className={cx(styles.dataItem, {
          [`${styles.dataItem__currentUser}`]: item.isCurrentUser,
          [`${styles.dataItem__searchHighlight}`]: index === scrollToIndex,
        })}
        cursor={
          onShowContributeHistory && item.isCurrentUser ? 'pointer' : 'default'
        }
        onClick={() =>
          onShowContributeHistory && item.isCurrentUser && onShowContributeHistory()
        }
      >
        <div
          className={cx(
            styles.dataItemInner,
            item.isCurrentUser && styles.currentUser,
          )}
        >
          <div className={styles.dataId}>{item?.index}</div>
          <div className={styles.dataUserInfo}>
            {item.avatar ? (
              <Image
                width={48}
                height={48}
                className={styles.avatar}
                src={item.avatar}
                alt="avatar"
              />
            ) : (
              <Jazzicon
                diameter={mobileScreen || tabletScreen ? 24 : 36}
                seed={jsNumberForAddress(item.userAddress)}
              />
            )}

            <Text
              as="span"
              className={cx(
                styles.userWallet,
                item.isCurrentUser
                  ? styles.userWallet__black
                  : styles.userWallet__white,
              )}
              title={item.userAddress}
              maxWidth={
                item.isCurrentUser ? { 'min-pc': '6ch', lg: '10ch' } : 'unset'
              }
            >
              {item.isCurrentUser && <>You</>}
              {!item.isCurrentUser && (
                <>{item.ens ? item.ens : shortenAddress(item.userAddress, 4, 4)}</>
              )}
            </Text>
          </div>
          <div className={styles.dataContribute}>
            <span className={styles.dataLabel}>Contribution</span>
            <span
              className={cx(
                styles.dataValue,
                item.isCurrentUser
                  ? styles.dataValue__black
                  : styles.dataValue__white,
              )}
            >
              ${formatCurrency(item.amountUsd, 2)}
              {/*<span className={s.dataContribute_divider}></span>*/}
              <span className={styles.percentage}>
                ({formatCurrency(item.amount)} {poolDetail?.liquidityToken?.symbol})
              </span>
            </span>
            {
              Number(item.amountPending) > 0 && (
                <span
                  className={cx(
                    styles.dataValue,
                    styles.pendingValue,
                    styles.dataValue__orange,
                  )}
                >
                  Processing {" "}
                  ${formatCurrency(item.amountPendingUsd, 2)}
                  {/*<span className={s.dataContribute_divider}></span>*/}
                  <span className={styles.percentage}>
                ({formatCurrency(item.amountPending)} {poolDetail?.liquidityToken?.symbol})
              </span>
            </span>
              )
            }
          </div>
          <Popover trigger="hover" isLazy>
            <PopoverTrigger>
              <div className={styles.dataToken}>
                <span className={styles.dataLabel}>
                  Allocation
                  {item.isCurrentUser && _boost >= 0 && (
                    <Box
                      display={'inline-flex'}
                      p={`${px2rem(2)} ${px2rem(6)}`}
                      pl={px2rem(4)}
                      bgColor={'#1588FF'}
                      borderRadius={'100px'}
                      alignItems={'center'}
                      gap={px2rem(2)}
                      ml={px2rem(2)}
                    >
                      <SvgInset
                        size={12}
                        svgUrl={`${CDN_URL}/icons/ic-arrow-up.svg`}
                      />
                      <Text
                        color="white"
                        fontSize={`${px2rem(10)}`}
                        className={styles.boostTag}
                        fontWeight={700}
                        lineHeight={1.5}
                      >
                        {formatCurrency(_boost, 2)}%
                      </Text>
                    </Box>
                  )}
                </span>
                <span className={styles.dataValue}>
                  {`${abbreviateNumber(item.userLaunchpadBalance)} ${
                    poolDetail?.launchpadToken?.symbol
                  }`}{' '}
                  <span
                    className={cx(
                      styles.percentage,
                      item.isCurrentUser
                        ? styles.dataValue__black
                        : styles.dataValue__white,
                    )}
                  >
                    {`(${item.percentHolding.toFixed(2)}%)`}
                  </span>
                </span>
              </div>
            </PopoverTrigger>
            {item.isCurrentUser && (
              <PopoverContent className={styles.popoverWrapper} w={'fit-content'}>
                <PopoverArrow />
                <PopoverBody p={`${px2rem(6)} ${px2rem(16)}`}>
                  <Text
                    fontSize={`${px2rem(14)}`}
                    lineHeight={2.2}
                    fontWeight={500}
                    whiteSpace={'nowrap'}
                    color={'#000000'}
                  >
                    Your allocation includes a{' '}
                    <Text
                      as={'span'}
                      fontSize={`${px2rem(14)}`}
                      lineHeight={2.2}
                      fontWeight={600}
                      whiteSpace={'nowrap'}
                      color={'#4185EC'}
                    >
                      {formatCurrency(_boost, 2)}%
                    </Text>{' '}
                    boost.
                  </Text>
                </PopoverBody>
              </PopoverContent>
            )}
          </Popover>
        </div>
      </Box>
    );
  };

  const onSearchAddress = (searchTerm: string): void => {
    const index = depositList.findIndex(
      (item) =>
        item?.userAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.ens?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    if (index === -1) {
      toast.remove();
      toast.error('Record not found');
    }

    if (index !== -1 && searchTerm) {
      setScrollToIndex(index);
    } else {
      setScrollToIndex(undefined);
    }
  };

  const DataTable = () => {
    return (
      <AutoSizer disableWidth>
        {({ height }: { height: any }) => (
          <List
            height={height}
            width={1}
            rowCount={rawDepositList.length}
            rowHeight={getRowHeight()}
            rowRenderer={(props) => <RowRenderer {...props} data={rawDepositList} />}
            containerStyle={{
              width: '100%',
              maxWidth: '100%',
            }}
            style={{
              width: '100%',
            }}
            scrollToIndex={scrollToIndex}
          />
        )}
      </AutoSizer>
    );
  };

  const handleShowContributeHistory = () => {
    const id = 'modalDepositEthFromEthWallet';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Your contribution',
        className: cx(styles.modalContent, styles.hideCloseButton),
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => {
          return <ContributeHistory onClose={close} poolDetail={poolDetail} />;
        },
      }),
    );
  };

  return (
    <div className={cx(styles.allowListTable)}>
      <div className={styles.allowListTableWrapper}>
        {isLoading ? (
          <Flex justifyContent={'center'} alignItems={'center'}>
            <Spinner speed="0.65s" emptyColor="gray.200" color="blue.500" />
          </Flex>
        ) : (
          <>
            {isFull ? (
              <>
                <Search onSearch={onSearchAddress} />
                <div className={cx(styles.dataListWrapper)}>
                  {depositList?.length === 0 && <Empty isTable={false} />}
                  {depositList?.length > 0 && <DataTable />}
                </div>
              </>
            ) : (
              <>
                {depositList?.length === 0 ? (
                  <Empty isTable={false} />
                ) : (
                  <>
                    {
                      depositList?.map((item, index) => {
                        return (
                          <RowRenderer
                            index={index}
                            key={index}
                            data={depositList}
                            onShowContributeHistory={handleShowContributeHistory}
                          />
                        )
                      })
                    }
                  </>
                )}
              </>
            )}
          </>
        )}
        {rawDepositList.length > 3 && !isFull && (
          <Text
            color={'#1588FF'}
            fontWeight={'500'}
            fontSize={[px2rem(14), px2rem(20)]}
            onClick={handleViewMore}
            textAlign={'center'}
            cursor={'pointer'}
          >
            View all
          </Text>
        )}
      </div>
    </div>
  );
};

export default React.memo(AllowlistTable);
