import { http } from 'lib'
import { IGage, IGageReading } from '../interfaces'

export const getGages = async () => {
  return http.get('/gages').then((res) => res.data)
}

export const getGage = async (id: string | number) => {
  return http.get(`/gages/${id}`).then((res) => res.data)
}

export const getGageReadings = async (
  gageId: string | number
): Promise<IGageReading[]> => {
  return http.get(`/gage-readings/${gageId}`).then((res) => res.data)
}

export const searchGages = async (term: string) => {
  return http.get(`/gages/search?term=${term}`).then((res) => res.data)
}
