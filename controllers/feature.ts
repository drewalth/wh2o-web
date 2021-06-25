import { http } from 'lib'
import { IFeature } from '../interfaces'

export const createFeature = async (data: IFeature) => {
  return http.post('/features', data).then((res) => res.data)
}

export const updateFeature = async (data: IFeature) => {
  return http.patch(`/features/${data.id}`, data).then((res) => res.data)
}

export const deleteFeature = async (id: number | string) => {
  return http.delete(`/features/${id}`).then((res) => res.data)
}
