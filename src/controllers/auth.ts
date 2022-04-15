import { http } from '../lib'
import { Endpoints } from '../enums'
import * as qs from 'qs'

export const authLogin = async (payload) => {
  return http
    .post(Endpoints.AUTH + '/login', qs.stringify(payload), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    .then(({ data }) => data)
}
