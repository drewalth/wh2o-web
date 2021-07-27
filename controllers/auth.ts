import { http } from 'lib'
import {
  CreateUserDto,
  User,
  UserLogin,
  UserLoginResponse,
} from '../interfaces'

export const authRegister = (data: CreateUserDto): Promise<User> => {
  return http.post(`/users`, data).then((res) => res.data)
}

export const authLogin = (data: UserLogin): Promise<UserLoginResponse> => {
  return http.post('/auth/login', data).then((res) => res.data)
}

export const authRefresh = async () => {
  return http.post('/auth/refresh', {}).then((res) => res.data)
}

export const resendConfirmationLink = async (userId: number): Promise<void> => {
  return http
    .post(`/auth/resend-confirmation?id=${userId}`)
    .then((res) => res.data)
}
