/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useRef } from 'react';

import { colors } from '@/theme/colors';
import { compareString, formatCurrency } from '@/utils';
import BigNumber from 'bignumber.js';
import {
  CrosshairMode,
  LastPriceAnimationMode,
  LineType,
  PriceScaleMode,
  TrackingModeExitMode,
  createChart,
} from 'lightweight-charts';
import moment from 'moment';
import useAsyncEffect from 'use-async-effect';
import { StyledTokenChartContainer } from './Token.styled';
import { useWindowSize } from '@trustless-computer/dapp-core';

interface TokenChartProps {
  chartData: any[];
  dataSymbol: string;
}

const TokenChart: React.FC<TokenChartProps> = ({ chartData, dataSymbol }) => {
  const chartContainerRef = useRef<any>();
  const chart = useRef<any>();
  const resizeObserver = useRef<any>();
  const candleSeries = useRef<any>();
  const { mobileScreen } = useWindowSize();

  const refCandles = useRef(chartData);

  useAsyncEffect(() => {
    if (!chart.current) {
      chart.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        localization: {
          priceFormatter: (p: any) => {
            return new BigNumber(p).toFixed(18);
          },
          timeFormatter: (t: any) => {
            return moment.unix(t).format('lll');
          },
        },
        layout: {
          textColor: '#B1B5C3',
          background: { type: 'solid', color: 'transparent' } as any,
        },
        rightPriceScale: {
          borderColor: colors.darkBorderColor,
          // entireTextOnly: true,
          mode: PriceScaleMode.Logarithmic,
        },
        timeScale: {
          borderColor: colors.darkBorderColor,
          timeVisible: true,
          secondsVisible: false,
          barSpacing: 32,
          rightOffset: 0,
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {},
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: false,
          },
        },
        watermark: {
          text: 'trustless.market',
          fontSize: 50,
          color: 'rgba(255, 255, 255, 0.04)',
          visible: true,
        },
        trackingMode: {
          exitMode: TrackingModeExitMode.OnTouchEnd,
        },
        handleScroll: {
          vertTouchDrag: !mobileScreen,
        },
      });

      candleSeries.current = chart.current.addAreaSeries({
        lineColor: '#2862ff',
        lineWidth: 2,
        lastValueVisible: true,
        priceLineVisible: true,
        lastPriceAnimation: LastPriceAnimationMode.Continuous,
        lineType: LineType.Curved,
        topColor: 'rgba(41, 98, 255, 0.28)',
      });

      candleSeries.current.priceScale().applyOptions({
        scaleMargins: {
          top: 0.3, // highest point of the series will be 10% away from the top
          bottom: 0.4, // lowest point will be 40% away from the bottom
        },
        // priceFormat: {
        //   type: 'price',
        //   precision: 18,
        //   minMove: 0.000000000000000001,
        // },
      });

      const container: any = document.getElementById('chartContainer');

      const toolTip: any = document.createElement('div');
      toolTip.style = `position: absolute; font-size: 12px; z-index: 4; top: 0px; left: 0px;`;
      toolTip.style.background = 'transparent';
      toolTip.style.color = 'white';
      container.appendChild(toolTip);

      chart.current.subscribeCrosshairMove((param: any) => {
        if (
          param.point === undefined ||
          !param.time ||
          param.point.x < 0 ||
          param.point.x > container.clientWidth ||
          param.point.y < 0 ||
          param.point.y > container.clientHeight
        ) {
          toolTip.style.display = 'none';
        } else {
          const dateStr = param.time;
          toolTip.style.display = 'block';
          const data = param.seriesData?.get?.(candleSeries.current);

          if (data) {
            const vol = refCandles.current.find((c) =>
              compareString(c.time, data.time),
            );

            const color =
              Number(vol.close) < Number(vol.open) ? '#EF466F' : '#45B26B';

            toolTip.innerHTML = `<div class="wrapValues">
              <div>${moment(moment.unix(dateStr)).format('lll')} | </div>
              <div>O <span style="color: ${color}">${formatCurrency(
              vol?.open,
              18,
            )}</span></div>
              <div>H <span style="color: ${color}">${formatCurrency(
              vol?.high,
              18,
            )}</span></div>
              <div>L <span style="color: ${color}">${formatCurrency(
              vol?.low,
              18,
            )}</span></div>
              <div>C <span style="color: ${color}">${formatCurrency(
              vol?.close,
              18,
            )}</span></div>
              <div>Vol <span style="color: ${color}">${formatCurrency(
              vol?.volume,
              18,
            )}</span> ${dataSymbol}</div>
            </div>`;
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({ width, height });
      setTimeout(() => {
        chart.current.timeScale().fitContent();
        // chart.current.timeScale().scrollToRealTime();
      }, 0);
    });

    resizeObserver.current.observe(chartContainerRef.current);

    return () => resizeObserver.current.disconnect();
  }, []);

  useEffect(() => {
    if (
      candleSeries.current &&
      candleSeries.current?.setData &&
      chartData.length > 0
    ) {
      refCandles.current = chartData;
      candleSeries.current?.setData(chartData);
    }
  }, [chartData]);

  return (
    <StyledTokenChartContainer
      ref={chartContainerRef}
      style={{ height: '100%' }}
      id="chartContainer"
    />
  );
};

export default memo(TokenChart);
