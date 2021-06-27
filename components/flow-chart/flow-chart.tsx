import { GageModel, IGage, IGageReading } from 'interfaces'
import { getGage } from 'controllers'
import { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import moment from 'moment'
import { Card, Button } from 'antd'
import Link from 'next/link'
import { flowChartBackground } from './flow-chart-background'

interface FlowChartProps {
  gageId: number | undefined
  handleDelete: Function
}

/**
 * @todo this component should only be responsible for rendering data. not fetching.
 * @param props
 * @constructor
 */

export const FlowChart = (props: FlowChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>()
  const { gageId } = props
  const [readings, setReadings] = useState<IGageReading[]>([])
  const [flowRanges, setFlowRanges] = useState([])
  const [chartLoaded, setChartLoaded] = useState(false)
  const [gage, setGage] = useState<IGage>({ ...GageModel })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)

  const chartAspectRatio = () => {
    if (windowWidth >= 1080) {
      return 16 / 9 // 16:9
    } else {
      return 4 / 3 // 4:3
    }
  }

  const loadGage = async () => {
    if (!gageId) return
    try {
      setLoading(true)
      const result = await getGage(gageId)
      setGage(result)
      setReadings([...result.gage_readings_gage_readings_gageIdTogages])
      setFlowRanges(result.flow_ranges_flow_ranges_gageIdTogages)
    } catch (e) {
      console.log('e', e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGage()
  }, [])

  useEffect(() => {
    if (!loading && !error && !chartLoaded) {
      // renderChart()
    }
  })
  return (
    <Card
      title={(gage && gage.name) || ''}
      extra={
        <>
          <Button
            danger
            onClick={() => {
              if (gage && gage.id) {
                props.handleDelete(gage.id)
              }
            }}
          >
            Delete
          </Button>
          <Button>
            <Link href={`/gages/${gage.id}`}>View</Link>
          </Button>
        </>
      }
    >
      {chartRef && chartRef.current && (
        <>
          {/* @ts-ignore */}
          <canvas ref={chartRef} />
        </>
      )}
    </Card>
  )
}
