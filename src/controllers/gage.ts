import { CreateGageDto, Gage, GageSearchParams, UpdateGageDto } from '../types'
import { http, checkResponse } from '../lib'
import { Endpoints } from '../enums'

export const getGage = async (id: string): Promise<Gage> => {
  return http.get(`/gage/${id}`).then((res) => checkResponse(res))
}

export const updateGage = async (updateGageDto: UpdateGageDto) => {
  return http
    .put(Endpoints.GAGE, { body: JSON.stringify(updateGageDto) })
    .then((res) => checkResponse(res))
}

export const gageSearch = async (
  input: GageSearchParams,
): Promise<{ gages: Gage[]; total: number; refreshing: boolean }> => {
  const params = new URLSearchParams()

  for (const val in input) {
    params.append(val, input[val])
  }

  return http.get(`/gage/search?${params}`).then((res) => checkResponse(res))
}

export const createGage = async (createGageDto: CreateGageDto) => {
  return http
    .post('/gage', {
      body: JSON.stringify(createGageDto),
    })
    .then((res) => checkResponse(res))
}
