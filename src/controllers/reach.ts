import { checkResponse, http } from '../lib'
import { ReachSearchParams, ReachUpdateDto } from '../types'

export const reachSearch = async (searchParams: ReachSearchParams) => {
  const params = new URLSearchParams()

  for (const p in searchParams) {
    if (searchParams[p]) {
      params.append(p, searchParams[p])
    }
  }

  return http.get(`/reach/search?${params}`).then((res) => checkResponse(res))
}

export const getReach = async (id: string) =>
  http.get(`/reach/${id}`).then((res) => checkResponse(res))

export const updateReach = async (id: number, dto: ReachUpdateDto) =>
  http
    .put(`/reach/${id}`, { body: JSON.stringify(dto) })
    .then((res) => checkResponse(res))
