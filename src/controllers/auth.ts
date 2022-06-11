import { checkResponse, http } from '../lib'
import { Endpoints } from '../enums'
import { AuthLoginResponse, AuthResetDto } from '../types'

export const authLogin = async (payload): Promise<AuthLoginResponse> => {
  return http
    .post(Endpoints.AUTH + '/login', {
      body: JSON.stringify(payload),
    })
    .then((res) => checkResponse(res))
}

export const authVerify = async (
  token: string,
  email: string,
): Promise<AuthLoginResponse> => {
  return http
    .post(Endpoints.AUTH + '/verify', {
      body: JSON.stringify({ token, email }),
    })
    .then((res) => checkResponse(res))
}

export const authForgot = async (email: string) => {
  return http
    .post(Endpoints.AUTH + '/forgot', {
      body: JSON.stringify({ email }),
    })
    .then((res) => checkResponse(res))
}

export const authReset = (dto: AuthResetDto) => {
  return http
    .post(Endpoints.AUTH + '/reset', {
      body: JSON.stringify(dto),
    })
    .then((res) => checkResponse(res))
}
