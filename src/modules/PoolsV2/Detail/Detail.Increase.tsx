import FiledButton from '@/components/Swap/button/filedButton';
import React from 'react';
import { IDetailPositionBase } from './interface';
import s from './styles.module.scss';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/state/hooks';
import { currentPoolPathSelector } from '@/state/pnftExchange';

const DetailIncrease: React.FC<IDetailPositionBase> = ({ positionDetail }) => {
  const router = useRouter();
  const currentPoolPath = useAppSelector(currentPoolPathSelector);

  return (
    <FiledButton
      btnSize="l"
      className={s.increaseLiquidityBtn}
      isDisabled={!Boolean(positionDetail)}
      onClick={() =>
        router.push(`${currentPoolPath}/increase/${positionDetail?.id}`)
      }
    >
      Increase Liquidity
    </FiledButton>
  );
};

export default DetailIncrease;
