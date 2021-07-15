import { http } from 'lib'
import { Media } from '../interfaces'

export const createMedia = async (payload: Media): Promise<Media> => {
  return http.post(`/media`, payload).then((res) => res.data)
}

export const deleteMedia = async (id: string | number): Promise<number> => {
  return http.delete(`/media/${id}`).then((res) => res.data)
}

export const deletePendingMedia = async (fileName: string): Promise<any> => {
  return http
    .delete(`/media/pending?fileName=${fileName}`)
    .then((res) => res.data)
}
