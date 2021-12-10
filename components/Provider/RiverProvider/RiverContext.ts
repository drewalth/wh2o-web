import { createContext, useContext } from 'react'
import { RequestStatus, River } from '../../../types'

export type RiverContextData = {
  loadRiver: (id: number) => Promise<void>
  river: River | undefined
  requestStatus: RequestStatus
}

export const RiverContext = createContext({} as RiverContextData)

export const useRiverContext = () => useContext(RiverContext)
