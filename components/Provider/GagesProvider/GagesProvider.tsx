import { ReactNode, useState } from 'react'
import { GagesContext } from './GagesContext'
import { Gage, RequestStatus } from '../../../types'
import { getGages } from '../../../controllers'
type GagesProviderProps = {
  children: ReactNode
}

export const GagesProvider = ({ children }: GagesProviderProps) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('success')
  const [gages, setGages] = useState<Gage[]>([])
  const loadGages = async () => {
    try {
      setRequestStatus('loading')
      const gages = await getGages()
      setGages(gages)
      setRequestStatus('success')
    } catch (e) {
      setRequestStatus('failure')
    }
  }
  return (
    <GagesContext.Provider value={{ requestStatus, gages, loadGages }}>
      {children}
    </GagesContext.Provider>
  )
}
