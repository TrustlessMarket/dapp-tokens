import bn from 'bignumber.js';
import { BigNumber, BigNumberish } from 'ethers';
import { MaxUint128 } from './constants';
import { getSqrtRatioAtTick } from './number';

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

export const Q96 = BigNumber.from(2).pow(96);

export function encodePriceSqrt(
  reserve1: BigNumberish,
  reserve0: BigNumberish,
): BigNumber {
  return BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString(),
  );
}

export function formatPriceToPriceSqrt(price: string): BigNumber {
  console.log('price', price);

  return BigNumber.from(
    new bn(price.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString(),
  );
}

export function getLiquidityForAmount0(
  sqrtRatioAX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  amount0: BigNumber,
): BigNumber {
  if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }
  const intermediate = sqrtRatioAX96.mul(sqrtRatioBX96).div(Q96);
  return amount0.mul(intermediate).div(sqrtRatioBX96.sub(sqrtRatioAX96));
}

export function getLiquidityForAmount1(
  sqrtRatioAX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  amount1: BigNumber,
): BigNumber {
  if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }
  return amount1.mul(Q96).div(sqrtRatioBX96.sub(sqrtRatioAX96));
}

export function getLiquidityForAmounts(
  sqrtRatioCurrentX96: BigNumber,
  sqrtRatioAX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  amount0: BigNumber,
  amount1: BigNumber,
): BigNumber {
  if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }
  if (sqrtRatioCurrentX96.lt(sqrtRatioAX96)) {
    return getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
  } else if (sqrtRatioCurrentX96.lt(sqrtRatioBX96)) {
    const liquidity0 = getLiquidityForAmount0(
      sqrtRatioCurrentX96,
      sqrtRatioBX96,
      amount0,
    );
    const liquidity1 = getLiquidityForAmount1(
      sqrtRatioAX96,
      sqrtRatioCurrentX96,
      amount1,
    );
    return liquidity0.lt(liquidity1) ? liquidity0 : liquidity1;
  } else {
    return getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
  }
}

export function getAmount0ForLiquidity(
  sqrtRatioAX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  liquidity: BigNumber,
): BigNumber {
  if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }
  return liquidity
    .mul(Q96)
    .mul(sqrtRatioBX96.sub(sqrtRatioAX96))
    .div(sqrtRatioBX96)
    .div(sqrtRatioAX96);
}

export function getAmount1ForLiquidity(
  sqrtRatioAX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  liquidity: BigNumber,
): BigNumber {
  if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }
  return liquidity.mul(sqrtRatioBX96.sub(sqrtRatioAX96)).div(Q96);
}

export function getLiquidityAmountsForAmounts(
  sqrtRatioCurrentX96: BigNumber,
  sqrtRatioAX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  amount0: BigNumber,
  amount1: BigNumber,
): [BigNumber, BigNumber] {
  if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }
  let amountAmount0 = BigNumber.from(0);
  let amountAmount1 = BigNumber.from(0);
  if (sqrtRatioCurrentX96.lt(sqrtRatioAX96)) {
    const liquidity = getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
    amountAmount0 = getAmount0ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity);
  } else if (sqrtRatioCurrentX96.gt(sqrtRatioBX96)) {
    const liquidity = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
    amountAmount1 = getAmount1ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity);
  } else {
    let liquidity0 = MaxUint128;
    let liquidity1 = MaxUint128;
    if (sqrtRatioCurrentX96.lt(sqrtRatioBX96)) {
      liquidity0 = getLiquidityForAmount0(
        sqrtRatioCurrentX96,
        sqrtRatioBX96,
        amount0,
      );
    }
    if (sqrtRatioAX96.lt(sqrtRatioCurrentX96)) {
      liquidity1 = getLiquidityForAmount1(
        sqrtRatioAX96,
        sqrtRatioCurrentX96,
        amount1,
      );
    }
    const liquidity = liquidity0.lt(liquidity1) ? liquidity0 : liquidity1;
    if (sqrtRatioCurrentX96.lt(sqrtRatioBX96)) {
      amountAmount0 = getAmount0ForLiquidity(
        sqrtRatioCurrentX96,
        sqrtRatioBX96,
        liquidity,
      );
    }
    if (sqrtRatioAX96.lt(sqrtRatioCurrentX96)) {
      amountAmount1 = getAmount1ForLiquidity(
        sqrtRatioAX96,
        sqrtRatioCurrentX96,
        liquidity,
      );
    }
  }
  return [amountAmount0, amountAmount1];
}

export const amountDesiredChanged = (
  currentTick: number,
  lowerTick: number,
  upperTick: number,
  amount0Desired: BigNumber,
  amount1Desired: BigNumber,
) => {
  const currentSqrtRatioX96 = getSqrtRatioAtTick(currentTick);
  const lowerSqrtRatioX96 = getSqrtRatioAtTick(lowerTick);
  const upperSqrtRatioX96 = getSqrtRatioAtTick(upperTick);
  if (lowerSqrtRatioX96.gte(upperSqrtRatioX96)) {
    throw 'T';
  }
  const [amount0, amount1] = getLiquidityAmountsForAmounts(
    currentSqrtRatioX96,
    lowerSqrtRatioX96,
    upperSqrtRatioX96,
    amount0Desired,
    amount1Desired,
  );
  return [amount0, amount1];
};
