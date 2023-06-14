/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Empty from '@/components/Empty';
import { AutoSizer, List } from '@/components/ReactVirtualized';
import SvgInset from '@/components/SvgInset';
import { CDN_URL } from '@/configs';
import Search from '@/modules/LaunchPadDetail/statistic/Search';
import {
  getLaunchpadDepositInfo,
  getLaunchpadUserDepositInfo,
} from '@/services/launchpad';
import {useAppDispatch, useAppSelector} from '@/state/hooks';
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
import cs from 'classnames';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import styles from './styles.module.scss';
import {closeModal, openModal} from "@/state/modal";
import cx from "classnames";
import ContributeHistory from "@/modules/LaunchPadDetail/contributeHistory";

const AllowlistTable = ({ poolDetail, isFull = true, handleViewMore }: any) => {
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const [depositList, setDepositList] = useState<any[]>([]);
  const [rawDepositList, setRawDepositList] = useState<any[]>([]);
  const [scrollToIndex, setScrollToIndex] = useState<any>(undefined);
  const { mobileScreen, tabletScreen } = useWindowSize();
  const [isLoadingDepositList, setIsLoadingDepositList] = useState(true);

  const { account } = useWeb3React();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (poolDetail?.id) {
      fetchDepositInfo();
    }
  }, [account, poolDetail?.id, needReload]);

  const fetchDepositInfo = async () => {
    try {
      setIsLoadingDepositList(true);
      const [deposits, userDeposit] = await Promise.all([
        getLaunchpadDepositInfo({ pool_address: poolDetail?.launchpad }),
        getLaunchpadUserDepositInfo({
          pool_address: poolDetail?.launchpad,
          address: account,
        }),
      ]);
      const list = deposits?.map((item: any, index: number) => ({
        ...item,
        index: index + 1,
        isCurrentUser: compareString(item?.userAddress, account),
      }));
      setRawDepositList(list);
      const you = list.find((item: any) => item?.isCurrentUser);

      if(!you && userDeposit?.userAddress) {
        setRawDepositList([...list, { ...userDeposit, index: list?.length + 1, isCurrentUser: true }]);
      }

      if (isFull) {
        setDepositList(list);
      } else {
        if (you) {
          setDepositList([you]);
        } else {
          if (userDeposit?.userAddress) {
            setDepositList([{ ...userDeposit, index: 1, isCurrentUser: true }]);
          } else if (list?.length > 0) {
            setDepositList([list[0]]);
          }
        }
      }
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setIsLoadingDepositList(false);
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

  const RowRenderer = ({ index, key, style, data, onShowContributeHistory }: any) => {
    const item = data[index];
    return (
      <Box
        key={key}
        style={style}
        className={cs(styles.dataItem, {
          [`${styles.dataItem__currentUser}`]: item.isCurrentUser,
          [`${styles.dataItem__searchHighlight}`]: index === scrollToIndex,
        })}
        cursor={onShowContributeHistory ? 'pointer' : 'default'}
        onClick={() => onShowContributeHistory && onShowContributeHistory()}
      >
        <div className={cs(styles.dataItemInner, item.isCurrentUser && styles.currentUser)}>
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
              className={cs(
                styles.userWallet,
                item.isCurrentUser ? styles.userWallet__black : styles.userWallet__white,
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
              className={cs(
                styles.dataValue,
                item.isCurrentUser ? styles.dataValue__black : styles.dataValue__white,
              )}
            >
              ${formatCurrency(item.amountUsd, 2)}
              {/*<span className={s.dataContribute_divider}></span>*/}
              <span className={styles.percentage}>
                ({formatCurrency(item.amount)} {poolDetail?.liquidityToken?.symbol})
              </span>
            </span>
          </div>
          <Popover trigger="hover" isLazy>
            <PopoverTrigger>
              <div className={styles.dataToken}>
                <span className={styles.dataLabel}>
                  Allocation
                  {item.isCurrentUser && item.boost >= 0 && (
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
                        {formatCurrency(item.boost, 2)}%
                      </Text>
                    </Box>
                  )}
                </span>
                <span className={styles.dataValue}>
                  {`${abbreviateNumber(item.userLaunchpadBalance)} ${
                    poolDetail?.launchpadToken?.symbol
                  }`}{' '}
                  <span
                    className={cs(
                      styles.percentage,
                      item.isCurrentUser ? styles.dataValue__black : styles.dataValue__white,
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
                      {formatCurrency(item.boost, 2)}%
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
    const close = () => dispatch(closeModal({id}));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Contribution History',
        className: cx(styles.modalContent, styles.hideCloseButton),
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => {
          return <ContributeHistory onClose={close} />;
        },
      }),
    );
  }

  return (
    <div className={cs(styles.allowListTable)}>
      <div className={styles.allowListTableWrapper}>
        {isLoadingDepositList ? (
          <div className={styles.loadingWrapper}>
            <Spinner size={'xl'} />
          </div>
        ) : (
          <>
            {isFull ? (
              <>
                <Search onSearch={onSearchAddress} />
                <div className={cs(styles.dataListWrapper)}>
                  {depositList.length === 0 && <Empty isTable={false} />}
                  {depositList.length > 0 && <DataTable />}
                </div>
              </>
            ) : (
              <>
                {depositList.length === 0 ? (
                  <Empty isTable={false} />
                ) : (
                  <RowRenderer index={0} key={'you'} data={depositList} onShowContributeHistory={handleShowContributeHistory}/>
                )}
              </>
            )}
          </>
        )}
        {rawDepositList.length > 1 && !isFull && (
          <Text
            color={'#1588FF'}
            fontWeight={'500'}
            fontSize={px2rem(20)}
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
