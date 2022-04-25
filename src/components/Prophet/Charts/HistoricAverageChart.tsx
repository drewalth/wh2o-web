import { DailyAverage, RequestStatus } from '../../../types'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Label,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
} from 'recharts'
import { Spin, Typography } from 'antd'

export type HistoricAverageChartProps = {
  data: DailyAverage[]
  requestStatus: RequestStatus
}

export const HistoricAverageChart = ({
  data,
  requestStatus,
}: HistoricAverageChartProps) => {
  if (requestStatus === 'loading') {
    return (
      <div className={'prophet-chart loading'}>
        <div className={'loading-content'}>
          <Spin />
          <Typography.Title level={5} type={'secondary'}>
            Loading Daily Averages...
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
          <Area
            type="monotone"
            dataKey="middleFifty"
            stroke="#349dcf"
            fill="#349dcf"
            fillOpacity={0.5}
          />
          <Line
            type="monotone"
            dataKey="average"
            stroke="#000000"
            dot={false}
          />
          <Tooltip
            label=""
            formatter={(value, name, props) => {
              if (name === 'middleFifty') {
                return [
                  `Middle 50%: ${props.payload.middleFifty[0]} - ${props.payload.middleFifty[1]} cfs`,
                  '',
                ]
              } else {
                return [`Average: ${Math.round(value)} cfs`, '']
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
