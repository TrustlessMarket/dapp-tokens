import SvgInset from '@/components/SvgInset';
import ListTable from '@/components/Swap/listTable';
import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { ICollection } from '@/interfaces/api/collection';
import { getCollections } from '@/services/nft-explorer';
import { Box, Input, Text } from '@chakra-ui/react';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { StyledCollectionsList } from './CollectionList.styled';

const LIMIT_PAGE = 32;

const CollectionList = () => {
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(false);
  const [collections, setCollections] = useState<ICollection[]>([]);

  const [searchVal, setSearchVal] = useState('');

  const onSearch = (val: string) => {
    return val;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchVal);
    }
  };

  const fetchCollections = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const data = await getCollections(page, LIMIT_PAGE);
      if (isFetchMore) {
        setCollections((prev) => [...prev, ...data]);
      } else {
        setCollections(data);
      }
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };

  const onLoadMoreCollections = () => {
    if (isFetching || collections.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(collections.length / LIMIT_PAGE) + 1;
    fetchCollections(page, true);
  };

  const columns = useMemo(() => {
    return [
      {
        id: 'name',
        label: 'Name',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px',
        },
        config: {
          color: '#FFFFFF',
          borderBottom: 'none',
          backgroundColor: '#1E1E22',
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px',
        },
        render(row: ICollection) {
          return <Box>{row.name}</Box>;
        },
      },
    ];
  }, [JSON.stringify(collections)]);

  const debounceLoadMore = debounce(onLoadMoreCollections, 300);

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <StyledCollectionsList>
      <div className="tabs">
        {/* <Box ml={px2rem(32)} className="tab-name">
          <Text>Trending Collection</Text>
        </Box> */}
        <Box className="tab-name active">
          <Text>Collection</Text>
        </Box>
      </div>
      <div className="search">
        <SvgInset size={20} svgUrl={`${CDN_URL}/icons/ic-search.svg`} />
        <Input
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={handleKeyDown}
          value={searchVal}
          className="input"
          placeholder="Collection name..."
        />
      </div>
      <div className="table">
        <InfiniteScroll
          className="collection-list"
          dataLength={collections?.length || 0}
          hasMore={true}
          loader={
            isFetching && (
              <div className="loading">
                <Spinner animation="border" variant="primary" />
              </div>
            )
          }
          next={debounceLoadMore}
        >
          <ListTable
            data={collections}
            columns={columns}
            initialLoading={isFetching}
            onItemClick={(e) => {
              return router.push(`${ROUTE_PATH.NFTS}/${e.contract}`);
            }}
          />
        </InfiniteScroll>
      </div>
    </StyledCollectionsList>
  );
};

export default CollectionList;
