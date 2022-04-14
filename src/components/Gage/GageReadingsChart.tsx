import React, { useLayoutEffect, useRef, useState } from 'react'
import Chart from 'react-apexcharts'
import { GageMetric, GageReading } from '../../types'
import moment from 'moment'
import { Card, Divider, Select } from 'antd'

export type GageReadingsChartProps = {
  readings: GageReading[]
  chartId?: string
  metric: GageMetric
}

export const GageReadingsChart = ({
  readings,
  chartId,
  metric,
}: GageReadingsChartProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [chartHeight, setChartHeight] = useState(300)
  const [chartWidth, setChartWidth] = useState(500)
  const [activeMetric, setActiveMetric] = useState<GageMetric>(metric)

  const getAvailableMetrics = () => {
    const m = new Set(readings.map((r) => r.metric))

    return [...m]
  }

  const getChartData = () => {
    if (readings.length > 0) {
      const filteredReadings = readings.filter((r) => r.metric === activeMetric)
      return {
        categories: filteredReadings.map((r) =>
          moment(r.createdAt).format('hh:mm a'),
        ),
        data: filteredReadings.map((r) => r.value),
      }
    }
    return {
      categories: [],
      data: [],
    }
  }

  const { data, categories } = getChartData()

  const chart = {
    options: {
      chart: {
        id: chartId || 'gage-readings-chart',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        categories,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
      width: 5,
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
    },
    markers: {
      size: 0,
      hover: {
        size: 0,
      },
    },
    series: [
      {
        name: 'readings',
        data,
      },
    ],
    title: {
      text: 'Processes',
      align: 'left',
      style: {
        fontSize: '12px',
      },
    },
  }

  const handleWindowResize = () => {
    if (cardRef && cardRef.current) {
      setChartWidth(cardRef.current.clientWidth - 32)
    }
  }

  useLayoutEffect(() => {
    setChartHeight(300)
    handleWindowResize()

    window?.addEventListener('resize', handleWindowResize)
    return () => {
      window?.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  return (
    <div ref={cardRef}>
      <Card style={{ border: 0 }}>
        <Chart
          options={chart.options}
          series={chart.series}
          height={chartHeight}
          type="area"
          width={chartWidth}
        />
        {readings.length > 0 && (
          <>
            <Divider />
            <Select
              value={activeMetric}
              onSelect={(metric: GageMetric) => setActiveMetric(metric)}
            >
              {getAvailableMetrics().map((m) => (
                <Select.Option key={m} value={m}>
                  {m}
                </Select.Option>
              ))}
            </Select>
          </>
        )}
      </Card>
    </div>
  )
}
