import { http } from 'lib'
import { IGage, IRiver, IRiversMedia, ReachSearchParams } from 'interfaces'

export const getRivers = async (params: ReachSearchParams) => {
  return http.get('/reaches', { params }).then((res) => res.data)
}

export const getRiver = async (id: number | string) => {
  return http.get(`/reaches/${id}`).then((res) => res.data)
}

export const updateRiver = async (
  id: number | string,
  payload: IRiver
): Promise<IRiver> => {
  return http.patch(`/reaches/${id}`, payload).then((res) => res.data)
}

export const createRiversMedia = async (payload: IRiversMedia) => {
  return http.post(`/reaches-media`, payload).then((res) => res.data)
}

export const searchRiver = async (term: string): Promise<IRiver[]> => {
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
}): Promise<IGage> => {
  return http
    .post('/reach-gages', { reachId, gageId, primary })
    .then((res) => res.data)
}

export const removeGage = async (gageId: number, reachId: number) => {
  return http
    .delete(`/reach-gages/${reachId}/${gageId}`)
    .then((res) => res.data)
}

export const createReach = async (payload: any): Promise<IRiver> => {
  return http.post('/reaches', payload).then((res) => res.data)
}
