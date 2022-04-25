/* eslint-disable no-unused-vars */
import { AlertChannel, AlertCriteria, AlertInterval } from './enums'

export enum ContactType {
  MISSING_GAGE = 'MISSING_GAGE',
  MISC = 'MISC',
  BUG_REPORT = 'BUG_REPORT',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
}

export type Contact = {
  id: number
  title: string
  description?: string
  siteId?: string
  country: Country
  state?: string
  source?: GageSource
  email: string
  userId?: number
  type: ContactType
  createdAt: Date
  updatedAt: Date
}

export type CreateContactDto = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>

export type AuthLoginResponse = {
  token: string
  user: {
    id: number
    email: string
    name: string
    role: UserRole
  }
}

export type ForeCastDataPoint = {
  forecast: any
  index: string
  lower_error_bound: any
  past_value: number
  upper_error_bound: any
}

export type RunnablePercentage = {
  index: string
  percent: number
}

export type DailyAverage = {
  index: string
  average: number
  middleFifty: number[]
}

export type FlowRange = {
  id: number
  name: string
  description: string
  minimum: number
  maximum: number
  metric: GageMetric
  gageId: number
  createdAt: Date
  updatedAt: Date
}

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

export type GageSearchParams = {
  searchTerm?: string
  state: string
  country: string
  source: GageSource
}

export type TablePagination = {
  page: number
  page_size: number
  total: number
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
  description: string
  source: GageSource
  siteId: string
  metric: GageMetric
  reading: number
  state: string
  disabled: boolean
  country: string
  latitude?: number
  longitude?: number
  readings?: GageReading[]
  delta: number
  flowRanges?: FlowRange[]
  lastFetch: Date
  createdAt: Date
  updatedAt?: Date
}

export type UpdateGageDto = Omit<
  Gage,
  'ID' | 'Alerts' | 'UpdatedAt' | 'LastFetch' | 'CreatedAt'
>

export type CreateGageDto = Omit<
  Gage,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'readings'
  | 'reading'
  | 'lastFetch'
  | 'delta'
>

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
