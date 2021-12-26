export type RequestStatus = 'loading' | 'success' | 'failure'

export enum user_role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
  EDITOR = 'EDITOR',
}

export type UserLogin = {
  email: string
  password: string
}

export type UserLoginResponse = {
  access_token: string
  user: User
}

export type User = {
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
  createdAt: Date
  updatedAt: Date
}

export type CreateUserDto = Pick<
  User,
  'firstName' | 'lastName' | 'telephone' | 'password' | 'email' | 'timezone'
>

export type UpdateUserDto = {
  firstName?: string
  lastName?: string
  email: string
  timezone: string
  telephone?: string
}

export type Timezone = {
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

export type River = {
  gages: Gage[]
  posts: Post[]
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

export enum PostType {
  ALERT = 'ALERT',
  INFO = 'INFO',
  NEWS = 'NEWS',
  COMMENT = 'COMMENT',
}

export type Post = {
  published: boolean
  id: number
  userId: number
  reachId: number
  private: boolean
  content: string
  createdAt: Date
  updatedAt: Date
  postType: PostType
  title: string
  subtitle: string
}

export type CreatePostDto = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>

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

export type Notification = {
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
  gageId: number
  gages: Gage[]
  primary: boolean
  minimum?: number
  maximum?: number
  count: number
}

export type CreateNotificationDto = Omit<
  Notification,
  'createdAt' | 'deletedAt' | 'updatedAt' | 'id' | 'gages' | 'active' | 'count'
>

export type UpdateNotificationDto = Omit<
  Notification,
  'createdAt' | 'deletedAt' | 'updatedAt'
>

export enum mediaEntityType {
  photo = 'photo',
  video = 'video',
  vimeo = 'vimeo',
  youtube = 'youtube',
}

export type Media = {
  title?: string
  fileName?: string
  url?: string
  id: number
  mediaType: mediaEntityType
  rivers?: number
  user: number
  createdAt: Date
  updatedAt: Date
}

export type CreateMediaDto = { reachId: number; userId: number } & Omit<
  Media,
  'id' | 'createdAt' | 'updatedAt'
>

export type RiversMedia = {
  riverId: number
  mediaId: number
  primary: boolean
  key?: string
}

export type UserRiver = {
  userId: number
  riverId: number
  primary: boolean
  createdAt: Date
  updatedAt?: Date
}

export type Country = {
  id: number
  name: string
  code: string
}

export type ReachSearchParams = {
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

export type GageReading = {
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

export type FlowRange = {}

export type ReachGages = {
  reachId: number
  gageId: number
  primary: boolean
}

export type Gage = {
  metric: GageReadingMetric
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
  updatedAt: Date
  riverId?: number
  readings?: GageReading[]
  flowRanges?: FlowRange[]
  users: User[]
  ReachGages?: ReachGages
}

export type CreateGageDto = {
  name: string
  description?: string
  siteId: string
  state?: string
  latitude?: number
  longitude?: number
  source: GageSource
  riverId?: number
  metric: GageReadingMetric
}

export type Feature = {
  id: number
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

export type CreateFeatureDto = Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>
