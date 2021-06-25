import { http } from 'lib'
import { IRiver, IRiversMedia } from '../interfaces'

export const getRivers = async () => {
  return http.get('/reaches').then((res) => res.data)
}

export const getRiver = async (id: number | string) => {
  return http.get(`/reaches/${id}`).then((res) => res.data)
}

export const updateRiver = async (
  id: number | string,
  payload: IRiver
): Promise<IRiver> => {
  return http.put(`/reaches/${id}`, payload).then((res) => res.data)
}

export const createRiversMedia = async (payload: IRiversMedia) => {
  return http.post(`/reaches-media`, payload).then((res) => res.data)
}

export const searchRiver = async (term: string): Promise<IRiver[]> => {
  return http.get(`/reaches/search?term=${term}`).then((res) => res.data)
}
