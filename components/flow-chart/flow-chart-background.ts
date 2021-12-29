import { Chart } from 'chart.js'

// TODO make this work
const flowChartBackground = {
  beforeDraw: (chart: Chart) => {
    // @ts-ignore
    const graphRange = chart.config._config.chartOptions.graphRange
    const chartArea = chart.chartArea
    const ctx = chart.ctx
    // const minRangeStart = graphRange.min;
    const yAxis = chart.scales.y
    const yTicks = yAxis.ticks

    ctx.save()

    console.log('graphRange: ', graphRange)

    if (yTicks.length > 2) {
      graphRange.forEach(
        (x: {
          max: number
          min: number
          color: string | CanvasGradient | CanvasPattern
        }) => {
          //const chartHeight = chartArea.bottom - chartArea.top;
          //const minRangeY = yAxis.getPixelForValue(x.min);
          const top = yAxis.getPixelForValue(x.max, 10)
          let drawTop = top > chartArea.top ? top : chartArea.top
          if (top > chartArea.bottom) {
            drawTop = chartArea.bottom
          }
          const bottom = yAxis.getPixelForValue(x.min, 0)
          let drawBottom =
            !Number.isNaN(bottom) && bottom > chartArea.bottom
              ? chartArea.bottom
              : bottom
          if (bottom < chartArea.top) {
            drawBottom = chartArea.top
          }

          const rangeWidth = chartArea.right - chartArea.left

          // set the high range color
          ctx.fillStyle = x.color
          // we don't draw the max range if it's off the chart

          ctx.fillRect(
            chartArea.left,
            drawTop,
            rangeWidth,
            drawBottom - drawTop,
          )
        },
      )
    }
    ctx.restore()
  },
}

export { flowChartBackground }
