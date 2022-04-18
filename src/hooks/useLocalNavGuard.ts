import { useUserContext } from '../components/User/UserContext'
import { useNavigate } from 'react-router-dom'
import { useLayoutEffect } from 'react'

export type UseLocalNavGuardOptions = {
  redirectPath?: string
  checkIsAdmin?: boolean
}

const defaultOptions: UseLocalNavGuardOptions = {
  redirectPath: '/auth/unauthorized',
  checkIsAdmin: false,
}
/**
 * useLocalNavGuard
 *
 * check to see if user is logged in, if not redirect.
 */
export const useLocalNavGuard = (input?: UseLocalNavGuardOptions) => {
  const options = { ...defaultOptions, ...input }
  const { redirectPath, checkIsAdmin } = options
  const { user, requestStatus } = useUserContext()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (!user && requestStatus !== 'loading' && !!redirectPath) {
      navigate(redirectPath, { replace: true })
    }
    if (requestStatus === 'failure' && !user) {
      navigate('/five-hundred', { replace: true })
    }

    if (user && requestStatus === 'success' && checkIsAdmin && !!redirectPath) {
      if (!['ADMIN', 'SUPERADMIN'].includes(user.role)) {
        navigate(redirectPath, { replace: true })
      }
    }
  }, [requestStatus])
}
