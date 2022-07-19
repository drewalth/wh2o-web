import { createContext, useContext } from 'react'
import { Alert, RequestStatus, User } from '../../types'

export type UserContextData = {
  appendUserAlerts: (alert: Alert) => void
  canBookmarkGages: boolean
  reload: () => Promise<void>
  removeUserAlert: (id: number) => void
  requestStatus: RequestStatus
  reset: () => void
  setUser: (user: User) => void
  updateUserAlerts: (alert: Alert) => void
  user?: User
  canContribute: boolean
  isAdmin: boolean
}

export const UserContext = createContext({} as UserContextData)

export const useUserContext = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('must use context within valid provider')
  }

  return context
}
