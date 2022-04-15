import { ReactNode, useEffect, useState } from 'react'
import { UserContext } from './UserContext'
import { Alert, RequestStatus, User } from '../../types'
import { whoAmI } from '../../controllers'

type UserProviderProps = {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>()
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

  const appendUserAlerts = (alert: Alert) => {
    if (!user) return

    setUser({
      ...user,
      alerts: [...user.alerts, alert],
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        appendUserAlerts,
        setUser: (user: User) => {
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
