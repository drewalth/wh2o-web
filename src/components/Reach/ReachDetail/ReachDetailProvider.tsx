import { ReactNode, useState, useLayoutEffect } from 'react'
import { getReach } from '../../../controllers'
import { notify } from '../../../lib'
import { Reach, RequestStatus } from '../../../types'
import { ReachDetailContext } from './ReachDetailContext'

export type ReachDetailProviderProps = {
  children: ReactNode
  reachId?: string
}

export const ReachDetailProvider = ({
  children,
  reachId,
}: ReachDetailProviderProps) => {
  const [reach, setReach] = useState<Reach>()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading')

  const load = async () => {
    try {
      if (!reachId) return

      setRequestStatus('loading')

      const result = await getReach(reachId)

      setReach(result)

      setRequestStatus('success')
    } catch (e) {
      setRequestStatus('failure')
      console.error(e)
      notify.error('failed to load reach')
    }
  }

  useLayoutEffect(() => {
    ;(async () => {
      await load()
    })()
  }, [])

  return (
    <ReachDetailContext.Provider value={{ reach, requestStatus, load }}>
      {children}
    </ReachDetailContext.Provider>
  )
}
