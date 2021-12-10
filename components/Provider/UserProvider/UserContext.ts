import { createContext, useContext } from 'react'
import { RequestStatus, User } from '../../../types'

export type UserContextData = {
  user: User | undefined
  loadUser: (id: number) => Promise<void>
  requestStatus: RequestStatus
  isPublisher: boolean
  resetUser: () => void
  setUserData: (user:User) => void
}

export const UserContext = createContext({} as UserContextData)

export const useUserContext = () => useContext(UserContext)
