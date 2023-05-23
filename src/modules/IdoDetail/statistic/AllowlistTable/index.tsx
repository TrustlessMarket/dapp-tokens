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
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Text,
} from '@chakra-ui/react';
import {ceilPrecised, useWindowSize} from '@trustless-computer/dapp-core';
import BigNumber from 'bignumber.js';
import cs from 'classnames';
import _camelCase from 'lodash/camelCase';
import Image from 'next/image';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Jazzicon, {jsNumberForAddress} from 'react-jazzicon';
import s from './styles.module.scss';
import {CDN_URL} from '@/configs';
import SvgInset from '@/components/SvgInset';
import {formatCurrency, shortenAddress} from "@/utils";
import {getGMDepositInfo, IGMDepositInfoListItem, IGMDepositInfoResponse} from "@/services/ido";
import Search from "@/modules/IdoDetail/statistic/Search";
import toast from "react-hot-toast";

type TokenList = {
  type: 'turbo' | 'btc' | 'eth' | 'pepe';
  amount: string;
  usdtValue: number;
};

const AllowlistTable: React.FC = (): React.ReactElement => {
  // const router = useRouter();
  const [depositInfo, setDepositInfo] = useState<IGMDepositInfoResponse | null>(
    null
  );
  const [depositList, setDepositList] = useState<Array<IGMDepositInfoListItem>>(
    []
  );
  const [scrollToIndex, setScrollToIndex] = useState<undefined | number>(
    undefined
  );
  const { mobileScreen, tabletScreen } = useWindowSize();
  // const top10UsdtValue = useRef(0);
  const usdValueNeedToGet1GM = useRef(0);

  const getRowHeight = () => {
    if (mobileScreen) {
      return 120;
    } else if (tabletScreen) {
      return 80;
    }
    return 96;
  };

  const fetchGMDepositInfo = async () => {
    try {
      const res = await getGMDepositInfo();
      setDepositInfo(res);
    } catch (err: unknown) {
      console.log(err);
    }
  };

  // const sortByUsdValue = (
  //   a: IGMDepositInfoListItem,
  //   b: IGMDepositInfoListItem
  // ) => {
  //   return b.usdtValue - a.usdtValue;
  // };

  // const injectCurrentUserData = async (
  //   dataList: Array<IGMDepositInfoListItem>
  // ): Promise<Array<IGMDepositInfoListItem>> => {
  //   let data = [...dataList];
  //   const depositedAddresses = getDepositAddresses();
  //   top10UsdtValue.current = dataList[9].usdtValue;
  //
  //   for (const entry of Array.from(depositedAddresses.entries())) {
  //     const key = entry[0];
  //     const userDepositInfo = data.find(
  //       obj => obj.from.toLowerCase() === key.toLowerCase()
  //     );
  //
  //     if (userDepositInfo !== undefined) {
  //       const boostInfo = await getBoostInfo(key);
  //       data = [
  //         {
  //           ...userDepositInfo,
  //           isCurrentUser: true,
  //           extraPercent: boostInfo,
  //         },
  //         ...data.filter(obj => obj.from !== key),
  //       ];
  //     }
  //   }
  //
  //   data = data
  //     // Reindex ranking
  //     .sort(sortByUsdValue)
  //     .map((item, index: number) => {
  //       return {
  //         ...item,
  //         index: index + 1,
  //         top10GapUsdValue: Math.ceil(top10UsdtValue.current - item.usdtValue),
  //         oneGMGapUsdValue: Math.ceil(
  //           usdValueNeedToGet1GM.current - item.usdtValue
  //         ),
  //       };
  //     });
  //
  //   const currentUserItems = data
  //     .filter(item => item.isCurrentUser)
  //     .sort(sortByUsdValue);
  //
  //   const restItems = data
  //     .filter(item => !item.isCurrentUser)
  //     .sort(sortByUsdValue);
  //   data = [...currentUserItems, ...restItems];
  //   return data;
  // };

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
          <div className={s.dataId}>{item.index}</div>
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
                diameter={mobileScreen || tabletScreen ? 24 : 48}
                seed={jsNumberForAddress(item.from)}
              />
            )}

            <Text
              as="span"
              className={s.userWallet}
              title={item.from}
              maxWidth={
                item.isCurrentUser ? { 'min-pc': '6ch', lg: '10ch' } : 'unset'
              }
            >
              {item.isCurrentUser && <>You</>}
              {!item.isCurrentUser && (
                <>{item.ens ? item.ens : shortenAddress(item.from, 4, 4)}</>
              )}
            </Text>
          </div>
          <ContributionBlock user={item} />
          <Popover trigger="hover" isLazy>
            <PopoverTrigger>
              <div className={s.dataToken}>
                <span className={s.dataLabel}>
                  Allocation
                  {item.isCurrentUser && item.extraPercent > 0 && (
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
                        {item.extraPercent}%
                      </Text>
                    </Box>
                  )}
                </span>
                <span className={s.dataValue}>
                  {`${item.gmReceive.toLocaleString('en-US', {
                    maximumFractionDigits: item.gmReceive < 1 ? 5 : 2,
                  })} GM`}{' '}
                  <span className={s.percentage}>{`(${item.percent.toFixed(
                    2
                  )}%)`}</span>
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
                      {item.extraPercent}%
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
        item.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ens.toLowerCase().includes(searchTerm.toLowerCase())
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

  const ContributionBlock = ({ user }: { user: IGMDepositInfoListItem }) => {
    if (!depositInfo || (depositInfo && !depositInfo.mapTokensDeposit))
      return null;

    const userTokensDeposit =
      depositInfo.mapTokensDeposit[_camelCase(user.from)];

    if (!userTokensDeposit) return null;

    const ethDecimals = new BigNumber((1e18).toString());
    const btcDecimals = new BigNumber((1e8).toString());

    const tokenList: TokenList[] = Object.values(
      userTokensDeposit.reduce((acc: any, curr) => {
        const { name, value, usdtValue } = curr;

        const convertedValue = () => {
          if (name === 'turbo' || name === 'pepe') {
            return Number(value);
          }
          if (Number(value) > 100) {
            return name === 'btc'
              ? new BigNumber(value).dividedBy(btcDecimals).toString()
              : new BigNumber(value).dividedBy(ethDecimals).toString();
          }
          return Number(value);
        };

        if (!acc[name]) {
          acc[name] = { type: name, amount: convertedValue(), usdtValue };
        } else {
          acc[name].amount += Number(convertedValue());
          acc[name].usdtValue += usdtValue;
        }
        return acc;
      }, {})
    );

    const tokenListOrdered = tokenList.sort((a: any, b: any) => {
      const typeOrder = ['turbo', 'pepe', 'eth', 'btc'];
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    });

    const renderTokenAmount = (token: TokenList) => {
      if (user.isCurrentUser && user?.depositTokens) {
        return user?.depositTokens[token.type]
          ? user.depositTokens[token.type].amount.toLocaleString('en-US')
          : 0;
      }

      if (token.type === 'turbo' || token.type === 'pepe') {
        return Number(token.amount).toLocaleString('en-US');
      }
      if (Number(token.amount) > 100) {
        return token.type === 'btc'
          ? new BigNumber(token.amount)
              .dividedBy(btcDecimals)
              .toNumber()
              .toLocaleString('en-US')
          : new BigNumber(token.amount)
              .dividedBy(ethDecimals)
              .toNumber()
              .toLocaleString('en-US');
      }
      return ceilPrecised(Number(token.amount), 4);
    };

    return (
      <Popover trigger="hover" isLazy>
        <PopoverTrigger>
          <div className={s.dataContribute}>
            <span className={s.dataLabel}>Contribution</span>
            <span className={cs(s.dataValue, s.dataValue__black)}>
              {formatCurrency(user.usdtValue, user.usdtValue < 1 ? 5 : 2)}
              {userTokensDeposit && (
                <>
                  <span className={s.dataContribute_divider}></span>
                  {/*<TokenStack
                    tokens={tokenListOrdered.map(token => token.type)}
                  />*/}
                </>
              )}
            </span>
          </div>
        </PopoverTrigger>
        {userTokensDeposit && (
          <PopoverContent
            className={s.popoverWrapper}
            minWidth={`${px2rem(360)}`}
          >
            <PopoverHeader
              p={`${px2rem(9.5)} ${px2rem(16)}`}
              bgColor={'#EFEFEF'}
              borderRadius={'8px 8px 0 0'}
            >
              <Box display={'flex'} alignItems={'center'}>
                <Text fontSize={14} fontWeight={600} lineHeight={2.1} flex={1}>
                  Total contribution
                </Text>
                <Text fontSize={16} fontWeight={700} lineHeight={2.4}>
                  {formatCurrency(user.usdtValue, user.usdtValue < 1 ? 5 : 2)}
                </Text>
              </Box>
            </PopoverHeader>
            <PopoverBody p={`${px2rem(12)} ${px2rem(16)}`}>
              <div className={s.tokenList_header}>
                <div>Token name</div>
                <div>Unit</div>
                <div>USD</div>
              </div>
              <div className={s.tokenList}>
                {tokenListOrdered.map((token, index) => {
                  return (
                    <Box className={s.tokenList_item} key={index}>
                      <Box
                        display={'flex'}
                        gap={`${px2rem(4)}`}
                        alignItems={'center'}
                      >
                        {/*<Image
                          src={TokenIcon[token.type as keyof typeof TokenIcon]}
                          alt="token icon"
                          width={18}
                          height={18}
                          className={s.tokenIcon}
                        />*/}
                        <Text
                          textTransform={'uppercase'}
                          m={0}
                          style={{
                            fontFamily: 'var(--chakra-fonts-body)',
                          }}
                        >
                          {token.type}
                        </Text>
                      </Box>
                      <div>
                        <p>{renderTokenAmount(token)}</p>
                      </div>
                      <div>
                        <p>
                          {user.isCurrentUser && user?.depositTokens
                            ? formatCurrency(user?.depositTokens[token.type].value)
                            : formatCurrency(
                                token.usdtValue,
                                token.usdtValue < 1 ? 5 : 2
                              )}
                        </p>
                      </div>
                    </Box>
                  );
                })}
              </div>
            </PopoverBody>
          </PopoverContent>
        )}
      </Popover>
    );
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

  const memoizedDepositList = useMemo(async (): Promise<
    Array<IGMDepositInfoListItem>
  > => {
    if (!depositInfo) return [];
    const sortedList = depositInfo.items
      .sort((a, b) => b.usdtValue - a.usdtValue)
      .map((item, index: number) => {
        return {
          ...item,
          index: index + 1,
          isCurrentUser: false,
        };
      });

    usdValueNeedToGet1GM.current =
      Math.ceil((1 * depositInfo.usdtValue) / 8000) || 0;

    // const transformedList = await injectCurrentUserData(sortedList);
    return sortedList;
  }, [depositInfo]);

  useEffect(() => {
    memoizedDepositList.then(data => {
      setDepositList(data);
    });
  }, [memoizedDepositList]);

  useEffect(() => {
    fetchGMDepositInfo();
  }, []);

  return (
    <div className={cs(s.allowListTable)}>
      {/*<div className={s.allowListTableWrapper}>
        <div className={cs(s.summaryWrapper)}>
          <div className={s.summaryItem}>
            <span className={s.summaryLabel}>Total</span>
            <span className={s.summaryValue}>
              {depositInfo ? (
                <Flex alignItems={'center'} gap={`${px2rem(8)}`}>
                  <CountUp
                    start={0}
                    delay={0.5}
                    duration={3}
                    end={depositInfo.usdtValue}
                    prefix="$"
                  />
                </Flex>
              ) : (
                <>-</>
              )}
            </span>
          </div>
          <div className={cs(s.summaryItem, s.summaryItem__alignRight)}>
            <span className={s.summaryLabel}>Contributors</span>
            <span className={cs(s.summaryValue, s.summaryValue__black)}>
              {depositInfo ? (
                <Flex alignItems={'center'} gap={`${px2rem(8)}`}>
                  <CountUp
                    start={0}
                    delay={0.5}
                    duration={2}
                    end={depositInfo.items.length}
                  />
                </Flex>
              ) : (
                '-'
              )}
            </span>
          </div>
        </div>

        <div className={s.actionWrapper}>
          <Button
            className={cs(s.actionBtn, s.actionBtn__claim)}
            onClick={goToClaim}
          >
            Claim your GM
          </Button>
          <Button className={s.actionBtn} onClick={goToBuyGM}>
            Buy GM
          </Button>
        </div>
      </div>*/}

      <div className={s.allowListTableWrapper}>
        <Search onSearch={onSearchAddress} />
        <div className={cs(s.dataListWrapper)}>
          {depositList.length === 0 && (
            <div className={s.loadingWrapper}>
              <Spinner size={'xl'} />
            </div>
          )}
          {depositList.length > 0 && <DataTable />}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AllowlistTable);
