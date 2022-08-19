import { ReactNode, useLayoutEffect, useState } from 'react'
import { reachSearch } from '../../../controllers'
import { notify } from '../../../lib'
import {
  Country,
  Reach,
  ReachSearchParams,
  RequestStatus,
} from '../../../types'
import { ReachContext } from './ReachContext'

export type ReachProviderProps = {
  children: ReactNode
}

export const DEFAULT_PAGINATION = {
  page: 1,
  page_size: 25,
}

export const DEFAULT_SEARCH_PARAMS: ReachSearchParams = {
  country: Country.US,
  state: 'AK',
  ...DEFAULT_PAGINATION,
}

export const ReachProvider = ({ children }: ReachProviderProps) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading')
  const [searchParams, setSearchParams] = useState<ReachSearchParams>(
    DEFAULT_SEARCH_PARAMS,
  )
  const [reaches, setReaches] = useState<Reach[]>([])

  const reset = () => setSearchParams(DEFAULT_SEARCH_PARAMS)

  const load = async (params: ReachSearchParams) => {
    try {
      setRequestStatus('loading')
      setSearchParams(params)
      const { reaches } = await reachSearch(params)
      setReaches(reaches)
      setRequestStatus('success')
    } catch (e) {
      console.error(e)
      notify.error('failed to load reaches')
    }
  }

  useLayoutEffect(() => {
    ;(async () => {
      await load(searchParams)
    })()
  }, [searchParams])

  return (
    <ReachContext.Provider
      value={{
        reaches,
        requestStatus,
        searchParams,
        reset,
        load,
        setSearchParams,
      }}
    >
      {children}
    </ReachContext.Provider>
  )
}
