/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { IDetailPositionBase } from './interface';
import { IPosition } from '@/interfaces/position';
import { Box } from '@chakra-ui/react';
import useGetPositionImage from '@/hooks/contract-operations/pools/v3/useGetPositionImage';
import s from './styles.module.scss';

const DetailImage: React.FC<IDetailPositionBase> = ({ positionDetail }) => {
  const [imgSrc, setImgSrc] = useState('');

  const { call: getPositionImage } = useGetPositionImage();

  useEffect(() => {
    if (positionDetail) {
      getImage(positionDetail);
    }
  }, [positionDetail]);

  const getImage = async (positionDetail: IPosition) => {
    try {
      const response: any = await getPositionImage({
        tokenId: positionDetail.tokenId,
      });
      setImgSrc(response);
    } catch (error) {}
  };

  return (
    <Box className={s.container__body__imagePosition}>
      <img src={imgSrc} />
    </Box>
  );
};

export default DetailImage;
