import { createContext, useContext } from 'react'
import { ReachSearchParams, RequestStatus, River } from '../../../types'

export type RiversContextData = {
  rivers: River[]
  requestStatus: RequestStatus
  loadRivers: (params: ReachSearchParams) => Promise<void>
}

export const RiversContext = createContext({} as RiversContextData)

export const useRiversContext = () => useContext(RiversContext)
