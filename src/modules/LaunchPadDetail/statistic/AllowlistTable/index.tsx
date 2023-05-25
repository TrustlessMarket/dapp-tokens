/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {AutoSizer, List} from '@/components/ReactVirtualized';
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
import {useWindowSize} from '@trustless-computer/dapp-core';
import cs from 'classnames';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import Jazzicon, {jsNumberForAddress} from 'react-jazzicon';
import s from './styles.module.scss';
import {CDN_URL} from '@/configs';
import SvgInset from '@/components/SvgInset';
import {abbreviateNumber, compareString, formatCurrency, shortenAddress} from "@/utils";
import Search from "@/modules/LaunchPadDetail/statistic/Search";
import toast from "react-hot-toast";
import {getLaunchpadDepositInfo, getLaunchpadUserDepositInfo} from "@/services/launchpad";
import {useWeb3React} from "@web3-react/core";
import Empty from "@/components/Empty";

const AllowlistTable = ({poolDetail, isFull = true}: any) => {
  const [depositList, setDepositList] = useState<any[]>(
    []
  );
  const [scrollToIndex, setScrollToIndex] = useState<any>(
    undefined
  );
  const { mobileScreen, tabletScreen } = useWindowSize();

  const { account } = useWeb3React();

  useEffect(() => {
    if(poolDetail?.id) {
      fetchDepositInfo();
    }
  }, [account, poolDetail?.id]);

  const fetchDepositInfo = async () => {
    try {
      const [res] = await Promise.all([
        getLaunchpadDepositInfo({pool_address: poolDetail?.launchpad}),
        getLaunchpadUserDepositInfo({pool_address: poolDetail?.launchpad, address: account})
      ]);
      const list = res?.map((item: any, index: number) => ({
        ...item,
        index: index + 1,
        isCurrentUser: compareString(item?.userAddress, account),
      }))
      if(isFull) {
        setDepositList(list);
      } else {
        const you = list.find((item: any) => item?.isCurrentUser);
        if(you) {
          setDepositList([you]);
        } else if(list?.length > 0) {
          setDepositList(res[0]);
        }
      }
    } catch (err: unknown) {
      console.log(err);
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

  const RowRenderer = ({ index, key, style, data }: any) => {
    const item = data[index];
    return (
      <div
        key={key}
        style={style}
        className={cs(s.dataItem, {
          [`${s.dataItem__currentUser}`]: item.isCurrentUser,
          [`${s.dataItem__searchHighlight}`]: index === scrollToIndex,
        })}
      >
        <div
          className={cs(s.dataItemInner, item.isCurrentUser && s.currentUser)}
        >
          <div className={s.dataId}>{item?.index}</div>
          <div className={s.dataUserInfo}>
            {item.avatar ? (
              <Image
                width={48}
                height={48}
                className={s.avatar}
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
              className={cs(s.userWallet, item.isCurrentUser ? s.userWallet__black : s.userWallet__white)}
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
          <div className={s.dataContribute}>
            <span className={s.dataLabel}>Contribution</span>
            <span className={cs(s.dataValue, item.isCurrentUser ? s.dataValue__black : s.dataValue__white)}>
              ${formatCurrency(item.amountUsd, 2)}
              {/*<span className={s.dataContribute_divider}></span>*/}
              <span className={s.percentage}>
                {formatCurrency(item.amount)} {poolDetail?.liquidityToken?.symbol}
              </span>
            </span>
          </div>
          <Popover trigger="hover" isLazy>
            <PopoverTrigger>
              <div className={s.dataToken}>
                <span className={s.dataLabel}>
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
                        className={s.boostTag}
                        fontWeight={700}
                        lineHeight={1.5}
                      >
                        {item.boost}%
                      </Text>
                    </Box>
                  )}
                </span>
                <span className={s.dataValue}>
                  {`${abbreviateNumber(item.userLaunchpadBalance)} ${poolDetail?.launchpadToken?.symbol}`}{' '}
                  <span className={cs(s.percentage, item.isCurrentUser ? s.dataValue__black : s.dataValue__white)}>
                    {`(${item.percentHolding.toFixed(2)}%)`}
                  </span>
                </span>
              </div>
            </PopoverTrigger>
            {item.isCurrentUser && (
              <PopoverContent className={s.popoverWrapper} w={'fit-content'}>
                <PopoverArrow />
                <PopoverBody p={`${px2rem(6)} ${px2rem(16)}`}>
                  <Text
                    fontSize={`${px2rem(14)}`}
                    lineHeight={2.2}
                    fontWeight={500}
                    whiteSpace={'nowrap'}
                    color={"#000000"}
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
                      {item.boost}%
                    </Text>{' '}
                    boost.
                  </Text>
                </PopoverBody>
              </PopoverContent>
            )}
          </Popover>
        </div>
      </div>
    );
  };

  const onSearchAddress = (searchTerm: string): void => {
    const index = depositList.findIndex(
      item =>
        item?.userAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.ens?.toLowerCase().includes(searchTerm.toLowerCase())
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
            rowCount={depositList.length}
            rowHeight={getRowHeight()}
            rowRenderer={props => <RowRenderer {...props} data={depositList} />}
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

  return (
    <div className={cs(s.allowListTable)}>
      <div className={s.allowListTableWrapper}>
        {
          isFull ? (
            <>
              <Search onSearch={onSearchAddress} />
              <div className={cs(s.dataListWrapper)}>
                {depositList.length === 0 && (
                  <div className={s.loadingWrapper}>
                    <Spinner size={'xl'} />
                  </div>
                )}
                {depositList.length > 0 && <DataTable />}
              </div>
            </>
          ) : (
            <>
              {
                depositList.length === 0 ? (
                  <Empty isTable={false} />
                ) : (
                  <RowRenderer index={0} key={"you"} data={depositList} />
                )
              }
            </>
          )
        }
      </div>
    </div>
  );
};

export default React.memo(AllowlistTable);
