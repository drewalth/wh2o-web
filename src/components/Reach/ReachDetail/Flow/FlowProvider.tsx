import { ReactNode, useCallback, useState } from 'react'
import { Gage, GageMetric, GageReading } from '../../../../types'
import { FlowContext } from './FlowContext'
import moment from 'moment'
import { DateFormat } from '../../../../enums'

export type FlowProviderProps = {
  children: ReactNode
  gages: Gage[]
}

type FlowChartData = {
  data: number[]
  categories: string[]
}

const getPrimaryGage = (gages: Gage[]) => {
  if (gages.length === 0) return

  if (gages.length === 1) {
    return gages[0]
  }

  const pG = gages.find((g) => g.primary)

  if (!pG) {
    return gages[0]
  }

  return pG
}

export const FlowProvider = ({ children, gages }: FlowProviderProps) => {
  const primaryGage = getPrimaryGage(gages)

  const [dateFormat, setDateFormat] = useState<DateFormat>(DateFormat.DDHHMMA)
  const [metric, setMetric] = useState<GageMetric>(
    primaryGage?.metric || GageMetric.CFS,
  )
  const [gage, setGage] = useState<Gage | undefined>(primaryGage)

  const mockReadings: GageReading[] = [...Array(100)].map((el, idx) => ({
    id: (idx + 1).toString(),
    siteId: gage?.siteId || '1234',
    gageID: gage?.id || '1234',
    gageName: gage?.name || 'mockGage',
    metric: GageMetric.CFS,
    value: Math.random(),
  }))

  const readings: GageReading[] = gage?.readings || mockReadings

  const getAvailableMetrics = useCallback((): GageMetric[] => {
    if (readings.length > 0) {
      const m = new Set(readings.map((r) => r.metric))
      // const mArr = [...m]
      return [...m]
    }

    return [GageMetric.CFS, GageMetric.FT]
  }, [gage])

  const getFlowChartData = useCallback((): FlowChartData => {
    if (readings.length > 0) {
      const filteredReadings = readings.filter((r) => r.metric === metric)

      return {
        data: filteredReadings.map((d) => d.value),
        categories: filteredReadings
          .reverse()
          .map((r) => moment(r.createdAt).local().format(dateFormat)),
      }
    }

    return {
      data: [],
      categories: [],
    }
  }, [gage, metric, dateFormat])

  const { data, categories } = getFlowChartData()
  const availableMetrics = getAvailableMetrics()

  return (
    <FlowContext.Provider
      value={{
        metric,
        gage,
        gages,
        setGage,
        setMetric,
        readings: data,
        readingLabels: categories,
        dateFormat,
        setDateFormat,
        availableMetrics,
      }}
    >
      {children}
    </FlowContext.Provider>
  )
}
