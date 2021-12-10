import { RiverContext } from './RiverContext'
import { ReactNode, useState } from 'react'
import { RequestStatus, River } from '../../../types'
import { getRiver } from '../../../controllers'

type RiverProviderProps = {
  children: ReactNode
}

export const RiverProvider = ({ children }: RiverProviderProps) => {
  const [river, setRiver] = useState<River>()

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('success')

  const loadRiver = async (id: number) => {
    try {
      setRequestStatus('loading')
      const river = await getRiver(id)
      setRiver(river)
      setRequestStatus('success')
    } catch (e) {
      console.error(e)
      setRequestStatus('failure')
    }
  }

  return (
    <RiverContext.Provider value={{ river, loadRiver, requestStatus }}>
      {children}
    </RiverContext.Provider>
  )
}
