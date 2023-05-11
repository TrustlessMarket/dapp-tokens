/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/services';
import {
  Box,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React, { Fragment, ReactNode, memo, useEffect, useState } from 'react';
// import { useCurrentWallet } from "app/hooks/useCurrentWallet";
import EmptyList from '@/components/Swap/emptyList';
import Pagination from '@/components/Swap/pagination';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { compareString } from '@/utils';
import cx from 'classnames';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './styles.module.scss';

export interface ColumnProp {
  id: string;
  label: string;
  sort?: string;
  config?: any;
  render?: (_: any, __: any, ___: any) => void;
  labelConfig?: any;
  onSort?: (_: any) => void;
}

interface ListTableProps {
  columns: ColumnProp[];
  url?: string;
  params?: any;
  data?: any[];
  emptyLabel?: string;
  extraData?: any;
  page?: number;
  limit?: number;
  ItemListComponent?: (_?: any, __?: any, ___?: any, ____?: any) => ReactNode;
  noHeader?: boolean;
  onItemClick?: (_: any) => void;
  onLoadSuccess?: (_: any, __: any) => void;
  onTdRow?: (_: any) => void;
  selectedItem?: any;
  needUpdate?: any;
  initialLoading?: boolean;
  className?: any
}

const ItemTable = ({
  item = null as any,
  columns = [] as ColumnProp[],
  extraData = {},
  onItemClick = null as any,
  selectedItem = null as any,
  index = null as any,
  onTdRow = null as any,
}) => {
  const onClick = () => {
    return onItemClick?.(item);
  };

  if (onTdRow) {
    return (
      <>
        <Tr
          onClick={onClick}
          cursor={onItemClick ? 'pointer' : 'default'}
          className={cx(
            compareString(selectedItem?.id, item.id) ? 'selected' : '',
            'onTdRow',
          )}
        >
          <Tr>
            {columns.map((v) => (
              <Td {...v.config} key={v.id} width="100%">
                {v.render ? v.render(item, extraData, index) : item[v.id]}
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td width="100%" colSpan={columns.length}>
              {onTdRow(item)}
            </Td>
          </Tr>
        </Tr>
      </>
    );
  } else {
    return (
      <Tr
        onClick={onClick}
        cursor={onItemClick ? 'pointer' : 'default'}
        className={cx(selectedItem?.id === item.id ? 'selected' : '', 'notOnTdRow')}
      >
        {columns.map((v) => (
          <Td {...v.config} key={v.id}>
            {v.render ? v.render(item, extraData, index) : item[v.id]}
          </Td>
        ))}
      </Tr>
    );
  }
};

const ListTable: React.FC<ListTableProps> = ({
  columns,
  url,
  data = [],
  params,
  emptyLabel = "There's no records",
  limit = 10,
  page = 1,
  extraData,
  ItemListComponent,
  noHeader,
  onItemClick,
  onLoadSuccess,
  selectedItem,
  needUpdate,
  initialLoading,
  onTdRow,
 className,
}) => {
  // const { currentWallet } = useCurrentWallet();
  const [rows, setRows] = useState(data);
  const [loading, setLoading] = useState(Boolean(url));
  const [total, setTotal] = useState(0);
  const [__page, setPage] = useState(page);
  const needReload = useAppSelector(selectPnftExchange).needReload;

  useEffect(() => {
    if (url) {
      getRows();
    }
  }, [
    url,
    __page,
    needReload,
    JSON.stringify(params),
    // JSON.stringify(currentWallet),
    extraData,
    needUpdate,
  ]);

  useEffect(() => {
    if (data?.length > 0 || rows?.length > 0) {
      setRows(data);
    }
  }, [JSON.stringify(data)]);

  const getRows = async () => {
    if (!url) {
      return;
    }

    try {
      setLoading(true);
      const _url = url
        ?.replace('{page}', __page.toString())
        .replace('{limit}', limit.toString());
      const response: any = await apiClient.get(_url, { params });
      setRows(response?.records || response?.result);
      setTotal(response?.total || response?.count);
      setLoading(false);
      onLoadSuccess &&
        onLoadSuccess(
          response?.records || response?.result,
          response?.total || response?.count,
        );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading || initialLoading)
      return (
        <Tbody className={styles.item}>
          <Tr className="notOnTdRow">
            <Td colSpan={columns.length} textAlign="center">
              <Spinner
                className={styles.loading}
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
              />
            </Td>
          </Tr>
        </Tbody>
      );
    if (rows?.length === 0 || rows?.length === undefined)
      return (
        <Tbody className={styles.item}>
          <Tr className="notOnTdRow">
            <Td colSpan={columns.length} textAlign="center">
              <EmptyList labelText={emptyLabel} />
            </Td>
          </Tr>
        </Tbody>
      );
    return (
      <Tbody className={styles.item}>
        {rows?.map((row, i) =>
          ItemListComponent ? (
            <Fragment key={row.id}>
              {ItemListComponent(row, extraData, columns, i)}
            </Fragment>
          ) : (
            <ItemTable
              key={`data-${i}`}
              item={row}
              columns={columns}
              extraData={extraData}
              onItemClick={onItemClick}
              selectedItem={selectedItem}
              index={i}
              onTdRow={onTdRow}
            />
          ),
        )}
      </Tbody>
    );
  };

  const onChangePage = (_page: number) => {
    setPage(_page);
  };

  return (
    <TableContainer className={styles.container}>
      <Table variant="simple" className={className}>
        {!noHeader && (
          <Thead>
            <Tr>
              {columns.map((v) => (
                <Th {...v.config} {...v.labelConfig} key={v.id}>
                  <Flex
                    gap={1}
                    alignItems="center"
                    className={v.onSort ? 'sort' : ''}
                    style={{
                      cursor: v.onSort ? 'pointer' : 'default',
                    }}
                    onClick={v.onSort && v.onSort}
                  >
                    {v.label}
                    {v.onSort && (
                      <Box>
                        <FaChevronUp
                          style={{
                            marginBottom: '-3px',
                            fontSize: '10px',
                            color: !v.sort?.includes('-') ? '#ff831a' : 'unset',
                          }}
                        />
                        <FaChevronDown
                          style={{
                            marginTop: '-3px',
                            fontSize: '10px',
                            color: v.sort?.includes('-') ? '#ff831a' : 'unset',
                          }}
                        />
                      </Box>
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
        )}

        {renderContent()}
        {total > limit && (
          <Tfoot>
            <Tr>
              <Td textAlign={'right'} colSpan={columns.length}>
                <Pagination
                  total={total}
                  page={__page}
                  pageSize={limit}
                  onChangePage={onChangePage}
                  flexConfig={{ justifyContent: 'flex-end' }}
                />
              </Td>
            </Tr>
          </Tfoot>
        )}
      </Table>
    </TableContainer>
  );
};

export default memo(ListTable);
