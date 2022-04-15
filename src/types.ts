/* eslint-disable no-unused-vars */
import { AlertCriteria, AlertInterval, AlertChannel } from './enums'

export enum UserRole {
  GENERAL = 'GENERAL',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export type User = {
  id: number
  email: string
  name: string
  telephone: string
  timezone: string
  role: UserRole
  verified: boolean
  gages: Gage[]
  alerts: Alert[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}

export type UserUpdateDto = Omit<
  User,
  | 'updatedAt'
  | 'deletedAt'
  | 'gages'
  | 'role'
  | 'alerts'
  | 'verified'
  | 'createdAt'
>

export type UserCreateDto = Omit<UserUpdateDto, 'id'> & {
  password: string
}

export type Alert = {
  id: number
  name: string
  active: boolean
  criteria: AlertCriteria
  interval: AlertInterval
  channel: AlertChannel
  metric: GageMetric
  minimum?: number
  maximum?: number
  value: number
  gageId: number
  userId: number
  notifyTime?: string
  lastSent?: Date
  updatedAt?: Date
  createdAt: Date
  gage: Gage
}

export type CreateAlertDto = Omit<
  Alert,
  'createdAt' | 'updatedAt' | 'id' | 'gage' | 'lastSent'
>

export type UpdateAlertDto = Omit<
  Alert,
  'createdAt' | 'nextSend' | 'id' | 'gage'
>

export enum GageSource {
  USGS = 'USGS',
  ENVIRONMENT_CANADA = 'ENVIRONMENT_CANADA',
}

export enum Country {
  US = 'US',
  CA = 'CA',
}

export type GageSearchParams = Omit<TablePagination, 'total'> & {
  searchTerm?: string
  state: string
  country: string
  source: GageSource
}

export type TablePagination = {
  total: number
  offset: number
  limit: number
}

export enum CanadianProvinces {
  AB = 'AB',
  BC = 'BC',
  MB = 'MB',
  NB = 'NB',
  NL = 'NL',
  NS = 'NS',
  NT = 'NT',
  NU = 'NU',
  ON = 'ON',
  PE = 'PE',
  QC = 'QC',
  SK = 'SK',
  YT = 'YT',
}

export type GageReading = {
  id: number
  siteId: string
  value: number
  metric: GageMetric
  gageID: number
  gageName: string
  createdAt?: Date
  updatedAt?: Date
}

export type Gage = {
  id: number
  name: string
  source: GageSource
  siteId: string
  metric: GageMetric
  reading: number
  state: string
  country: string
  latitude?: number
  longitude?: number
  readings?: GageReading[]
  delta: number
  lastFetch: Date
  createdAt: Date
  updatedAt?: Date
}

export type UpdateGageDto = Omit<
  Gage,
  'ID' | 'Alerts' | 'UpdatedAt' | 'LastFetch' | 'CreatedAt'
>

export interface CreateGageDto {
  Name: string
  SiteId: string
  Metric: GageMetric
}

export interface GageUpdateDTO {
  latitude: number
  longitude: number
  siteId: string
  gageId: number
  metric: GageMetric
  name: string
  reading: number
  tempC: number
  tempF: number
}

export type RequestStatus = 'loading' | 'success' | 'failure'

export type GageEntry = {
  gageName: string
  siteId: string
}

export type USGSStateGageHelper = {
  state: string
  gages: GageEntry[]
}

export type usState = {
  name: string
  abbreviation: string
}

export enum GageMetric {
  CFS = 'CFS',
  FT = 'FT',
  TEMP = 'TEMP',
  CMS = 'CMS',
  M = 'M',
}
