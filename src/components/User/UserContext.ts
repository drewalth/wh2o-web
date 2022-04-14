import { createContext, useContext } from 'react'
import { RequestStatus, UserConfig } from '../../types'

export type UserContextData = {
  user?: UserConfig
  requestStatus: RequestStatus
  setUser: (user: UserConfig) => void
  reset: () => void
}

export const UserContext = createContext({} as UserContextData)

export const useUserContext = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('must use context within valid provider')
  }

  return context
}
