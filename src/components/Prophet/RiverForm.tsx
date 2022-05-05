import { DailyAverage, ForeCastDataPoint, RequestStatus } from '../../types'
import { useEffect, useState } from 'react'
import { getDailyAverage, getForecast } from '../../controllers'
import { HistoricAverageChart } from './Charts/HistoricAverageChart'
import { ForecastChart } from './Charts/ForecastChart'
import { Card, Divider } from 'antd'

export type RiverFormProps = {
  className?: string
  siteId: string
  siteDescription: string
  historicalAverageChartVisible?: boolean
  dividerVisible?: boolean
}

export const RiverForm = ({
  siteDescription,
  siteId,
  className,
  historicalAverageChartVisible = true,
  dividerVisible = true,
}: RiverFormProps) => {
  const [dailyAverages, setDailyAverages] = useState<DailyAverage[]>([])
  const [dailyAveragesRequestStatus, setDailyAveragesRequestStatus] =
    useState<RequestStatus>('loading')

  // const [runnablePercentages, setRunnablePercentages] = useState<
  //   RunnablePercentage[]
  // >([])
  // const [
  //   runnablePercentagesRequestStatus,
  //   setRunnablePercentagesRequestStatus,
  // ] = useState<RequestStatus>('loading')

  const [forecastData, setForecastData] = useState<ForeCastDataPoint[]>([])
  const [forecastRequestStatus, setForecastRequestStatus] =
    useState<RequestStatus>('loading')

  const fetchDailyAverage = async () => {
    try {
      setDailyAveragesRequestStatus('loading')
      const result = await getDailyAverage(siteId)
      setDailyAverages(result)
      setDailyAveragesRequestStatus('success')
    } catch (e) {
      console.error(e)
      setDailyAveragesRequestStatus('failure')
    }
  }

  // const fetchRunnablePercentage = async () => {
  //   try {
  //     setRunnablePercentagesRequestStatus('loading')
  //     const result = await getRunnablePercentage(siteId)
  //     setRunnablePercentages(result)
  //     setRunnablePercentagesRequestStatus('success')
  //   } catch (e) {
  //     console.error(e)
  //     setRunnablePercentagesRequestStatus('failure')
  //   }
  // }

  const fetchForecast = async () => {
    try {
      setForecastRequestStatus('loading')
      const result = await getForecast(siteId)
      setForecastData(result)
      setForecastRequestStatus('success')
    } catch (e) {
      console.error(e)
      setForecastRequestStatus('failure')
    }
  }

  useEffect(() => {
    ;(async () => {
      await Promise.all([
        fetchDailyAverage(),
        // fetchRunnablePercentage(),
        fetchForecast(),
      ])
    })()
  }, [siteId])

  return (
    <Card className={className} title={siteDescription}>
      {historicalAverageChartVisible && (
        <HistoricAverageChart
          data={dailyAverages}
          requestStatus={dailyAveragesRequestStatus}
        />
      )}
      {siteDescription && dividerVisible && <Divider />}
      <ForecastChart
        data={forecastData}
        requestStatus={forecastRequestStatus}
      />
    </Card>
  )
}
