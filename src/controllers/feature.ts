import { FeatureCreateDto, FeatureUpdateDto } from '../types'
import { checkResponse, http } from '../lib'

export const updateFeature = async (dto: FeatureUpdateDto) =>
  http
    .put(`/feature/${dto.id}`, {
      body: JSON.stringify(dto),
    })
    .then((res) => checkResponse(res))

export const deleteFeature = async (id: string) =>
  http.delete(`/feature/${id}`).then((res) => checkResponse(res))

export const createFeature = async (dto: FeatureCreateDto) =>
  http
    .post('/feature', { body: JSON.stringify(dto) })
    .then((res) => checkResponse(res))
