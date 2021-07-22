import { http } from 'lib'
import { CreateMediaDto, Media } from '../interfaces'

export const createMediaEmbed = async (
  payload: CreateMediaDto
): Promise<Media> => {
  return http.post(`/media/embed`, payload).then((res) => res.data)
}

export const createMediaFile = async (
  payload: CreateMediaDto
): Promise<Media> => {
  return http.post(`/media/file`, payload).then((res) => res.data)
}

export const deleteMedia = async (
  id: string | number,
  reachId = 0
): Promise<number> => {
  return http
    .delete(`/media/${id}?reachId=${reachId || ''}`)
    .then((res) => res.data)
}

export const deletePendingMedia = async (fileName: string): Promise<any> => {
  return http
    .delete(`/media/pending?fileName=${fileName}`)
    .then((res) => res.data)
}
