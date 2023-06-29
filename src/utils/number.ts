/* eslint-disable @typescript-eslint/no-inferrable-types */
import { BigNumber } from 'ethers';
import bn from 'bignumber.js';
import moment from 'moment';

export const getMinTick = (tickSpacing: number) =>
  Math.ceil(-887272 / tickSpacing) * tickSpacing;
export const getMaxTick = (tickSpacing: number) =>
  Math.floor(887272 / tickSpacing) * tickSpacing;

// ref : https://github.com/Uniswap/v3-core/blob/main/contracts/libraries/TickMath.sol#L25
export const getMaxTickRange = () => 887272 * 2;

export function getBaseLog(x: number, y: number) {
  return Math.log(y) / Math.log(x);
}

export function priceToTick(price: number, tickSpacing: number): number {
  const tick = getBaseLog(1.0001, price);
  return Math.round(tick / tickSpacing) * tickSpacing;
}

export function tickToPrice(tick?: number): number {
  if (!tick) {
    return 0;
  }

  return Number(formatSqrtPriceX96ToPrice(getSqrtRatioAtTick(tick)));
}

export function getSqrtRatioAtTick(tick: number): BigNumber {
  const absTick = tick < 0 ? BigNumber.from(-tick) : BigNumber.from(tick);
  if (absTick.gt(MAX_TICK)) throw 'T';
  let ratio = !absTick.and(BigNumber.from(0x1)).eq(BigNumber.from(0))
    ? BigNumber.from('0xfffcb933bd6fad37aa2d162d1a594001')
    : BigNumber.from('0x100000000000000000000000000000000');
  if (!absTick.and(BigNumber.from('0x2')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xfff97272373d413259a46990580e213a'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x4')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xfff2e50f5f656932ef12357cf3c7fdcc'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x8')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xffe5caca7e10e4e61c3624eaa0941cd0'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x10')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xffcb9843d60f6159c9db58835c926644'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x20')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xff973b41fa98c081472e6896dfb254c0'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x40')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xff2ea16466c96a3843ec78b326b52861'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x80')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xfe5dee046a99a2a811c461f1969c3053'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x100')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xfcbe86c7900a88aedcffc83b479aa3a4'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x200')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xf987a7253ac413176f2b074cf7815e54'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x400')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xf3392b0822b70005940c7a398e4b70f3'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x800')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xe7159475a2c29b7443b29c7fa6e889d9'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x1000')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xd097f3bdfd2022b8845ad8f792aa5825'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x2000')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0xa9f746462d870fdf8a65dc1f90e061e5'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x4000')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0x70d869a156d2a1b890bb3df62baf32f7'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x8000')).eq(BigNumber.from(0)))
    ratio = ratio
      .mul(BigNumber.from('0x31be135f97d08fd981231505542fcfa6'))
      .div(Q128);
  if (!absTick.and(BigNumber.from('0x10000')).eq(BigNumber.from(0)))
    ratio = ratio.mul(BigNumber.from('0x9aa508b5b7a84e1c677de54f3e99bc9')).div(Q128);
  if (!absTick.and(BigNumber.from('0x20000')).eq(BigNumber.from(0)))
    ratio = ratio.mul(BigNumber.from('0x5d6af8dedb81196699c329225ee604')).div(Q128);
  if (!absTick.and(BigNumber.from('0x40000')).eq(BigNumber.from(0)))
    ratio = ratio.mul(BigNumber.from('0x2216e584f5fa1ea926041bedfe98')).div(Q128);
  if (!absTick.and(BigNumber.from('0x80000')).eq(BigNumber.from(0)))
    ratio = ratio.mul(BigNumber.from('0x48a170391f7dc42444e8fa2')).div(Q128);
  if (tick > 0) ratio = MaxUint256.div(ratio);
  return ratio
    .div(Q32)
    .add(
      ratio.mod(BigNumber.from(1).mul(Q32)).eq(BigNumber.from(0))
        ? BigNumber.from(0)
        : BigNumber.from(1),
    );
}

function bigNumberToBig(val: BigNumber, decimals: number = 18): bn {
  return new bn(val.toString()).div(new bn(10).pow(decimals));
}

export function formatSqrtPriceX96ToPrice(
  value: BigNumber,
  decimals: number = 18,
): string {
  return bigNumberToBig(value, 0)
    .div(new bn(2).pow(96))
    .pow(2)
    .dp(decimals)
    .toString();
}

// There might be dust position or open notional after reducing position or removing liquidity.
// Ignore the dust position or notional in tests, the value is according to the experience.
// IGNORABLE_DUST represents the dust in wei.
export const IGNORABLE_DUST = 500;

export const MIN_SQRT_RATIO = '4295128740';
/// @dev The maximum value that can be returned from #getSqrtRatioAtTick. Equivalent to getSqrtRatioAtTick(MAX_TICK)
export const MAX_SQRT_RATIO = '1461446703485210103287273052203988822378723970341';

export const MaxUint256 = BigNumber.from(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);
export const Q128 = BigNumber.from(2).pow(128);
export const Q96 = BigNumber.from(2).pow(96);
export const Q32 = BigNumber.from(2).pow(32);
export const MAX_TICK = BigNumber.from(887272);
export const getDeadline = () =>
  BigNumber.from(moment().add(30, 'seconds').unix().toString());
