/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */

import axios from 'axios';
import {BigNumber} from 'ethers';
import {getMaxTick, getMinTick, getSqrtRatioAtTick, tickToPrice} from './number';
import {FeeAmount, TICK_SPACINGS} from './constants';
import {getAmountsForLiquidity} from './utilities';

const DEFAULT_SURROUNDING_TICKS = 30

interface TickPool {
    tick: string
    feeTier: string
    token0: {
        symbol: string
        id: string
        decimals: string
    }
    token1: {
        symbol: string
        id: string
        decimals: string
    }
    sqrtPrice: string
    liquidity: string
}

interface PoolResult {
    pool: TickPool
}

interface Tick {
    tick_idx: string
    liquidity_gross: string
    liquidity_net: string
    price0: string
    price1: string
}

export interface TickProcessed {
    liquidityGross: BigNumber
    liquidityNet: BigNumber
    tickIdx: number
    liquidityActive: BigNumber
    price0: number
    price1: number
    tvl0: BigNumber
    tvl1: BigNumber
}

export const fetchInitializedTicks = async (
    poolAddress: string,
    tickIdxLowerBound: number,
    tickIdxUpperBound: number,
): Promise<Tick[]> => {
    let surroundingTicks: Tick[] = []
    let surroundingTicksResult: Tick[] = []
    const response = await axios.get('https://dev.fprotocol.io/api/swap-v3/pool/surrounding-ticks', {
        params: {
            pool_address: poolAddress,
            lower_tick: tickIdxLowerBound,
            upper_tick: tickIdxUpperBound,
        }
    })
    surroundingTicks = response.data.result;
    surroundingTicksResult = surroundingTicksResult.concat(surroundingTicks)
    return surroundingTicksResult
}

export const fetchTicksSurroundingPrice = async (
    poolAddress: string,
    feeTier: FeeAmount,
    currentTickIdx: number,
    liquidity: BigNumber,
    numSurroundingTicks = DEFAULT_SURROUNDING_TICKS
): Promise<TickProcessed[]> => {
    const tickSpacing = TICK_SPACINGS[feeTier]
    const activeTickIdx = Math.floor(currentTickIdx / tickSpacing) * tickSpacing
    const tickIdxLowerBound = activeTickIdx - numSurroundingTicks * tickSpacing
    const tickIdxUpperBound = activeTickIdx + numSurroundingTicks * tickSpacing
    const initializedTicks = await fetchInitializedTicks(poolAddress, tickIdxLowerBound, tickIdxUpperBound)
    const tickIdxToInitializedTick: any = {}
    initializedTicks?.forEach(initializedTick => {
        tickIdxToInitializedTick[initializedTick.tick_idx] = initializedTick
    });
    let activeTickIdxForPrice = activeTickIdx
    if (activeTickIdxForPrice < getMinTick(tickSpacing)) {
        activeTickIdxForPrice = getMinTick(tickSpacing)
    }
    if (activeTickIdxForPrice > getMaxTick(tickSpacing)) {
        activeTickIdxForPrice = getMaxTick(tickSpacing)
    }
    const activeTickProcessed: TickProcessed = {
        liquidityActive: BigNumber.from(liquidity.toString()),
        tickIdx: activeTickIdx,
        liquidityNet: BigNumber.from(0),
        price0: tickToPrice(activeTickIdxForPrice),
        price1: tickToPrice(-activeTickIdxForPrice),
        liquidityGross: BigNumber.from(0),
        tvl0: BigNumber.from(0),
        tvl1: BigNumber.from(0),
    }
    const activeTick = tickIdxToInitializedTick[activeTickIdx]
    if (activeTick) {
        activeTickProcessed.liquidityGross = BigNumber.from(activeTick.liquidity_gross.toString())
        activeTickProcessed.liquidityNet = BigNumber.from(activeTick.liquidity_net.toString())
    }

    enum Direction {
        ASC,
        DESC,
    }
    const computeSurroundingTicks = (
        activeTickProcessed: TickProcessed,
        tickSpacing: number,
        numSurroundingTicks: number,
        direction: Direction
    ) => {
        let previousTickProcessed: TickProcessed = {
            ...activeTickProcessed,
        }
        let processedTicks: TickProcessed[] = []
        for (let i = 0; i < numSurroundingTicks; i++) {
            const currentTickIdx =
                direction == Direction.ASC
                    ? previousTickProcessed.tickIdx + tickSpacing
                    : previousTickProcessed.tickIdx - tickSpacing

            if (currentTickIdx < getMinTick(tickSpacing) || currentTickIdx > getMaxTick(tickSpacing)) {
                break
            }
            const currentTickProcessed: TickProcessed = {
                liquidityActive: previousTickProcessed.liquidityActive,
                tickIdx: currentTickIdx,
                liquidityNet: BigNumber.from(0),
                price0: tickToPrice(currentTickIdx),
                price1: tickToPrice(-currentTickIdx),
                liquidityGross: BigNumber.from(0),
                tvl0: BigNumber.from(0),
                tvl1: BigNumber.from(0),
            }
            const currentInitializedTick = tickIdxToInitializedTick[currentTickIdx.toString()]
            if (currentInitializedTick) {
                currentTickProcessed.liquidityGross = BigNumber.from(currentInitializedTick.liquidity_gross.toString())
                currentTickProcessed.liquidityNet = BigNumber.from(currentInitializedTick.liquidity_net.toString())
            }
            if (direction == Direction.ASC && currentInitializedTick) {
                currentTickProcessed.liquidityActive = previousTickProcessed.liquidityActive.add(
                    BigNumber.from(currentInitializedTick.liquidity_net.toString())
                )
            } else if (direction == Direction.DESC && !previousTickProcessed.liquidityNet.eq(BigNumber.from(0))) {
                currentTickProcessed.liquidityActive = previousTickProcessed.liquidityActive.sub(
                    previousTickProcessed.liquidityNet
                )
            }

            processedTicks.push(currentTickProcessed)
            previousTickProcessed = currentTickProcessed
        }
        if (direction == Direction.DESC) {
            processedTicks = processedTicks.reverse()
        }
        return processedTicks
    }
    const subsequentTicks: TickProcessed[] = computeSurroundingTicks(
        activeTickProcessed,
        tickSpacing,
        numSurroundingTicks,
        Direction.ASC
    )
    const previousTicks: TickProcessed[] = computeSurroundingTicks(
        activeTickProcessed,
        tickSpacing,
        numSurroundingTicks,
        Direction.DESC
    )
    const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks)
    for (let index = 0; index < ticksProcessed.length; index++) {
        const tickProcessed = ticksProcessed[index];
        const [amount0, amount1] = getAmountsForLiquidity(
            getSqrtRatioAtTick(currentTickIdx),
            getSqrtRatioAtTick(tickProcessed.tickIdx),
            getSqrtRatioAtTick(tickProcessed.tickIdx + TICK_SPACINGS[feeTier]),
            tickProcessed.liquidityActive,
        )
        tickProcessed.tvl0 = amount0
        tickProcessed.tvl1 = amount1
    }
    return ticksProcessed
}
