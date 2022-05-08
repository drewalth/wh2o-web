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

  const reload = async () => {
    try {
      setRequestStatus('loading')
      const result = await whoAmI()
      setUser(result)
      setRequestStatus('success')
    } catch (e) {
      setRequestStatus('failure')
    }
  }

  useEffect(() => {
    ;(async () => {
      await reload()
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
        reload,
        appendUserAlerts,
        setUser: (user: User) => setUser(user),
        requestStatus,
        reset: () => setUser(undefined),
        canBookmarkGages: (user && user.gages.length < 15) || false,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
