import { http } from 'lib'
import { Gage, River, RiversMedia, ReachSearchParams } from 'interfaces'

export const getRivers = async (
  params: ReachSearchParams
): Promise<River[]> => {
  return http.get('/reaches', { params }).then((res) => res.data)
}

export const getRiver = async (id: number | string): Promise<River> => {
  return http.get(`/reaches/${id}`).then((res) => res.data)
}

export const updateRiver = async (
  id: number | string,
  payload: River
): Promise<River> => {
  return http.patch(`/reaches/${id}`, payload).then((res) => res.data)
}

export const createRiversMedia = async (payload: RiversMedia) => {
  return http.post(`/reaches-media`, payload).then((res) => res.data)
}

export const searchRiver = async (term: string): Promise<River[]> => {
  return http.get(`/reaches/search?term=${term}`).then((res) => res.data)
}

export const addGage = async ({
  reachId,
  gageId,
  primary,
}: {
  reachId: number
  gageId: number
  primary: boolean
}): Promise<Gage> => {
  return http
    .post('/reach-gages', { reachId, gageId, primary })
    .then((res) => res.data)
}

export const removeGage = async (gageId: number, reachId: number) => {
  return http
    .delete(`/reach-gages/${reachId}/${gageId}`)
    .then((res) => res.data)
}

export const createReach = async (payload: any): Promise<River> => {
  return http.post('/reaches', payload).then((res) => res.data)
}
