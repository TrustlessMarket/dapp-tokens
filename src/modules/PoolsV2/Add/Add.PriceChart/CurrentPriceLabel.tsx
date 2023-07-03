/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import {ChartEntry} from './index'
import styled from 'styled-components'
import {AutoColumn} from "@/components/Column";
import {RowFixed} from "@/components/Row";
import {Text} from '@chakra-ui/react';

const Wrapper = styled.div`
  border-radius: 8px;
  padding: 6px 12px;
  color: white;
  width: fit-content;
  font-size: 14px;
  background-color: ${({ theme }) => theme.bg2};
`

interface LabelProps {
  x: number
  y: number
  index: number
}

interface CurrentPriceLabelProps {
  data: ChartEntry[] | undefined
  chartProps: any
  poolData: any
}

export function CurrentPriceLabel({ data, chartProps, poolData }: CurrentPriceLabelProps) {
  const labelData = chartProps as LabelProps
  const entryData = data?.[labelData.index]
  if (entryData?.isCurrent) {
    const price0 = entryData.price0
    const price1 = entryData.price1
    return (
      <g>
        <foreignObject x={labelData.x - 80} y={318} width={'100%'} height={100}>
          <Wrapper>
            <AutoColumn gap="6px">
              <RowFixed align="center">
                <Text mr="6px" fontWeight={500} color='#C3C5CB'>Current Price</Text>
                <div
                  style={{
                    marginTop: '2px',
                    height: '6px',
                    width: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#ff007a',
                  }}
                ></div>
              </RowFixed>
              <Text fontWeight={500} color='#FFFFFF'>{`1 ${poolData.token0.symbol} = ${Number(price0).toLocaleString(undefined, {
                minimumSignificantDigits: 1,
              })} ${poolData.token1.symbol}`}</Text>
              <Text fontWeight={500} color='#FFFFFF'>{`1 ${poolData.token1.symbol} = ${Number(price1).toLocaleString(undefined, {
                minimumSignificantDigits: 1,
              })} ${poolData.token0.symbol}`}</Text>
            </AutoColumn>
          </Wrapper>
        </foreignObject>
      </g>
    )
  }
  return null
}
