import {
  Alert,
  AuthLoginResponse,
  CreateAlertDto,
  UpdateAlertDto,
  User,
  UserCreateDto,
  UserUpdateDto,
} from '../types'
import { checkResponse, http } from '../lib'
import { Endpoints } from '../enums'

export const whoAmI = async (): Promise<User> => {
  return http.get('/user/whoami').then((res) => checkResponse(res))
}

export const removeUserGage = async (gageId: number, userId: number) => {
  return http
    .post('/user/remove-gage', {
      body: JSON.stringify({
        gageId,
        userId,
      }),
    })
    .then((res) => checkResponse(res))
}

export const addUserGage = async (gageId: number, userId: number) => {
  return http
    .post('/user/add-gage', {
      body: JSON.stringify({
        gageId,
        userId,
      }),
    })
    .then((res) => checkResponse(res))
}

export const updateUser = async (updateUserDto: UserUpdateDto) => {
  return http
    .put(`/user/${updateUserDto.id}`, { body: JSON.stringify(updateUserDto) })
    .then((res) => checkResponse(res))
}

export const getAlerts = async () => {
  return http.get(Endpoints.ALERT).then((res) => checkResponse(res))
}

export const updateAlert = async (updateAlertDto: UpdateAlertDto) => {
  return http
    .put(Endpoints.ALERT, { body: JSON.stringify(updateAlertDto) })
    .then((res) => checkResponse(res))
}

export const createAlert = async (
  createAlertDto: CreateAlertDto,
): Promise<Alert> => {
  return http
    .post(Endpoints.ALERT, { body: JSON.stringify(createAlertDto) })
    .then((res) => checkResponse(res))
}

export const deleteAlert = async (alertId: number) => {
  return http
    .delete(Endpoints.ALERT + `/${alertId}`)
    .then((res) => checkResponse(res))
}

export const deleteUser = async (id: number) => {
  return http.delete(`/user/${id}`).then((res) => checkResponse(res))
}

export const createUser = async (
  createUserDto: UserCreateDto,
): Promise<AuthLoginResponse> => {
  return http
    .post('/user/new', { body: JSON.stringify(createUserDto) })
    .then((res) => checkResponse(res))
}
