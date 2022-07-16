import { checkResponse, http } from '../lib'
import { ReachSearchParams } from '../types'

export const reachSearch = async (searchParams: ReachSearchParams) => {
  const params = new URLSearchParams()

  for (const p in searchParams) {
    if (searchParams[p]) {
      params.append(p, searchParams[p])
    }
  }

  return http.get(`/reach/search?${params}`).then((res) => checkResponse(res))
}

export const getReach = async (id: string) => {
  return http.get(`/reach/${id}`).then((res) => checkResponse(res))
}
