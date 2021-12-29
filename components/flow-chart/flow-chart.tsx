import { useEffect, useRef, useState } from 'react'
import { renderChart } from './render-chart'
import { FlowRange } from 'types'
import { Chart } from 'chart.js'

interface FlowChartV2Props {
  readings: number[]
  labels: string[]
  flowRanges?: FlowRange[]
}

export const FlowChart = (props: FlowChartV2Props) => {
  const { readings, labels, flowRanges } = props
  const chartRef = useRef(null)
  const [chart, setChart] = useState<Chart>()

  useEffect(() => {
    if (chartRef && chartRef.current && labels.length && readings.length) {
      setChart(
        renderChart(
          // @ts-ignore
          chartRef.current.getContext('2d'),
          labels,
          readings,
          flowRanges,
        ),
      )
    }

    return function cleanUp() {
      if (chart && chart.destroy) {
        chart.destroy()
      }
    }
  }, [readings, labels, chartRef])

  return (
    <div style={{ position: 'relative', maxHeight: '50vh' }}>
      <canvas
        style={{ height: '100%', maxHeight: '100%', minHeight: 500 }}
        ref={chartRef}
      />
    </div>
  )
}
