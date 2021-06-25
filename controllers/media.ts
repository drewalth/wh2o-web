import { http } from 'lib'
import { IMedia } from '../interfaces'

export const createMedia = async (payload: IMedia) => {
  return http.post(`/media`, payload).then((res) => res.data)
}

export const deleteMedia = async (id: string | number) => {
  return http.delete(`/media/${id}`).then((res) => res.data)
}

export const deletePendingMedia = async (fileName: string) => {
  return http
    .delete(`/media/pending?fileName=${fileName}`)
    .then((res) => res.data)
}
