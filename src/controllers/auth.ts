import { checkResponse, http } from '../lib'
import { Endpoints } from '../enums'

export const authLogin = async (payload) => {
  return http
    .post(Endpoints.AUTH + '/login', {
      body: JSON.stringify(payload),
    })
    .then((res) => checkResponse(res))
}
