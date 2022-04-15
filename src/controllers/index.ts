import { http } from '../lib'
import * as qs from 'qs'
import {
  CreateAlertDto,
  CreateGageDto,
  UserConfigDto,
  UpdateGageDto,
  UpdateAlertDto,
  ExportData,
  UserConfig,
  Gage,
  GageSearchParams,
} from '../types'
import { Endpoints } from '../enums'

export const getGage = async (state: string, id: number): Promise<Gage> => {
  return http.get(`/gage/${state}/${id}`).then((res) => res.data)
}

export const updateGage = async (updateGageDto: UpdateGageDto) => {
  return http
    .put(Endpoints.GAGE, qs.stringify(updateGageDto), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    .then(({ data }) => data)
}

export const getSettings = async () => {
  return http.get(Endpoints.SETTINGS + `/1`).then((res) => res.data)
}

export const updateSettings = async (updateSettings: UserConfigDto) => {
  return http
    .put(Endpoints.SETTINGS, qs.stringify(updateSettings), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    .then((res) => res.data)
}

export const createGage = async (dto: CreateGageDto) => {
  return http
    .post(Endpoints.GAGE, qs.stringify(dto), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    .then((res) => res.data)
}

export const deleteGage = async (id: number) => {
  return http.delete(Endpoints.GAGE + `/${id}`).then((res) => res.data)
}

export const getGageSources = async (state: string) => {
  return http.get(Endpoints.GAGE_SOURCES + `/${state}`).then((res) => res.data)
}

export const gageSearch = async (
  input: GageSearchParams,
): Promise<{ gages: Gage[]; total: number }> => {
  const params = new URLSearchParams()

  for (const val in input) {
    params.append(val, input[val])
  }

  return http.get(`/gage/search?${params}`).then(({ data }) => data)
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

export const createAlert = async (createAlertDto: CreateAlertDto) => {
  return http
    .post(Endpoints.ALERT, qs.stringify(createAlertDto), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    .then((res) => res.data)
}

export const deleteAlert = async (alertId: number) => {
  return http.delete(Endpoints.ALERT + `/${alertId}`).then((res) => res.data)
}

export const exportData = async (): Promise<{
  FilePath: string
  Filename: string
}> => {
  return http.get(Endpoints.EXPORT).then(({ data }) => data)
}

// @todo doesnt work
export const importData = async (data: ExportData) => {
  return http
    .post(Endpoints.IMPORT, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data)
}

export const authLogin = async (payload) => {
  return http
    .post(Endpoints.AUTH + '/login', qs.stringify(payload), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    .then(({ data }) => data)
}

export const whoAmI = async (): Promise<UserConfig> => {
  return http.get('/user/whoami').then(({ data }) => data)
}
