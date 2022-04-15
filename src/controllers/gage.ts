import { Gage, GageSearchParams, UpdateGageDto } from '../types'
import { http } from '../lib'
import { Endpoints } from '../enums'
import * as qs from 'qs'

export const getGage = async (state: string, id: number): Promise<Gage> => {
  return http.get(`/gage/${state}/${id}`).then((res) => res.data)
}

export const updateGage = async (updateGageDto: UpdateGageDto) => {
  return http
    .put(Endpoints.GAGE, qs.stringify(updateGageDto), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    .then(({ data }) => data)
}

export const gageSearch = async (
  input: GageSearchParams,
): Promise<{ gages: Gage[]; total: number }> => {
  const params = new URLSearchParams()

  for (const val in input) {
    params.append(val, input[val])
  }

  return http.get(`/gage/search?${params}`).then(({ data }) => data)
}
