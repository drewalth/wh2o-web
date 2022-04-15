import { useUserContext } from '../components/User/UserContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

/**
 * useLocalNavGuard
 *
 * check to see if user is logged in, if not redirect.
 */
export const useLocalNavGuard = (redirectPath = '/auth/unauthorized') => {
  const { user, requestStatus } = useUserContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && requestStatus !== 'loading') {
      navigate(redirectPath, { replace: true })
    }
    if (requestStatus === 'failure') {
      navigate('/five-hundred', { replace: true })
    }
  }, [requestStatus])
}
