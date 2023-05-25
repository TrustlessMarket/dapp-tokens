import { ICollection } from '@/interfaces/api/collection';
import { getCollections } from '@/services/nft-explorer';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';

const LIMIT_PAGE = 32;

const CollectionList = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [collections, setCollections] = useState<ICollection[]>([]);

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

  //   const debounceLoadMore = debounce(onLoadMoreCollections, 300);

  useEffect(() => {
    fetchCollections();
  }, []);

  return <div>CollectionList</div>;
};

export default CollectionList;
