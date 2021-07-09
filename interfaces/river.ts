import {Feature, Gage, Media, Post, User} from "./index";

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
