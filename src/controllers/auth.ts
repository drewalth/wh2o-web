import { checkResponse, http } from '../lib'
import { Endpoints } from '../enums'
import { AuthLoginResponse } from '../types'

export const authLogin = async (payload): Promise<AuthLoginResponse> => {
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
