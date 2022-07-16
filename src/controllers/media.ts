import { checkResponse, http } from '../lib'
import { MediaCreateDto } from '../types'

export const singleFileUpload = async () => {
  return http
    .post('/media/single-upload', {
      headers: {
        ['content-type']: 'multipart/form-data',
      },
    })
    .then((res) => checkResponse(res))
}

export const createMedia = async (dto: MediaCreateDto) => {
  return http
    .post('/media', {
      body: JSON.stringify(dto),
    })
    .then((res) => checkResponse(res))
}
