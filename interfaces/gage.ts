import { User} from "./index";

export enum ReadingMetric {
    CFS = 'CFS',
    FT = 'FT',
    CMS = 'CMS',
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

export const GageModel: Gage = {
    id: 0,
    name: '',
    latestReading: '',
    siteId: '',
    state: '',
    source: GageSource.USGS,
    createdAt: new Date(),
    users: [],
}
