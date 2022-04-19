import { checkResponse, http } from '../lib'
import { Endpoints } from '../enums'

export const authLogin = async (payload) => {
  return http
    .post(Endpoints.AUTH + '/login', {
      body: JSON.stringify(payload),
    })
    .then((res) => checkResponse(res))
}

export const authVerify = async (token: string, email: string) => {
  return http
    .post(Endpoints.AUTH + '/verify', {
      body: JSON.stringify({ token, email }),
    })
    .then((res) => checkResponse(res))
}
