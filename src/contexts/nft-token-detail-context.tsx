import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { INFTToken } from '@/interfaces/nft';
import { useRouter } from 'next/router';
import { getNFTDetail } from '@/services/nft-explorer';

export interface INFTTokenDetailContext {
  nftToken: INFTToken | null;
}

const initialValue: INFTTokenDetailContext = {
  nftToken: null,
}

export const NFTTokenDetailContext = React.createContext<INFTTokenDetailContext>(initialValue);

export const NFTTokenDetailProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const router = useRouter();
  const { collectionAddress, tokenId } = router.query as {
    collectionAddress: string;
    tokenId: string;
  };
  const [nftToken, setNftToken] = useState<INFTToken | null>(null);

  const fetchNftToken = useCallback(async (): Promise<void> => {
    const res = await getNFTDetail({ contractAddress: collectionAddress, tokenId });
    setNftToken(res);
  }, [collectionAddress, tokenId]);

  useEffect(() => {
    if (collectionAddress && tokenId) {
      fetchNftToken();
    }
  }, [collectionAddress, tokenId]);

  const contextValues = useMemo(() => {
    return {
      nftToken,
    }
  }, [
    nftToken,
  ])

  return (
    <NFTTokenDetailContext.Provider value={contextValues}>
      {children}
    </NFTTokenDetailContext.Provider>
  );
}

export default NFTTokenDetailProvider;
