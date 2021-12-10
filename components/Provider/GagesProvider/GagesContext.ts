import { Gage, RequestStatus } from 'types'
import { createContext, useContext } from 'react'

export type GagesContextData = {
  gages: Gage[]
  requestStatus: RequestStatus
  loadGages: () => Promise<void>
}

export const GagesContext = createContext({} as GagesContextData)

export const useGagesContext = () => useContext(GagesContext)
