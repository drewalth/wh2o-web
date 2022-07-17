import Chart from 'react-apexcharts'
import { useLayoutEffect, useRef, useState } from 'react'
import { useFlowContext } from './FlowContext'
import './flow-chart.scss'

export const FlowChart = () => {
  const { readingLabels, readings } = useFlowContext()
  const [chartWidth, setChartWidth] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const chartOpt = {
    options: {
      chart: {
        id: 'flow-chart',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        categories: readingLabels,
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
        data: readings,
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
    if (wrapperRef && wrapperRef.current) {
      setChartWidth(wrapperRef.current.clientWidth)
    }
  }

  useLayoutEffect(() => {
    setChartWidth(300)
    handleWindowResize()

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  if (readings.length === 0) {
    return <div>No readings</div>
  }

  return (
    <div ref={wrapperRef} className={'flow-chart-wrapper'}>
      <Chart
        options={chartOpt.options}
        series={chartOpt.series}
        height={300}
        type={'area'}
        width={chartWidth}
      />
    </div>
  )
}
