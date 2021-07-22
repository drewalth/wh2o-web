import { ClassRating } from './index'

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
