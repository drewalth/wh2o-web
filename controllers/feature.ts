import { http } from 'lib'
import { Feature } from 'types'

export const createFeature = async (data: Feature) => {
  return http.post('/features', data).then((res) => res.data)
}

export const updateFeature = async (data: Feature) => {
  return http.patch(`/features/${data.id}`, data).then((res) => res.data)
}

export const deleteFeature = async (id: number | string) => {
  return http.delete(`/features/${id}`).then((res) => res.data)
}
