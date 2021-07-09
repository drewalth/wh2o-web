export * from './notification'
export * from "./user"
export * from "./gage"
export * from "./media"
export * from "./post"
export * from "./river"
export * from "./feature"






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
