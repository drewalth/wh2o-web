import { http } from 'lib'
import { IUser, IUserLogin, IUserLoginResponse } from '../interfaces'

export const authRegister = (data: IUser): Promise<IUser> => {
  return http.post(`/users`, data).then((res) => res.data)
}

export const authLogin = (data: IUserLogin): Promise<IUserLoginResponse> => {
  return http.post('/auth/login', data).then((res) => res.data)
}

export const authRefresh = async () => {
  return http.post('/auth/refresh', {}).then((res) => res.data)
}
