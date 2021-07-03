export interface IFlowRange {}

export enum GageSource {
  USGS = 'usgs',
  CANADA = 'canada',
  VANCOUVER_METRO = 'vancouver_metro',
  VISUAL = 'visual',
}

export interface IGageReading {
  reading: string
  createdAt: Date
  id: number
  value: number
  metric: string
  difference?: number
  temperatureCelcius?: number
  temperatureFahrenheit: number
}

export interface ReachGages {
  reachId: number
  gageId: number
  primary: boolean
}

export interface IGage {
  id?: number
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
  readings?: IGageReading[]
  flowRanges?: IFlowRange[]
  users: IUser[]
  ReachGages?: ReachGages
}

export const GageModel: IGage = {
  name: '',
  latestReading: '',
  siteId: '',
  state: '',
  source: GageSource.USGS,
  createdAt: new Date(),
  users: [],
}

export enum ClassRating {
  'none' = 'none',
  I = 'I',
  III = 'III',
  IV = 'IV',
  V = 'V',
}

export interface IRiver {
  gages?: IGage[]
  posts?: IPost[]
  id: number
  name: string
  section?: string
  class: ClassRating
  minimumGradient?: number
  maximumGradient?: number
  averageGradient?: number
  features: IFeature[]
  media?: IMedia[]
  users?: IUser[]
  length?: number
  description?: string
  updatedAt: Date
  createdAt: Date
}

export const RiverModel: IRiver = {
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

export enum mediaEntityType {
  photo = 'photo',
  video = 'video',
  vimeo = 'vimeo',
  youtube = 'youtube',
}

export interface IMedia {
  title?: string
  fileName?: string
  url?: string
  id?: number
  entityType: mediaEntityType
  rivers?: number
  user: number
}

export const MediaModel: IMedia = {
  title: '',
  fileName: '',
  url: '',
  entityType: mediaEntityType.photo,
  user: 0,
}

export enum user_role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
  EDITOR = 'EDITOR',
}

export interface IUser {
  media: IMedia[]
  role: user_role
  id?: number
  firstName?: string
  lastName?: string
  password?: string
  email: string
  gages: IGage[]
  posts: IPost[]
  reaches: IRiver[]
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserLogin {
  email: string
  password: string
}

export interface IUserLoginResponse {
  access_token: string
  user: IUser
}

export const UserModel: IUser = {
  firstName: '',
  lastName: '',
  email: '',
  gages: [],
  reaches: [],
  media: [],
  posts: [],
  role: user_role.USER,
}

export enum communicationMethod {
  EMAIL = 'email',
  SMS = 'sms',
}

export interface GageNotify {
  userId: number
  gageId: number
  primary: boolean
  createdAt: Date
  minimum?: number
  maximum?: number
  gageUnresponsive: boolean
}

export const GageNotifyModel = {
  userId: 0,
  gageId: 0,
  createdAt: new Date(),
  minimum: undefined,
  maximum: undefined,
  primary: false,
  gageUnresponsive: false,
}

export interface IRiversMedia {
  riverId: number
  mediaId: number
  primary: boolean
  key?: string
}

export interface IFeature {
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
  isPutin: boolean
  isTakeout: boolean
  isCampsite: boolean
  isRangerStation: boolean
  isWaterfall: boolean
  isScenicOverlook: boolean
  createdAt: Date
  updatedAt: Date
}

export const FeatureModel: IFeature = {
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
  isPutin: false,
  isTakeout: false,
  isCampsite: false,
  isRangerStation: false,
  isWaterfall: false,
  isScenicOverlook: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export enum postType {
  ALERT = 'ALERT',
  INFO = 'INFO',
  NEWS = 'NEWS',
  COMMENT = 'COMMENT',
}

export interface IPost {
  id: number
  userId: number
  reachId: number
  private: boolean
  content: string
  createdAt: Date
  updatedAt?: Date
  postType: postType
  title: string
}

export const PostModel: IPost = {
  id: 0,
  userId: 0,
  reachId: 0,
  private: true,
  content: '',
  createdAt: new Date(),
  postType: postType.INFO,
  title: '',
}

export interface UserRiver {
  userId: number
  riverId: number
  primary: boolean
  createdAt: Date
  updatedAt?: Date
}

export interface ICountry {
  id: number
  name: string
  code: string
}

export interface ReachSearchParams {
  name: string
  section?: string
  country: string
}
