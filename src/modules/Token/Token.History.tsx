/* eslint-disable @typescript-eslint/no-explicit-any */
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import {IToken} from '@/interfaces/token';
import {getTradeHistory} from '@/services/swap';
import {colors} from '@/theme/colors';
import {abbreviateNumber, compareString, formatCurrency, getExplorer, getWBTCAddress, getWETHAddress} from '@/utils';
import {Flex, Text} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import moment from 'moment';
import {useEffect, useMemo, useState} from 'react';
import {RxArrowTopRight} from 'react-icons/rx';
import {StyledTokenTrading} from './Token.styled';
import {px2rem, useWindowSize} from '@trustless-computer/dapp-core';
import {IResourceChain} from "@/interfaces/chain";
import {useSelector} from "react-redux";
import {selectPnftExchange} from "@/state/pnftExchange";

const TokenHistory = ({ data, isOwner }: { data: IToken; isOwner?: boolean }) => {
  const [list, setList] = useState<any[]>([]);
  const { account, isActive } = useWeb3React();
  const [loading, setLoading] = useState(true);

  const { mobileScreen } = useWindowSize();

  const currentChain: IResourceChain = useSelector(selectPnftExchange).currentChain;

  useEffect(() => {
    getList();
  }, [account, isActive, currentChain?.chain]);

  const getList = async () => {
    try {
      const response: any = await getTradeHistory({
        contract_address: data.address,
        page: 1,
        limit: 100,
        user_address: isOwner ? account : '',
        network: currentChain?.chain?.toLowerCase()
      });
      setList(response);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const checkIsSell = (row: any) => {
    let isSell = true;
    const wBTCAddress = getWBTCAddress();
    const wETHAddress = getWETHAddress();
    if (
      ((compareString(row?.pair?.token0, wBTCAddress) ||
        compareString(row?.pair?.token0, wETHAddress)) &&
        Number(row.amount1Out) > 0) ||
      ((compareString(row?.pair?.token1, wBTCAddress) ||
        compareString(row?.pair?.token1, wETHAddress)) &&
        Number(row.amount0Out) > 0)
    ) {
      isSell = false;
    }
    return isSell;
  };

  const getAmount = (row: any) => {
    const wBTCAddress = getWBTCAddress();
    const wETHAddress = getWETHAddress();
    if (
      (compareString(row?.pair?.token0, wBTCAddress) ||
        compareString(row?.pair?.token0, wETHAddress)) &&
      Number(row.amount1Out) > 0
    ) {
      return row.amount1Out;
    }

    if (
      (compareString(row?.pair?.token1, wBTCAddress) ||
        compareString(row?.pair?.token1, wETHAddress)) &&
      Number(row.amount0Out) > 0
    ) {
      return row.amount0Out;
    }

    if (
      (!compareString(row?.pair?.token1, wBTCAddress) ||
        !compareString(row?.pair?.token1, wETHAddress)) &&
      Number(row.amount1In) > 0
    ) {
      return row.amount1In;
    }

    if (
      (!compareString(row?.pair?.token0, wBTCAddress) ||
        !compareString(row?.pair?.token0, wETHAddress)) &&
      Number(row.amount0In) > 0
    ) {
      return row.amount0In;
    }

    return 0;
  };

  const columns: ColumnProp[] = useMemo(() => {
    if (mobileScreen) {
      return [
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
            let color = colors.greenPrimary;

            if (checkIsSell(row)) {
              color = colors.redSecondary;
            }
            return (
              <>
                <Text fontSize={px2rem(14)} color={color}>
                  {formatCurrency(row.price)}
                </Text>
                <Text
                  style={{
                    fontSize: px2rem(10),
                    color: colors.white500,
                    lineHeight: '12px',
                  }}
                >
                  {row.baseTokenSymbol}
                </Text>
              </>
            );
          },
        },
        {
          id: 'amount',
          label: 'Amount',
          labelConfig: {
            fontSize: '12px',
            fontWeight: '500',
            color: '#B1B5C3',
          },
          config: {
            borderBottom: 'none',
          },
          render(row: any) {
            console.log('row', row);
            const amount = getAmount(row);
            return (
              <>
                <Text textAlign={'right'}>{abbreviateNumber(amount)}</Text>
                <Text
                  style={{
                    fontSize: px2rem(10),
                    color: colors.white500,
                    lineHeight: '12px',
                  }}
                  textAlign={'right'}
                >
                  {compareString(row.pair.token0Obj.symbol, row.baseTokenSymbol) ? row.pair.token1Obj.symbol : row.pair.token0Obj.symbol }
                </Text>
              </>
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
          render(row: any) {
            return (
              <>
                <Text textAlign={'right'}>
                  {moment(row.timestamp).format('HH:mm A')}
                </Text>
                <Text
                  style={{
                    fontSize: px2rem(10),
                    color: colors.white500,
                    lineHeight: '12px',
                  }}
                  textAlign={'right'}
                >
                  {moment(row.timestamp).format('l')}
                </Text>
              </>
            );
          },
        },
      ];
    }

    return [
      {
        id: 'type',
        label: 'Type',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          let type = 'Buy';
          let color = colors.greenPrimary;

          if (checkIsSell(row)) {
            type = 'Sell';
            color = colors.redSecondary;
          }

          return <Text style={{ color }}>{type}</Text>;
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
          return (
            <Text>
              {formatCurrency(row.price, 18)} {row.baseTokenSymbol}
            </Text>
          );
        },
      },
      {
        id: 'amount',
        label: 'Amount',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          const amount = getAmount(row);
          return (
            <Text>
              {formatCurrency(amount, 18)} {compareString(row.pair.token0Obj.symbol, row.baseTokenSymbol) ? row.pair.token1Obj.symbol : row.pair.token0Obj.symbol }
            </Text>
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
        render(row: any) {
          return <Text>{moment(row.timestamp).format('lll')}</Text>;
        },
      },
      {
        id: 'action',
        label: 'Actions',
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
            <Flex>
              <a
                title="explorer"
                href={getExplorer(row.txHash, 'tx')}
                target="_blank"
                className="link-explorer"
              >
                <RxArrowTopRight style={{ fontSize: 18 }} />
              </a>
            </Flex>
          );
        },
      },
    ];
  }, [mobileScreen]);

  return (
    <StyledTokenTrading>
      <ListTable
        data={list}
        columns={columns}
        showEmpty={true}
        initialLoading={loading}
      />
    </StyledTokenTrading>
  );
};

export default TokenHistory;
