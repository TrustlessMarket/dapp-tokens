/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useRef } from 'react';

import {
  createChart,
  CrosshairMode,
  LastPriceAnimationMode,
  LineType,
  PriceScaleMode,
  TrackingModeExitMode,
} from 'lightweight-charts';
import useAsyncEffect from 'use-async-effect';
import { StyledTokenChartContainer } from './Token.styled';
import { formatCurrency } from '@/utils';

interface TokenChartProps {
  chartData: any[];
}

const TokenChart: React.FC<TokenChartProps> = ({ chartData }) => {
  const chartContainerRef = useRef<any>();
  const chart = useRef<any>();
  const resizeObserver = useRef<any>();
  const candleSeries = useRef<any>();

  const refCandles = useRef(chartData);

  useAsyncEffect(() => {
    if (!chart.current) {
      chart.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        localization: {
          priceFormatter: (p: any) => {
            return formatCurrency(p, 18);
          },
          // timeFormatter: (t) => {
          //   return moment.unix(t).format('lll');
          // },
        },
        layout: {
          textColor: '#B1B5C3',
          background: { type: 'solid', color: 'white' } as any,
        },
        rightPriceScale: {
          borderColor: '#E6E8EC',
          entireTextOnly: true,
          mode: PriceScaleMode.Logarithmic,
        },
        timeScale: {
          borderColor: '#E6E8EC',
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
          color: 'rgba(0,0,0,0.04)',
          visible: true,
        },
        trackingMode: {
          exitMode: TrackingModeExitMode.OnTouchEnd,
        },
        handleScroll: {
          // vertTouchDrag: !isMobile,
        },
      });

      candleSeries.current = chart.current.addAreaSeries({
        lineColor: '#2862ff',
        lineWidth: 2,
        // lastValueVisible: true,
        // priceLineVisible: false,
        lastPriceAnimation: LastPriceAnimationMode.Continuous,
        lineType: LineType.Curved,
        topColor: 'rgba(41, 98, 255, 0.28)',
      });

      candleSeries.current.priceScale().applyOptions({
        scaleMargins: {
          top: 0.3, // highest point of the series will be 10% away from the top
          bottom: 0.4, // lowest point will be 40% away from the bottom
        },
        priceFormat: {
          type: 'price',
          precision: 18,
          minMove: 0.000000000000000001,
        },
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
    <StyledTokenChartContainer ref={chartContainerRef} style={{ height: '100%' }} />
  );
};

export default memo(TokenChart);
