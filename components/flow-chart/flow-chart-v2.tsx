import { useEffect, useRef, useState } from 'react'
import { renderChart } from './render-chart'
import { IFlowRange } from 'interfaces'
import { Chart } from 'chart.js'

interface FlowChartV2Props {
  readings: number[]
  labels: string[]
  flowRanges?: IFlowRange[]
}

export const FlowChartV2 = (props: FlowChartV2Props) => {
  const { readings, labels, flowRanges } = props
  const chartRef = useRef(null)
  const [chart, setChart] = useState<Chart>()

  useEffect(() => {
    if (chartRef && chartRef.current && labels.length && readings.length) {

      // @ts-ignore
      setChart(renderChart(chartRef.current.getContext('2d'), labels, readings, flowRanges))
    }

    return function cleanUp() {
      if (chart && chart.destroy) {
        chart.destroy()
      }
    }
  }, [readings, labels, chartRef])

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  )
}
