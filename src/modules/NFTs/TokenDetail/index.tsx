import React, { useContext } from 'react';
import s from './styles.module.scss';
import NFTTokenDetailProvider, { NFTTokenDetailContext } from '@/contexts/nft-token-detail-context';
import PageLoading from '@/components/PageLoading';

const TokenDetail: React.FC = (): React.ReactElement => {
  const {
    nftToken,
  } = useContext(NFTTokenDetailContext);

  console.log(nftToken)

  if (!nftToken) {
    return (
      <PageLoading />
    );
  }

  return (
    <div className={s.tokenDetailWrapper}>
      <div className={s.leftContent}>

      </div>
      <div className={s.rightContent}>

      </div>
    </div>
  )
}

const TokenDetailWrapper: React.FC = (): React.ReactElement => {
  return (
    <NFTTokenDetailProvider>
      <TokenDetail />
    </NFTTokenDetailProvider>
  );
};

export default TokenDetailWrapper;