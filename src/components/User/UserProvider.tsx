import { ReactNode, useEffect, useState } from 'react'
import { UserContext } from './UserContext'
import { Alert, RequestStatus, User, UserRole } from '../../types'
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

  const removeUserAlert = (id: number) => {
    if (!user) return

    const alertsCopy = [...user.alerts].filter((a) => a.id !== id)

    setUser({ ...user, alerts: alertsCopy })
  }

  const updateUserAlerts = (alert: Alert) => {
    if (!user) return

    const alertsCopy = [...user.alerts]
    const index = alertsCopy.findIndex((a) => a.id === alert.id)

    if (index !== -1) {
      alertsCopy[index] = alert
      setUser({ ...user, alerts: alertsCopy })
    }
  }

  const canContribute = !!(user && user.role !== UserRole.GENERAL)
  const isAdmin = !!(
    user &&
    (user.role === UserRole.SUPERADMIN || user.role === UserRole.ADMIN)
  )

  return (
    <UserContext.Provider
      value={{
        appendUserAlerts,
        canBookmarkGages: (user && user.gages.length < 15) || false,
        reload,
        removeUserAlert,
        requestStatus,
        reset: () => setUser(undefined),
        setUser: (user: User) => setUser(user),
        updateUserAlerts,
        user,
        isAdmin,
        canContribute,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
