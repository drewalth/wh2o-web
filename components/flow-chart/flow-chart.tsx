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

  const renderChart = () => {
    let ctx

    if (chartRef && chartRef.current) {
      ctx = chartRef.current.getContext('2d')
    }

    const labels = readings.map((r) => moment(r.createdAt).format('lll'))
    const data = readings.map((re) => parseInt(re.reading, 10))

    if (!ctx || !data.length) return

    const classToColor = (c: string) => {
      switch (c) {
        case 'Below Recommended':
          return '#FF8785'
        case 'Low':
          return '#59E78D'
        case 'Medium':
          return '#59E78D'
        case 'High':
          return '#59E78D'
        case 'Above Recommended':
          return '#68DFE9'
      }
    }

    const chartOptions = {
      legend: {
        display: false,
      },
      elements: {
        line: {
          tension: 0,
          borderWidth: 2,
          color: '#152935',
        },
        point: {
          radius: 1,
          hitRadius: 16,
          borderColor: 'rgba(0,0,0,0)',
          hoverBackgroundColor: '#152935',
        },
      },
      layout: {
        padding: 0,
      },
      responsive: true,
      aspectRatio: chartAspectRatio(),
      tooltips: {
        backgroundColor: '#ffffff',
        bodyFontColor: '#152934',
        // bodyFontFamily: "'IBM Plex Sans' , sans-serif",
        bodyFontSize: 22,
        bodyLineHeight: 25,
        bodyFontStyle: 400,
        borderColor: '#DFE3E6',
        borderWidth: 1,
        caretSize: 8,
        cornerRadius: 0,
        displayColors: false,
        enabled: true,
        titleFontColor: '#152934',
        // titleFontFamily: "'IBM Plex Sans' , sans-serif",
        titleFontSize: 12,
        titleLineHeight: 15,
        titleFontStyle: 600,
        titleMarginBottom: 4,
        xPadding: 16,
        yPadding: 16,
        // callbacks: {
        //   label: function(tooltipItem, data) {
        //     let label = data.datasets[tooltipItem.datasetIndex].label || '';
        //     return( `${label} ${ formatReadingWithFormat(parseFloat(tooltipItem.value),otherthis.chartMetric.format)} ${otherthis.chartMetric.unit}`);
        //   }
        // }
      },
      scales: {
        xAxes: [
          {
            display: true,
            distribution: 'series',
            gridLines: {
              color: 'rgba(90, 104, 114, 0.2)',
              borderDash: [4, 4],
            },
            scaleLabel: {
              display: true,
              labelString: 'Timescale',
              // fontFamily: "'IBM Plex Sans' , 'sans-serif'",
              fontSize: 14,
            },
            bounds: 'data',
            ticks: {
              source: 'data',
              beginAtZero: false,
              autoSkip: true,
              maxTicksLimit: 20,
              maxRotation: 45,
              minRotation: 45,
              labelOffset: 20,
              // fontFamily: "'IBM Plex Sans' , 'sans-serif'",
              fontSize: 13,
              unit: 'day',
              displayFormats: {
                day: 'h:mm A',
                week: 'MM/DD h:mm A',
                month: 'MM/DD',
                year: 'MM/DD/YYYY',
              },
              min: Math.floor(moment().subtract(1, 'days').unix()),
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'cfs',
              bounds: 'data',
              // fontFamily: "'IBM Plex Sans' , 'sans-serif'",
              fontSize: 14,
            },
            gridLines: {
              color: 'rgba(90, 104, 114, 0.2)',
              borderDash: [4, 4],
            },
            ticks: {
              beginAtZero: true,
              suggestedMax: Math.max(...data) * 1.25,
              // fontFamily: "'IBM Plex Sans' , 'sans-serif'",
              fontSize: 14,
              // callback: (value)=>formatReadingWithFormat(parseFloat(value),otherthis.chartMetric.format)
              min: 100,
            },
            beforeBuildTicks: () => {
              chartOptions.scales.yAxes[0].ticks.min = 100
            },
          },
        ],
      },
      graphRange: undefined,
    }

    let graphRanges
    let graphBackgrounds: any = []

    if (flowRanges.length) {
      graphRanges = flowRanges.map((range) => ({
        // @ts-ignore
        min: range.min,
        // @ts-ignore
        max: range.min + (range.max - range.min) / 2,
        // @ts-ignore
        class: range.range,
      }))

      console.log('graphRanges', graphRanges)

      graphBackgrounds = [
        ...graphRanges,
        {
          min: Number.MIN_SAFE_INTEGER,
          max: graphRanges
            .map((x: { min: number; max: number }) => x.min)
            .sort((a: number, b: number) => a - b)[0],
          class: 'Below Recommended',
        },
        {
          max: Number.MAX_SAFE_INTEGER,
          min: graphRanges
            .map((x: { min: number; max: number }) => x.max)
            .sort((a: number, b: number) => b - a)[0],
          class: 'Above Recommended',
        },
      ].map((x) => ({ ...x, color: classToColor(x.class) }))
      chartOptions.graphRange = graphBackgrounds
    }

    new Chart(ctx, {
      plugins: chartOptions.graphRange ? [flowChartBackground] : [],
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: [...data],
            borderWidth: 2,
            label: 'Gage Reading',
            fill: false,
            borderColor: 'rgba(60, 86, 110, 1)',
          },
        ],
      },
      chartOptions,
    })

    setChartLoaded(true)
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
      renderChart()
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
