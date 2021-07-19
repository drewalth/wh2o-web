import { User } from './index'

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
