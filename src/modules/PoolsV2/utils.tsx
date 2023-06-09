/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NULL_ADDRESS } from '@/constants/url';
import { IPosition } from '@/interfaces/position';
import store from '@/state';
import { closeModal, openModal } from '@/state/modal';
import { compareString, formatCurrency } from '@/utils';
import { FeeAmount, MaxUint128 } from '@/utils/constants';
import { getSqrtRatioAtTick, tickToPrice } from '@/utils/number';
import { amountDesiredChanged, getAmountsForLiquidity } from '@/utils/utilities';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { isNumber } from 'lodash';
import { IoWarning } from 'react-icons/io5';
import { RxCircleBackslash, RxDotFilled } from 'react-icons/rx';
import AddConfirm from './Add/Add.Confirm';
import s from './styles.module.scss';
import { useRef, useState } from 'react';
import { IToken } from '@/interfaces/token';

export const isPool = (address: string): boolean => {
  if (Boolean(address) && !compareString(address, NULL_ADDRESS)) {
    return true;
  }
  return false;
};

export const checkBalanceIsApprove = (required: any = 0, amount: any = 0) => {
  if (Number(amount) > 0) {
    return new BigNumber(required).minus(amount).toNumber() >= 0;
  }

  return true;
};

export const validateBaseAmount = (_amount: any, values: any) => {
  const baseTokenBalance: string = values?.baseTokenBalance || '0';

  if (new BigNumber(_amount).gt(baseTokenBalance)) {
    return `Max amount is ${formatCurrency(baseTokenBalance)}`;
  }

  return undefined;
};

export const validateQuoteAmount = (_amount: any, values: any) => {
  const quoteTokenBalance: string = values?.quoteTokenBalance || '0';

  if (new BigNumber(_amount).gt(quoteTokenBalance)) {
    return `Max amount is ${formatCurrency(quoteTokenBalance)}`;
  }

  return undefined;
};

export const feeTiers = [
  {
    value: FeeAmount.LOWER,
    title: FeeAmount.LOWER / 10000 / 2,
    desc: 'Best for very stable pairs.',
    title2: FeeAmount.LOWER / 10000 / 2,
    desc2: 'Platform',
  },
  {
    value: FeeAmount.LOW,
    title: FeeAmount.LOW / 10000 / 2,
    desc: 'Best for most pairs.',
    title2: FeeAmount.LOW / 10000 / 2,
    desc2: 'Platform',
  },
  {
    value: FeeAmount.MEDIUM,
    title: FeeAmount.MEDIUM / 10000 / 2,
    desc: 'Best for stable pairs.',
    title2: FeeAmount.MEDIUM / 10000 / 2,
    desc2: 'Platform',
  },
  {
    value: FeeAmount.HIGH,
    title: FeeAmount.HIGH / 10000 / 2,
    desc: 'Best for exotic pairs.',
    title2: FeeAmount.HIGH / 10000 / 2,
    desc2: 'Platform',
  },
];

export const validateMinRangeAmount = (_amount: any, values: any) => {
  const minPrice = values?.minPrice;
  const maxPrice = values?.maxPrice;

  if (new BigNumber(minPrice).gte(maxPrice)) {
    return `Min price less than ${formatCurrency(maxPrice)}`;
  }

  return undefined;
};

export const validateMaxRangeAmount = (_amount: any, values: any) => {
  const minPrice = values?.minPrice;
  const maxPrice = values?.maxPrice;

  if (new BigNumber(maxPrice).lt(minPrice)) {
    return `Max price greater than ${formatCurrency(minPrice)}`;
  }

  return undefined;
};

export const handleChangeAmount = (
  type: 'baseAmount' | 'quoteAmount',
  { _amount = 0, currentTick, tickLower, tickUpper }: any,
) => {
  try {
    const [baseAmount, quoteAmount] = amountDesiredChanged(
      currentTick,
      tickLower,
      tickUpper,
      type === 'baseAmount' ? ethers.utils.parseEther(_amount) : MaxUint128,
      type === 'quoteAmount' ? ethers.utils.parseEther(_amount) : MaxUint128,
    );
    return ethers.utils.formatEther(
      type === 'baseAmount' ? quoteAmount : baseAmount,
    );
  } catch (error) {
    return 0;
  }
};

export const allowStep = (values: any) => {
  let step = 0;

  if (
    Boolean(values?.baseToken) &&
    Boolean(values?.quoteToken) &&
    !compareString(values?.baseToken?.address, values?.quoteToken?.address)
  ) {
    step = 1;
  }
  if (
    Boolean(values?.baseToken) &&
    Boolean(values?.quoteToken) &&
    !compareString(values?.baseToken?.address, values?.quoteToken?.address) &&
    Boolean(values?.fee)
  ) {
    step = 2;
  }
  if (
    Boolean(values?.baseToken) &&
    Boolean(values?.quoteToken) &&
    !compareString(values?.baseToken?.address, values?.quoteToken?.address) &&
    Boolean(values?.fee) &&
    (isNumber(values?.tickUpper) || isNumber(values?.tickLower))
  ) {
    step = 3;
  }
  if (
    Boolean(values?.baseToken) &&
    Boolean(values?.quoteToken) &&
    !compareString(values?.baseToken?.address, values?.quoteToken?.address) &&
    Boolean(values?.fee) &&
    (isNumber(values?.tickUpper) || isNumber(values?.tickLower)) &&
    (isNumber(values?.baseAmount) || isNumber(values?.quoteAmount))
  ) {
    step = 4;
  }

  return step;
};

export const getPooledAmount = (positionDetail?: IPosition) => {
  try {
    const currentSqrtRatioX96 = ethers.BigNumber.from(
      positionDetail?.pair?.sqrtPriceX96,
    );
    const lowerSqrtRatioX96 = getSqrtRatioAtTick(positionDetail?.tickLower || 0);
    const upperSqrtRatioX96 = getSqrtRatioAtTick(positionDetail?.tickUpper || 0);

    const res = getAmountsForLiquidity(
      currentSqrtRatioX96,
      lowerSqrtRatioX96,
      upperSqrtRatioX96,
      ethers.utils.parseEther(positionDetail?.liquidity || '0'),
    );

    return [ethers.utils.formatEther(res[0]), ethers.utils.formatEther(res[1])];
  } catch (error) {
    return ['0', '0'];
  }
};

export const getRangeTick = (positionDetail?: IPosition, amounts: any[] = []) => {
  try {
    const [amount0, amount1] =
      amounts?.length === 0 ? getPooledAmount(positionDetail) : amounts;

    if (Number(amount0) > 0 && Number(amount1) > 0) {
      const tickUpper: any = positionDetail?.tickUpper;
      const tickLower: any = positionDetail?.tickLower;
      const tick: any = positionDetail?.pair?.tick;

      const agg = Math.abs(
        new BigNumber(tick)
          .minus(tickUpper)
          .dividedBy(new BigNumber(tickUpper).minus(tickLower).toFixed())
          .multipliedBy(100)
          .toNumber(),
      );

      const agg2 = 100 - agg;

      const percents = [`${formatCurrency(agg)}%`, `${formatCurrency(agg2)}%`];

      return {
        status: {
          title: 'In Range',
          color: '#0fd788',
          iconName: <RxDotFilled color="#0fd788" />,
          desc: 'The price of this pool is within your selected range. Your position is currently earning fees.',
        },
        percents,
        isRange: true,
      };
    }
    if (Number(amount0) > 0) {
      return {
        status: {
          title: 'Out of range',
          color: 'orange',
          iconName: <IoWarning color="orange" />,
          desc: 'The price of this pool is outside of your selected range. Your position is not currently earning fees.',
        },
        percents: ['100%', '0%'],
        isRange: false,
      };
    }
    if (Number(amount1) > 0) {
      return {
        status: {
          title: 'Out of range',
          color: 'orange',
          iconName: <IoWarning color="orange" />,
          desc: 'The price of this pool is outside of your selected range. Your position is not currently earning fees.',
        },
        percents: ['0%', '100%'],
        isRange: false,
      };
    }
    if (Number(positionDetail?.liquidity) <= 0) {
      return {
        status: {
          title: 'Closed',
          color: 'rgb(152, 161, 192)',
          iconName: <RxCircleBackslash color="rgb(152, 161, 192)" />,
          desc: 'Your position has 0 liquidity, and is not earning fees.',
        },
        percents: ['0%', '100%'],
        isRange: false,
      };
    }
  } catch (error) {
    return {
      status: {
        title: 'Out of range',
        color: 'orange',
        iconName: <IoWarning color="orange" />,
        desc: 'The price of this pool is outside of your selected range. Your position is not currently earning fees.',
      },
      percents: ['0', '0'],
      isRange: false,
    };
  }
};

export const onShowAddLiquidityConfirm = async (
  values: any,
  onSubmit: (_: any) => void,
) => {
  try {
    const id = 'addLiquidityV3';
    const onClose = () => store.dispatch(closeModal({ id }));
    store.dispatch(
      openModal({
        id,
        theme: 'dark',
        title: `Add Liquidity`,
        className: s.modalConfirm,
        modalProps: {
          centered: true,
          // size: mobileScreen ? 'full' : 'xl',
          zIndex: 1,
        },
        render: () => (
          <ModalAddConfirm onSubmit={onSubmit} values={values} onClose={onClose} />
        ),
      }),
    );
  } catch (error) {
    throw error;
  }
};

export const ModalAddConfirm = ({ values, onSubmit, onClose }: any) => {
  const refValues = useRef(values).current;
  const [reValues, setReValues] = useState(values);

  const onSelectPair = (_tokenA?: IToken, _tokenB?: IToken) => {
    if (Boolean(_tokenA) && Boolean(_tokenB)) {
      let isRevert = false;

      if (!compareString(refValues?.baseToken?.address, _tokenA?.address)) {
        isRevert = true;
      }

      const _revertTickLower = isRevert
        ? -refValues?.tickUpper
        : refValues?.tickLower;
      const _revertTickUpper = isRevert
        ? -refValues?.tickLower
        : refValues?.tickUpper;
      const _revertTick = isRevert
        ? -refValues?.currentTick
        : refValues?.currentTick;

      setReValues((__values: any) => ({
        ...__values,
        minPrice: tickToPrice(_revertTickLower),
        maxPrice: tickToPrice(_revertTickUpper),
        baseToken: isRevert ? refValues?.quoteToken : refValues?.baseToken,
        quoteToken: isRevert ? refValues?.baseToken : refValues?.quoteToken,
        currentPrice: tickToPrice(_revertTick),
        currentSelectPair: _tokenA,
        isRevert: isRevert,
      }));
    }
  };

  return (
    <AddConfirm
      onSubmit={onSubmit}
      values={reValues}
      onClose={onClose}
      onSelectPair={onSelectPair}
    />
  );
};
