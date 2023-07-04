/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { IDetailPositionBase } from './interface';
import { IPosition } from '@/interfaces/position';
import { Box, Flex } from '@chakra-ui/react';
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
      const canvas = document.getElementById('c') as any;
      const ctx = canvas.getContext('2d');

      const image = new Image(232, 400);
      image.onload = function () {
        ctx.drawImage(image, 0, 0, 232, 400);
      };
      image.src = response;
    } catch (error) {}
  };

  return (
    <Flex alignItems={'center'} justifyContent={'center'} width={'100%'}>
      <Box className={s.container__body__imagePosition}>
        <canvas
          width={232}
          height={400}
          style={{
            width: '232px',
            height: '400px',
          }}
          id="c"
        ></canvas>
        <img src={imgSrc} />
      </Box>
    </Flex>
  );
};

export default DetailImage;
