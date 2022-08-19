import { checkResponse, http } from '../lib'
import { MediaCreateDto, MediaUpdateDto } from '../types'

export const createMedia = async (dto: MediaCreateDto) => {
  return http
    .post('/media', {
      body: JSON.stringify(dto),
    })
    .then((res) => checkResponse(res))
}

export const deleteMedia = async (id: string) =>
  http.delete(`/media/${id}`).then((res) => checkResponse(res))

export const updateMedia = async (id: number, dto: MediaUpdateDto) =>
  http
    .put(`/media/${id}`, { body: JSON.stringify(dto) })
    .then((res) => checkResponse(res))
