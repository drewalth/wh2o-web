import React, { ReactNode, useEffect, useState } from 'react'
import {
  DEFAULT_GAGE_SEARCH_PARAMS,
  DEFAULT_PAGINATION,
  GageContext,
  TablePagination,
} from './GageContext'
import { Gage, RequestStatus } from '../../../types'
import { gageSearch, GageSearchParams } from '../../../controllers'
import { notification } from 'antd'

type GageProviderProps = {
  children: ReactNode
}

export const GageProvider = ({ children }: GageProviderProps): JSX.Element => {
  const [gages, setGages] = useState<Gage[]>([])
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading')
  const [pagination, setPagination] =
    useState<TablePagination>(DEFAULT_PAGINATION)
  const [searchParams, setSearchParams] = useState<GageSearchParams>(
    DEFAULT_GAGE_SEARCH_PARAMS,
  )

  const reset = () => {
    setGages([])
    setSearchParams(DEFAULT_GAGE_SEARCH_PARAMS)
    setPagination(DEFAULT_PAGINATION)
  }

  useEffect(() => {
    ;(async () => {
      try {
        setRequestStatus('loading')
        const { gages, total } = await gageSearch(searchParams)
        setGages(gages)
        // pagination kinda busted...
        setPagination({ ...pagination, total })
        setRequestStatus('success')
      } catch (e) {
        setRequestStatus('failure')
        notification.error({
          message: 'Failed to load gages',
          placement: 'bottomRight',
        })
      }
    })()
  }, [searchParams])

  return (
    <GageContext.Provider
      value={{
        gages,
        requestStatus,
        setSearchParams,
        searchParams,
        pagination,
        reset,
      }}
    >
      {children}
    </GageContext.Provider>
  )
}
