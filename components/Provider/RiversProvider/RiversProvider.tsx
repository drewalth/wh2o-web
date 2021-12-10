import { RiversContext } from './RiversContext'
import { ReactNode, useState } from 'react'
import { ReachSearchParams, RequestStatus, River } from '../../../types'
import { getRivers } from '../../../controllers'

type RiversProviderProps = {
  children: ReactNode
}

export const RiversProvider = ({ children }: RiversProviderProps) => {
  const [rivers, setRivers] = useState<River[]>([])
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('success')

  const loadRivers = async (params: ReachSearchParams) => {
    try {
      setRequestStatus('loading')
      const rivers = await getRivers(params)
      setRivers(rivers)
      setRequestStatus('success')
    } catch (e) {
      console.error(e)
      setRequestStatus('failure')
    }
  }

  return (
    <RiversContext.Provider
      value={{
        rivers,
        requestStatus,
        loadRivers,
      }}
    >
      {children}
    </RiversContext.Provider>
  )
}
