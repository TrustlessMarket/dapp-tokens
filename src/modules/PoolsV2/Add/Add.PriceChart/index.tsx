/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {useCallback, useEffect, useMemo, useState} from "react";
import useGetPoolLiquidity from "@/hooks/contract-operations/pools/v3/useGetPoolLiquidity";
import { BarChart, Bar, LabelList, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import styled from "styled-components";
import {Flex, Spinner, useTheme} from "@chakra-ui/react";
import {FeeAmount, TICK_SPACINGS} from '@uniswap/v3-sdk'
import {Token} from '@uniswap/sdk-core'
import {TickProcessed} from "@/utils/liquidity";
import {isAddress} from "@/utils";
import {formatEther} from "ethers/lib/utils";
import {getCurrentTickIdx} from "@/utils/number";
import {CurrentPriceLabel} from "@/modules/PoolsV2/Add/Add.PriceChart/CurrentPriceLabel";
import CustomToolTip from "@/modules/PoolsV2/Add/Add.PriceChart/CustomToolTip";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
`

const ControlsWrapper = styled.div`
  position: absolute;
  right: 40px;
  bottom: 100px;
  padding: 4px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 6px;
`

const ActionButton = styled.div<{ disabled?: boolean }>`
  width: 32px;
  border-radius: 50%;
  background-color: #000000;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 0.9)};
  background-color: ${({ theme, disabled }) => (disabled ? '#40444F' : '#2C2F36')};
  user-select: none;

  :hover {
    cursor: pointer;
    opacity: 0.4;
  }
`

interface DensityChartProps {
  address: string
}

export interface ChartEntry {
  index: number
  isCurrent: boolean
  activeLiquidity: number
  price0: number
  price1: number
  tvlToken0: number
  tvlToken1: number
}

interface ZoomStateProps {
  left: number
  right: number
  refAreaLeft: string | number
  refAreaRight: string | number
}

const INITIAL_TICKS_TO_FETCH = 300
const ZOOM_INTERVAL = 20

const initialState = {
  left: 0,
  right: INITIAL_TICKS_TO_FETCH * 2 + 1,
  refAreaLeft: '',
  refAreaRight: '',
}

interface IAddPriceChart {
  address: string;
  poolDetail: any;
};

const AddPriceChart: React.FC<IAddPriceChart> = ({address, poolDetail}) => {
  const { call: getPoolLiquidity } = useGetPoolLiquidity();
  const [ticksProcessed, setTicksProcessed] = useState([]);

  // poolData
  const poolData = poolDetail;
  const formattedAddress0 = isAddress(poolData.token0.address)
  const formattedAddress1 = isAddress(poolData.token1.address)
  const feeTier: FeeAmount = poolData?.feeTier

  // parsed tokens
  const token0 = useMemo(() => {
    return poolData && formattedAddress0 && formattedAddress1
      ? new Token(1, formattedAddress0, poolData.token0.decimal)
      : undefined
  }, [formattedAddress0, formattedAddress1, poolData])
  const token1 = useMemo(() => {
    return poolData && formattedAddress1 && formattedAddress1
      ? new Token(1, formattedAddress1, poolData.token1.decimal)
      : undefined
  }, [formattedAddress1, poolData])

  // tick data tracking
  // const [poolTickData, updatePoolTickData] = usePoolTickData(address)
  const [ticksToFetch, setTicksToFetch] = useState(INITIAL_TICKS_TO_FETCH)
  const amountTicks = ticksToFetch * 2 + 1

  const [loading, setLoading] = useState(false)
  const [zoomState, setZoomState] = useState<ZoomStateProps>(initialState)

  useEffect(() => {
    async function fetch() {
      const res = await getPoolLiquidity({poolAddress: address, numSurroundingTicks: INITIAL_TICKS_TO_FETCH});
      if (res) {
        setTicksProcessed(res);
      }
    }
    if (ticksProcessed.length < amountTicks) {
      fetch()
    }
  }, [address, ticksToFetch, amountTicks])

  // useEffect(() => {
  //   getLiquidityData();
  // }, []);
  //
  // const getLiquidityData = async () => {
  //   const res = await getPoolLiquidity({poolAddress: '0x17a552efe197d467a59db12f29cbff64ded46c56'});
  //   setTicksProcessed(res);
  // }

  // console.log('ticksProcessed', ticksProcessed);
  // console.log(ticksProcessed[0])
  // console.log(ticksProcessed[299])
  // console.log(ticksProcessed[300])
  // console.log(ticksProcessed[301])
  // console.log(ticksProcessed[600])
  // console.log('=====');

  const [formattedData, setFormattedData] = useState<ChartEntry[] | undefined>()
  useEffect(() => {
    async function formatData() {
      if (ticksProcessed) {
        console.log('ticksProcessed aaaa', ticksProcessed);
        const newData = await Promise.all(
          ticksProcessed.map(async (t: TickProcessed, i) => {
            const active = t.tickIdx === getCurrentTickIdx(poolDetail.rootCurrentTick, TICK_SPACINGS[feeTier]);
            return {
              index: i,
              isCurrent: active,
              activeLiquidity: parseFloat(formatEther(t.liquidityActive)),
              price0: t.price0,
              price1: t.price1,
              tvlToken0: parseFloat(formatEther(t.tvl0)),
              tvlToken1: parseFloat(formatEther(t.tvl1)),
            }
          })
        )
        // offset the values to line off bars with TVL used to swap across bar
        // newData?.map((entry, i) => {
        //   if (i > 0) {
        //     newData[i - 1].tvlToken0 = entry.tvlToken0
        //     newData[i - 1].tvlToken1 = entry.tvlToken1
        //   }
        // })

        if (newData) {
          if (loading) {
            setLoading(false)
          }
          setFormattedData(newData)
        }
        return
      } else {
        return []
      }
    }
    console.log('formattedData', formattedData);
    if (!formattedData || formattedData?.length <= 0) {
      formatData()
    }
  }, [feeTier, formattedData, loading, poolData.feeTier, token0, token1, ticksProcessed?.length])

  const atZoomMax = zoomState.left + ZOOM_INTERVAL >= zoomState.right - ZOOM_INTERVAL - 1
  const atZoomMin = zoomState.left - ZOOM_INTERVAL < 0

  const handleZoomIn = useCallback(() => {
    !atZoomMax &&
    setZoomState({
      ...zoomState,
      left: zoomState.left + ZOOM_INTERVAL,
      right: zoomState.right - ZOOM_INTERVAL,
    })
  }, [zoomState, atZoomMax])

  const handleZoomOut = useCallback(() => {
    if (atZoomMin) {
      setLoading(true)
      setTicksToFetch(ticksToFetch + ZOOM_INTERVAL)
      setFormattedData(undefined)
      setZoomState({
        ...zoomState,
        left: 0,
        right: amountTicks,
      })
    } else {
      setZoomState({
        ...zoomState,
        left: zoomState.left - ZOOM_INTERVAL,
        right: zoomState.right + ZOOM_INTERVAL,
      })
    }
  }, [amountTicks, atZoomMin, ticksToFetch, zoomState])

  const zoomedData = useMemo(() => {
    if (formattedData) {
      return formattedData.slice(zoomState.left, zoomState.right)
    }
    return undefined
  }, [formattedData, zoomState.left, zoomState.right])

  // reset data on address change
  useEffect(() => {
    setFormattedData(undefined)
  }, [address])

  if (ticksProcessed?.length <= 0) {
    return (
      <Flex justifyContent={'center'} alignItems={'center'}>
        <Spinner speed="0.65s" emptyColor="gray.200" color="blue.500" />
      </Flex>
    );
  }

  const CustomBar = ({
                       x,
                       y,
                       width,
                       height,
                       fill,
                     }: {
    x: number
    y: number
    width: number
    height: number
    fill: string
  }) => {
    return (
      <g>
        <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
      </g>
    )
  }
  return (
    <Wrapper>
      {!loading ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={zoomedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <Tooltip
              content={(props) => (
                <CustomToolTip chartProps={props} poolData={poolData} currentPrice={poolData.currentPrice} />
              )}
            />
            <XAxis reversed={false} tick={false} />
            <Bar
              dataKey="activeLiquidity"
              fill="#2172E5"
              isAnimationActive={false}
              shape={(props) => {
                // eslint-disable-next-line react/prop-types
                return <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={props.fill} />
              }}
            >
              {zoomedData?.map((entry, index) => {
                return <Cell key={`cell-${index}`} fill={entry.isCurrent ? '#ff007a' : '#2172E5'} />
              })}
              {/*<LabelList
                dataKey="activeLiquidity"
                position="inside"
                content={(props) => <CurrentPriceLabel chartProps={props} poolData={poolData} data={zoomedData} />}
              />*/}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Flex justifyContent={'center'} alignItems={'center'}>
          <Spinner speed="0.65s" emptyColor="gray.200" color="blue.500" />
        </Flex>
      )}
      <ControlsWrapper>
        <ActionButton disabled={false} onClick={handleZoomOut}>
          -
        </ActionButton>
        <ActionButton disabled={atZoomMax} onClick={handleZoomIn}>
          +
        </ActionButton>
      </ControlsWrapper>
    </Wrapper>
  )
};

export default AddPriceChart;