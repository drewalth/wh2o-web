import { useLayoutEffect, useState } from 'react'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { ForeCastDataPoint, GageSource, RequestStatus } from '../../../../types'
import { useFlowContext } from './FlowContext'
import { ForecastChart } from '../../../Prophet/Charts/ForecastChart'
import { getForecast } from '../../../../controllers'
import { notify } from '../../../../lib'

export const FlowForecast = () => {
  const { t } = useTranslation()
  const { gage } = useFlowContext()
  const [chartData, setChartData] = useState<ForeCastDataPoint[]>([])
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading')

  const load = async () => {
    try {
      if (!gage || gage.source !== GageSource.USGS) return

      setRequestStatus('loading')
      const result = await getForecast(gage.siteId)

      setChartData(result)

      setRequestStatus('success')
    } catch (e) {
      setRequestStatus('failure')
      notify.error('failed to load forecast')
    }
  }

  useLayoutEffect(() => {
    ;(async () => {
      await load()
    })()
  }, [])

  return (
    <>
      <Typography.Title level={4} type={'secondary'}>
        {t('forecast')}
      </Typography.Title>
      <ForecastChart data={chartData} requestStatus={requestStatus} />
    </>
  )
}
