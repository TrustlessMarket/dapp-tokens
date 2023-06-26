import bn from "bignumber.js"
import { BigNumber, BigNumberish } from "ethers"

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 })

export const Q96 = BigNumber.from(2).pow(96)

export function encodePriceSqrt(reserve1: BigNumberish, reserve0: BigNumberish): BigNumber {
    return BigNumber.from(
        new bn(reserve1.toString())
            .div(reserve0.toString())
            .sqrt()
            .multipliedBy(new bn(2).pow(96))
            .integerValue(3)
            .toString(),
    )
}

export function formatPriceToPriceSqrt(price: string): BigNumber {
    return BigNumber.from(
        new bn(price.toString())
            .sqrt()
            .multipliedBy(new bn(2).pow(96))
            .integerValue(3)
            .toString(),
    )
}

export function getLiquidityForAmount0(sqrtRatioAX96: BigNumber, sqrtRatioBX96: BigNumber, amount0: BigNumber): BigNumber {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
        ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
    }
    const intermediate = (sqrtRatioAX96.mul(sqrtRatioBX96)).div(Q96)
    return (amount0.mul(intermediate)).div(sqrtRatioBX96.sub(sqrtRatioAX96))
}

export function getLiquidityForAmount1(sqrtRatioAX96: BigNumber, sqrtRatioBX96: BigNumber, amount1: BigNumber): BigNumber {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
        ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
    }
    return (amount1.mul(Q96)).div(sqrtRatioBX96.sub(sqrtRatioAX96))
}

export function getLiquidityForAmounts(
    sqrtRatioCurrentX96: BigNumber,
    sqrtRatioAX96: BigNumber,
    sqrtRatioBX96: BigNumber,
    amount0: BigNumber,
    amount1: BigNumber
): BigNumber {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
        ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
    }
    if ((sqrtRatioCurrentX96.lt(sqrtRatioAX96))) {
        return getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0)
    } else if (sqrtRatioCurrentX96.lt(sqrtRatioBX96)) {
        const liquidity0 = getLiquidityForAmount0(sqrtRatioCurrentX96, sqrtRatioBX96, amount0)
        const liquidity1 = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioCurrentX96, amount1)
        return liquidity0.lt(liquidity1) ? liquidity0 : liquidity1
    } else {
        return getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1)
    }
}

export function getAmount0ForLiquidity(sqrtRatioAX96: BigNumber, sqrtRatioBX96: BigNumber, liquidity: BigNumber): BigNumber {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
        ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
    }
    return liquidity.mul(Q96).mul(sqrtRatioBX96.sub(sqrtRatioAX96)).div(sqrtRatioBX96).div(sqrtRatioAX96)
}

export function getAmount1ForLiquidity(sqrtRatioAX96: BigNumber, sqrtRatioBX96: BigNumber, liquidity: BigNumber): BigNumber {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
        ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
    }
    return liquidity.mul(sqrtRatioBX96.sub(sqrtRatioAX96)).div(Q96)
}