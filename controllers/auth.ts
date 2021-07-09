import { http } from 'lib'
import { User, UserLogin, UserLoginResponse } from '../interfaces'

export const authRegister = (data: User): Promise<User> => {
  return http.post(`/users`, data).then((res) => res.data)
}

export const authLogin = (data: UserLogin): Promise<UserLoginResponse> => {
  return http.post('/auth/login', data).then((res) => res.data)
}

export const authRefresh = async () => {
  return http.post('/auth/refresh', {}).then((res) => res.data)
}
