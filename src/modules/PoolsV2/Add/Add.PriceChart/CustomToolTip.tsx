/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import styled from 'styled-components'
import {Text} from '@chakra-ui/react';
import {AutoColumn} from "@/components/Column";
import {RowBetween} from "@/components/Row";
import {LightCard} from "@/components/Card";
import {formatAmount} from "@/utils/number";

const TooltipWrapper = styled(LightCard)`
  padding: 12px;
  width: 320px;
  opacity: 0.6;
  font-size: 12px;
  z-index: 10;
`

interface CustomToolTipProps {
  chartProps: any
  poolData: any
  currentPrice: number | undefined
}

export function CustomToolTip({ chartProps, poolData }: CustomToolTipProps) {
  const price0 = chartProps?.payload?.[0]?.payload.price0
  const price1 = chartProps?.payload?.[0]?.payload.price1
  const tvlToken0 = chartProps?.payload?.[0]?.payload.tvlToken0
  const tvlToken1 = chartProps?.payload?.[0]?.payload.tvlToken1

  return (
    <TooltipWrapper>
      <AutoColumn gap="sm">
        <Text fontWeight={500} color='#6C7284'>Tick stats</Text>
        <RowBetween>
          <Text fontWeight={500} color='#FFFFFF'>{poolData?.token0?.symbol} Price: </Text>
          <Text fontWeight={500} color='#FFFFFF'>
            {price0
              ? Number(price0).toLocaleString(undefined, {
                  minimumSignificantDigits: 1,
                })
              : ''}{' '}
            {poolData?.token1?.symbol}
          </Text>
        </RowBetween>
        <RowBetween>
          <Text fontWeight={500} color='#FFFFFF'>{poolData?.token1?.symbol} Price: </Text>
          <Text fontWeight={500} color='#FFFFFF'>
            {price1
              ? Number(price1).toLocaleString(undefined, {
                  minimumSignificantDigits: 1,
                })
              : ''}{' '}
            {poolData?.token0?.symbol}
          </Text>
        </RowBetween>
        {
          tvlToken0 > 0 && (
            <RowBetween>
              <Text fontWeight={500} color='#FFFFFF'>{poolData?.token0?.symbol} Locked: </Text>
              <Text fontWeight={500} color='#FFFFFF'>
                {tvlToken0 ? formatAmount(tvlToken0) : ''} {poolData?.token0?.symbol}
              </Text>
            </RowBetween>
          )
        }
        {
          tvlToken1 > 0 && (
            <RowBetween>
              <Text fontWeight={500} color='#FFFFFF'>{poolData?.token1?.symbol} Locked: </Text>
              <Text fontWeight={500} color='#FFFFFF'>
                {tvlToken1 ? formatAmount(tvlToken1) : ''} {poolData?.token1?.symbol}
              </Text>
            </RowBetween>
          )
        }

        {/*{currentPrice && price0 && currentPrice > price1 ? (
          <RowBetween>
            <Text fontWeight={500} color='#FFFFFF'>{poolData?.token0?.symbol} Locked: </Text>
            <Text fontWeight={500} color='#FFFFFF'>
              {tvlToken0 ? formatAmount(tvlToken0) : ''} {poolData?.token0?.symbol}
            </Text>
          </RowBetween>
        ) : (
          <RowBetween>
            <Text fontWeight={500} color='#FFFFFF'>{poolData?.token1?.symbol} Locked: </Text>
            <Text fontWeight={500} color='#FFFFFF'>
              {tvlToken1 ? formatAmount(tvlToken1) : ''} {poolData?.token1?.symbol}
            </Text>
          </RowBetween>
        )}*/}
      </AutoColumn>
    </TooltipWrapper>
  )
}

export default CustomToolTip
