import React, { useLayoutEffect, useRef, useState } from 'react'
import Chart from 'react-apexcharts'
import { Gage, GageMetric, GageReading } from '../../types'
import moment from 'moment'
import { Card, Divider, Form, Select } from 'antd'
import { DateFormat } from '../../enums'
import { HelpTooltip } from '../Common'
import { useTranslation } from 'react-i18next'

export type GageReadingsChartProps = {
  readings: GageReading[]
  chartId?: string
  metric: GageMetric
  gage?: Gage
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
  const [dateFormat, setDateFormat] = useState<DateFormat>(DateFormat.LLLL)
  const { t } = useTranslation()

  const getAvailableMetrics = () => {
    const m = new Set(readings.map((r) => r.metric))
    const mArr = [...m]
    if (!mArr.includes(activeMetric)) {
      setActiveMetric(mArr[0])
    }

    return mArr
  }

  const getChartData = () => {
    if (readings.length > 0) {
      const filteredReadings = readings.filter((r) => r.metric === activeMetric)
      return {
        categories: filteredReadings
          .reverse()
          .map((r) => moment(r.createdAt).local().format(dateFormat)),
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
      setChartWidth(cardRef.current.clientWidth - window.innerWidth * 0.05)
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
      <Card
        style={{ border: 0, backgroundColor: 'transparent' }}
        className={'gage-reading-chart-wrapper'}
      >
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
            <Form layout={'inline'}>
              <Form.Item label={t('chartMetric')}>
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
              </Form.Item>
              <Form.Item label={t('dateFormat')}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Select
                    style={{ marginRight: 8 }}
                    value={dateFormat}
                    onSelect={(value) => setDateFormat(value)}
                  >
                    {Object.values(DateFormat).map((v) => (
                      <Select.Option key={v} value={v}>
                        {v}
                      </Select.Option>
                    ))}
                  </Select>
                  <HelpTooltip
                    title={
                      'https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/'
                    }
                  />
                </div>
              </Form.Item>
            </Form>
            <Divider style={{ marginBottom: 0 }} />
          </>
        )}
      </Card>
    </div>
  )
}
