import { ForeCastDataPoint, RequestStatus } from '../../types'
import { Spin, Typography } from 'antd'
import {
  CartesianGrid,
  ComposedChart,
  Label,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
} from 'recharts'

export type ForecastChartProps = {
  data: ForeCastDataPoint[]
  requestStatus: RequestStatus
}

export const ForecastChart = ({ data, requestStatus }: ForecastChartProps) => {
  if (requestStatus === 'loading') {
    return (
      <div className={'prophet-chart loading'}>
        <div className={'loading-content'}>
          <Spin />
          <Typography.Title level={5} type={'secondary'}>
            Loading Flow Predictions...
          </Typography.Title>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ResponsiveContainer height={260}>
        <ComposedChart data={data} syncId={'dailyData'}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" height={40}>
            <Label value="Day of the Year" position="insideBottom" offset={3} />
          </XAxis>
          <YAxis>
            <Label
              value={'Cubic Feet Per Second (CFS)'}
              angle={-90}
              position="insideBottomLeft"
              offset={10}
            />
          </YAxis>
          <Line
            connectnulls
            type="monotone"
            dataKey="past_value"
            stroke="#000000"
            dot={false}
          />
          <Line
            connectNulls
            type="monotone"
            dataKey="forecast"
            stroke="#349dcf"
            dot={false}
          />
          <Tooltip
            label=""
            formatter={(value, name, props) => {
              if (name === 'past_value') {
                return [`Flow: ${Math.round(value)} cfs`, '']
              } else {
                return [`Forecast: ${Math.round(value)} cfs`, '']
              }
            }}
            itemSorter={(item) => item.name}
            separator=" "
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
