import { createContext, useContext } from 'react'
import { Alert, RequestStatus, User } from '../../types'

export type UserContextData = {
  user?: User
  requestStatus: RequestStatus
  setUser: (user: User) => void
  reset: () => void
  appendUserAlerts: (alert: Alert) => void
  reload: () => void
}

export const UserContext = createContext({} as UserContextData)

export const useUserContext = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('must use context within valid provider')
  }

  return context
}
