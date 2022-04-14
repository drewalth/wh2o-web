import { ReactNode, useEffect, useState } from 'react'
import { UserContext } from './UserContext'
import { RequestStatus, UserConfig } from '../../types'
import { whoAmI } from '../../controllers'

type UserProviderProps = {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserConfig>()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading')

  useEffect(() => {
    ;(async () => {
      try {
        setRequestStatus('loading')
        const result = await whoAmI()
        setUser(result)
        setRequestStatus('success')
      } catch (e) {
        setRequestStatus('failure')
      }
    })()
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: (user: UserConfig) => {
          setUser(user)
        },
        requestStatus,
        reset: () => {
          setUser(undefined)
        },
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
