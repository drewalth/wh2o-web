import { createContext, useContext } from 'react'
import { Reach, RequestStatus } from '../../../types'

export type ReachDetailContextData = {
  reach?: Reach
  requestStatus: RequestStatus
  load: () => Promise<void>
}

export const ReachDetailContext = createContext({} as ReachDetailContextData)

export const useReachDetailContext = () => {
  const ctx = useContext(ReachDetailContext)

  if (ctx === undefined) {
    throw new Error('must use inside valid provider')
  }

  return ctx
}
