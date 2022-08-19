import React, { ReactNode, useEffect, useState } from 'react'
import {
  DEFAULT_GAGE_SEARCH_PARAMS,
  DEFAULT_PAGINATION,
  GageContext,
} from './GageContext'
import {
  Gage,
  GageSearchParams,
  RequestStatus,
  TablePagination,
} from '../../../types'
import { gageSearch } from '../../../controllers'
import { notify } from '../../../lib'

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

  const resetPagination = () => {
    setPagination({ ...pagination, page: 1 })
  }

  const getTotal = (total: number) => {
    if (pagination.total !== 0 && total !== pagination.total && total !== 0) {
      return total
    }

    if (total === 0) {
      return pagination.total
    }

    if (pagination.total !== 0) {
      return pagination.total
    }
    return total
  }

  const fetchGages = async (params: GageSearchParams) => {
    try {
      setRequestStatus('loading')
      const { gages, total } = await gageSearch(params)
      setGages(gages)
      setPagination({
        page: params.page,
        page_size: params.page_size,
        total: getTotal(total),
      })
      setRequestStatus('success')
    } catch (e) {
      setRequestStatus('failure')
      console.error(e)
      notify.error('Failed to load gages')
    }
  }

  useEffect(() => {
    ;(async () => {
      await fetchGages(searchParams)
    })()
  }, [])

  return (
    <GageContext.Provider
      value={{
        gages,
        requestStatus,
        setSearchParams,
        searchParams,
        pagination,
        resetPagination,
        reset,
        setPagination,
        fetchGages,
      }}
    >
      {children}
    </GageContext.Provider>
  )
}
