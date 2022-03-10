import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import { GageMetric, GageReading } from '../../types';
import moment from 'moment';
import { Card } from 'antd';

export type GageReadingsChartProps = {
  readings: GageReading[];
  chartId?: string;
  metric: GageMetric;
};

export const GageReadingsChart = ({ readings, chartId, metric }: GageReadingsChartProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(500);

  const getChartData = () => {
    if (readings.length > 0) {
      const filteredReadings = readings.filter((r) => r.metric === metric);
      return {
        categories: filteredReadings.map((r) => moment(r.createdAt).format('hh:mm a')),
        data: filteredReadings.map((r) => r.value)
      };
    }
    return {
      categories: [],
      data: []
    };
  };

  const { data, categories } = getChartData();

  const chart = {
    options: {
      chart: {
        id: chartId || 'gage-readings-chart',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      xaxis: {
        categories
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight',
      width: 5
    },
    grid: {
      padding: {
        left: 0,
        right: 0
      }
    },
    markers: {
      size: 0,
      hover: {
        size: 0
      }
    },
    series: [
      {
        name: 'readings',
        data
      }
    ],
    title: 'foo'
  };

  const handleWindowResize = () => {
    if (cardRef && cardRef.current) {
      console.log();
      setChartWidth(cardRef.current.clientWidth - 24);
    }
  };

  useLayoutEffect(() => {
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div ref={cardRef}>
      <Card>
        <Chart options={chart.options} series={chart.series} type="area" width={chartWidth} />
      </Card>
    </div>
  );
};
