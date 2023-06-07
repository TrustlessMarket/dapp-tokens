/* eslint-disable @typescript-eslint/no-explicit-any */
import {IToken} from '@/interfaces/token';
import {Box} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import {createChart} from 'lightweight-charts';
import {useEffect, useMemo, useRef} from 'react';

const ChartThumb = ({ chartData }: { chartData: any[] }) => {
  const chartContainerRef = useRef<any>();
  const chart = useRef<any>();
  const resizeObserver = useRef<any>();
  const candleSeries = useRef<any>();

  const refCandles = useRef(chartData);

  useEffect(() => {
    if (!chart.current) {
      chart.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,

        layout: {
          textColor: '#B1B5C3',
          background: { type: 'solid', color: 'transparent' } as any,
        },
        rightPriceScale: {
          visible: false,
        },
        timeScale: {
          visible: false,
        },
        crosshair: {
          //   mode: CrosshairMode.Normal,
          vertLine: {
            visible: false,
          },
          horzLine: {
            visible: false,
          },
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: false,
          },
        },
        trackingMode: {
          //   exitMode: TrackingModeExitMode.OnTouchEnd,
        },
        handleScroll: false,
        handleScale: false,
      });

      candleSeries.current = chart.current.addLineSeries({
        // lineColor: '#2862ff',
        lineWidth: 1,
        lastValueVisible: false,
        priceLineVisible: false,
        // lastPriceAnimation: LastPriceAnimationMode.Continuous,
        // lineType: LineType.Curved,
        crosshairMarkerVisible: false,
      });

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
    }
  }, []);

  useEffect(() => {
    if (
      candleSeries.current &&
      candleSeries.current?.setData &&
      chartData.length > 0
    ) {
      refCandles.current = chartData;
      candleSeries.current?.setData(chartData);
      chart.current.timeScale().fitContent();
    }
  }, [chartData]);

  return <div ref={chartContainerRef} style={{ height: '100%' }} />;
};

const TokenChartLast7Day = ({ token }: { token: IToken }) => {
  const data = useMemo(() => {
    if(token?.chart) {
      let color = '#45B26B';

      color = token?.percent7Day < 0 ? '#EF466F' : '#45B26B';

      const _data = token?.chart?.map((v: any) => {
        return {
          // ...v,
          value: new BigNumber(v.close).toNumber(),
          time: Number(v.timestamp),
          open: new BigNumber(v.open).toNumber(),
          high: new BigNumber(v.high).toNumber(),
          close: new BigNumber(v.close).toNumber(),
          low: new BigNumber(v.low).toNumber(),
          color,
          // volume: Number(v.volume || 0),
        };
      });

      return _data;
    }

    return [];
  }, [JSON.stringify(token?.chart)]);

  return (
    <Box
      aria-label={''}
      style={{
        width: '146px',
        height: '73px',
        position: 'relative',
      }}
    >
      {data.length > 0 ? <ChartThumb chartData={data} /> : null}
    </Box>
  );
};

export default TokenChartLast7Day;
