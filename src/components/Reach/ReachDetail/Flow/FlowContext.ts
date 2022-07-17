import { createContext, useContext } from 'react'
import { DateFormat } from '../../../../enums'
import { Gage, GageMetric } from '../../../../types'

export type FlowContextData = {
  metric: GageMetric
  availableMetrics: GageMetric[]
  gage?: Gage
  gages: Gage[]
  setMetric: (m: GageMetric) => void
  setGage: (g: Gage) => void
  readings: number[]
  readingLabels: string[]
  dateFormat: DateFormat
  setDateFormat: (df: DateFormat) => void
}

export const FlowContext = createContext({} as FlowContextData)

export const useFlowContext = () => {
  const ctx = useContext(FlowContext)

  if (ctx === undefined) {
    throw new Error('must use inside valid provider')
  }
  return ctx
}
