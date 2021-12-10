import { http } from 'lib'
import { Gage, GageReading } from 'types'

export const getGages = async (): Promise<Gage[]> => {
  return http.get('/gages').then((res) => res.data)
}

export const getGage = async (id: string | number): Promise<Gage> => {
  return http.get(`/gages/${id}`).then((res) => res.data)
}

export const getGageReadings = async (
  gageId: string | number
): Promise<GageReading[]> => {
  return http.get(`/gage-readings/${gageId}`).then((res) => res.data)
}

export const searchGages = async (term: string): Promise<Gage[]> => {
  return http.get(`/gages/search?term=${term}`).then((res) => res.data)
}
