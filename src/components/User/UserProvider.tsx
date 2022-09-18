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

  const loaded = user && user.id !== '00000000-0000-0000-0000-000000000000'

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

  const removeUserAlert = (id: string) => {
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

  const removeUserGage = (id: string) => {
    if (!user) return
    const userGages = [...user.gages].filter((g) => g.id !== id)

    setUser({ ...user, gages: userGages })
  }

  return (
    <UserContext.Provider
      value={{
        removeUserGage,
        appendUserAlerts,
        canBookmarkGages: (loaded && user && user.gages.length < 15) || false,
        reload,
        removeUserAlert,
        requestStatus,
        reset: () => setUser(undefined),
        setUser: (user: User) => setUser(user),
        updateUserAlerts,
        user: loaded ? user : undefined,
        isAdmin,
        canContribute,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
