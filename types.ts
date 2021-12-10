export type RequestStatus = 'loading' | 'success' | 'failure'

export enum user_role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
  EDITOR = 'EDITOR',
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserLoginResponse {
  access_token: string
  user: User
}

export const UserModel: CreateUserDto = {
  firstName: '',
  lastName: '',
  email: '',
  telephone: '',
  timezone: 'America/Denver',
  password: '',
}

export interface CreateUserDto {
  firstName?: string
  lastName?: string
  telephone?: string
  password: string
  email: string
  timezone: string
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  email: string
  timezone: string
  telephone?: string
}

export interface User {
  verified: boolean
  media: Media[]
  role: user_role
  id: number
  firstName?: string
  lastName?: string
  password?: string
  telephone?: string
  email: string
  timezone: string
  gages: Gage[]
  posts: Post[]
  reaches: River[]
  notifications: Notification[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Timezone {
  label: string
  tzCode: string
  name: string
  utc: string
}

export enum SubscriptionPrice {
  premium = 'price_1JG3kxDhtVB2UpDdlP4JnWeC',
  deluxe = 'price_1JG3lLDhtVB2UpDd8sTsSDjP',
}

export enum ClassRating {
  'none' = 'none',
  I = 'I',
  III = 'III',
  IV = 'IV',
  V = 'V',
}

export interface River {
  gages?: Gage[]
  posts?: Post[]
  id: number
  name: string
  section?: string
  class: ClassRating
  minimumGradient?: number
  maximumGradient?: number
  averageGradient?: number
  features: Feature[]
  media?: Media[]
  users?: User[]
  length?: number
  description?: string
  updatedAt: Date
  createdAt: Date
}

export const RiverModel: River = {
  id: 0,
  name: '',
  section: '',
  class: ClassRating.none,
  minimumGradient: 0,
  maximumGradient: 0,
  averageGradient: 0,
  length: 0,
  description: '',
  features: [],
  posts: [],
  media: [],
  gages: [],
  users: [],
  updatedAt: new Date(),
  createdAt: new Date(),
}

export enum postType {
  ALERT = 'ALERT',
  INFO = 'INFO',
  NEWS = 'NEWS',
  COMMENT = 'COMMENT',
}

export interface Post {
  published: boolean
  id: number
  userId: number
  reachId: number
  private: boolean
  content: string
  createdAt: Date
  updatedAt?: Date
  postType: postType
  title: string
  subtitle: string
}

export const PostModel: Post = {
  id: 0,
  userId: 0,
  reachId: 0,
  private: true,
  published: false,
  content: '',
  createdAt: new Date(),
  postType: postType.INFO,
  title: '',
  subtitle: '',
}

export enum NotificationInterval {
  IMMEDIATE = 'IMMEDIATE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum NotificationCriteria {
  ABOVE = 'ABOVE',
  BELOW = 'BELOW',
  BETWEEN = 'BETWEEN',
  DISABLED = 'DISABLED',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}

export interface CreateNotificationDto {
  criteria: NotificationCriteria
  gageDisabled: boolean
  metric: GageReadingMetric
  channel: NotificationChannel
  interval: NotificationInterval
  alertTime?: Date
  name?: string
  userId: number
  gageId: number
  primary: boolean
  minimum?: number
  maximum?: number
}

export interface UpdateNotificationDto {
  id: number
  criteria: NotificationCriteria
  gageDisabled: boolean
  active: boolean // user paused
  metric: GageReadingMetric
  channel: NotificationChannel
  interval: NotificationInterval
  createdAt: Date
  updatedAt: Date
  alertTime: Date
  name?: string
  userId: number
  primary: boolean
  minimum?: number
  maximum?: number
  count: number
}

export interface Notification {
  id: number
  criteria: NotificationCriteria
  gageDisabled: boolean
  active: boolean // user paused
  metric: GageReadingMetric
  channel: NotificationChannel
  interval: NotificationInterval
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  alertTime: Date
  name?: string
  userId: number
  gages: Gage[]
  primary: boolean
  minimum?: number
  maximum?: number
  count: number
}

export enum mediaEntityType {
  photo = 'photo',
  video = 'video',
  vimeo = 'vimeo',
  youtube = 'youtube',
}

export interface CreateMediaDto {
  title?: string
  fileName?: string
  url?: string
  mediaType: mediaEntityType
  userId: number
  reachId: number
}

export interface Media {
  title?: string
  fileName?: string
  url?: string
  id: number
  mediaType: mediaEntityType
  rivers?: number
  user: number
}

export const MediaModel: CreateMediaDto = {
  title: '',
  fileName: '',
  url: '',
  mediaType: mediaEntityType.photo,
  userId: 0,
  reachId: 0,
}

export interface RiversMedia {
  riverId: number
  mediaId: number
  primary: boolean
  key?: string
}

export interface UserRiver {
  userId: number
  riverId: number
  primary: boolean
  createdAt: Date
  updatedAt?: Date
}

export interface Country {
  id: number
  name: string
  code: string
}

export interface ReachSearchParams {
  name: string
  section?: string
  country: string
}

export enum GageReadingMetric {
  CFS = 'CFS',
  FT = 'FT',
  CMS = 'CMS',
  TEMP = 'TEMP',
}

export interface GageReading {
  reading: string
  createdAt: Date
  id: number
  value: number
  metric: string
  difference?: number
  temperatureCelcius?: number
  temperatureFahrenheit: number
}

export enum GageSource {
  USGS = 'usgs',
  CANADA = 'canada',
  VANCOUVER_METRO = 'vancouver_metro',
  VISUAL = 'visual',
}

export interface FlowRange {}

export interface ReachGages {
  reachId: number
  gageId: number
  primary: boolean
}

export interface Gage {
  metric?: GageReadingMetric
  id: number
  name: string
  latestReading?: string
  description?: string
  siteId: string
  state?: string
  latitude?: number
  longitude?: number
  source: GageSource
  createdAt: Date
  updatedAt?: Date
  riverId?: number
  readings?: GageReading[]
  flowRanges?: FlowRange[]
  users: User[]
  ReachGages?: ReachGages
}

export interface CreateGageDto {
  name: string
  description?: string
  siteId: string
  state?: string
  latitude?: number
  longitude?: number
  source: GageSource
  riverId?: number
}

export interface Feature {
  id?: number
  name: string
  description: string
  distance: number
  reachId: number
  class: ClassRating
  latitude: number | null
  longitude: number | null
  isRapid: boolean
  isHazard: boolean
  isPortage: boolean
  isPlayspot: boolean
  isAccessPoint: boolean
  isPutIn: boolean
  isTakeOut: boolean
  isCampsite: boolean
  isRangerStation: boolean
  isWaterfall: boolean
  isScenicOverlook: boolean
  createdAt: Date
  updatedAt: Date
}

export const FeatureModel: Feature = {
  name: '',
  description: '',
  distance: 0,
  reachId: 0,
  class: ClassRating.none,
  latitude: 0,
  longitude: 0,
  isRapid: true,
  isHazard: false,
  isPortage: false,
  isPlayspot: false,
  isAccessPoint: false,
  isPutIn: false,
  isTakeOut: false,
  isCampsite: false,
  isRangerStation: false,
  isWaterfall: false,
  isScenicOverlook: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}
