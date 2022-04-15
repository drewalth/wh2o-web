import {
  Alert,
  CreateAlertDto,
  UpdateAlertDto,
  User,
  UserUpdateDto,
} from '../types'
import { http } from '../lib'
import * as qs from 'qs'
import { Endpoints } from '../enums'

export const whoAmI = async (): Promise<User> => {
  return http.get('/user/whoami').then(({ data }) => data)
}

export const removeUserGage = async (gageId: number, userId: number) => {
  return http
    .post(
      '/user/remove-gage',
      qs.stringify({
        gageId,
        userId,
      }),
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      },
    )
    .then(({ data }) => data)
}

export const addUserGage = async (gageId: number, userId: number) => {
  return http
    .post(
      '/user/add-gage',
      qs.stringify({
        gageId,
        userId,
      }),
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      },
    )
    .then(({ data }) => data)
}

export const updateUser = async (updateUserDto: UserUpdateDto) => {
  return http
    .put(`/user/${updateUserDto.id}`, qs.stringify(updateUserDto), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    .then(({ data }) => data)
}

export const getAlerts = async () => {
  return http.get(Endpoints.ALERT).then((res) => res.data)
}

export const updateAlert = async (updateAlertDto: UpdateAlertDto) => {
  return http
    .put(Endpoints.ALERT, qs.stringify(updateAlertDto), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    .then(({ data }) => data)
}

export const createAlert = async (
  createAlertDto: CreateAlertDto,
): Promise<Alert> => {
  return http
    .post(Endpoints.ALERT, qs.stringify(createAlertDto), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    .then(({ data }) => data)
}

export const deleteAlert = async (alertId: number) => {
  return http.delete(Endpoints.ALERT + `/${alertId}`).then((res) => res.data)
}

export const deleteUser = async (id: number) => {
  return http.delete(`/user/${id}`).then(({ data }) => data)
}
