import { checkResponse, http } from '../lib'
import { DailyAverage, ForeCastDataPoint, RunnablePercentage } from '../types'

export const getDailyAverage = async (
  siteId: string,
): Promise<DailyAverage[]> => {
  return http
    .get(`/prophet/daily-average?siteId=${siteId}`)
    .then((res) => checkResponse(res))
}

export const getRunnablePercentage = async (
  siteId: string,
  minFlow = 300,
  maxFlow = 1000,
): Promise<RunnablePercentage[]> => {
  return http
    .get(
      `/prophet/runnable-percentage?siteId=${siteId}&minFlow=${minFlow}&maxFlow=${maxFlow}`,
    )
    .then((res) => checkResponse(res))
}

export const getForecast = async (
  siteId: string,
): Promise<ForeCastDataPoint[]> => {
  return http
    .get(`/prophet/forecast?siteId=${siteId}`)
    .then((res) => checkResponse(res))
}
