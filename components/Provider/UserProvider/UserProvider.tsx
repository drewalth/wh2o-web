import { UserContext } from './UserContext'
import { ReactNode, useEffect, useState } from 'react'
import { RequestStatus, User, user_role } from '../../../types'
import { authRefresh, getUser } from '../../../controllers'

type UserProviderProps = {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('success')

  const refreshUser = async () => {
    try {
      setRequestStatus('loading')
      const user = await authRefresh()
      setRequestStatus('success')
      setUser(user)
    } catch (e) {
      console.error(e)
      setRequestStatus('failure')
    }
  }

  const loadUser = async (id: number) => {
    try {
      setRequestStatus('loading')
      const user = await getUser(id)
      setRequestStatus('success')
      setUser(user)
    } catch (e) {
      console.error(e)
      setRequestStatus('failure')
    }
  }

  const resetUser = () => {
    setUser(undefined)
  }

  const setUserData = (user:User) => {
    setUser(user)
  }

  useEffect(() => {
    ;(async () => {
      await refreshUser()
    })()
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        requestStatus,
        loadUser,
        isPublisher: user ? user.role === user_role.ADMIN : false,
        resetUser,
        setUserData
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
