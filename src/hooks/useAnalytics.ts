import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

export const useAnalytics = () => {
  const { pathname } = useLocation()

  ReactGA.send({ hitType: 'pageview', page: pathname })
}
