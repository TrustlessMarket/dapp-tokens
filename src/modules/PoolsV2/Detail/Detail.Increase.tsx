import FiledButton from '@/components/Swap/button/filedButton';
import React from 'react';
import { IDetailPositionBase } from './interface';
import s from './styles.module.scss';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';

const DetailIncrease: React.FC<IDetailPositionBase> = ({ positionDetail }) => {
  const router = useRouter();
  return (
    <FiledButton
      btnSize="l"
      className={s.increaseLiquidityBtn}
      isDisabled={!Boolean(positionDetail)}
      onClick={() =>
        router.push(`${ROUTE_PATH.POOLS_V2_INCREASE}/${positionDetail?.id}`)
      }
    >
      Increase Liquidity
    </FiledButton>
  );
};

export default DetailIncrease;
