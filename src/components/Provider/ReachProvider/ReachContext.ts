import { Reach, RequestStatus, ReachSearchParams } from '../../../types'
import { createContext, useContext } from 'react'

export type ReachContextData = {
  reaches: Reach[]
  requestStatus: RequestStatus
  searchParams: ReachSearchParams
  setSearchParams: (params: ReachSearchParams) => void
  load: (params: ReachSearchParams) => Promise<void>
  reset: () => void
}

export const ReachContext = createContext({} as ReachContextData)

export const useReachContext = () => {
  const context = useContext(ReachContext)

  if (context === undefined) {
    throw new Error('must use reach context within valid provider')
  }

  return context
}
