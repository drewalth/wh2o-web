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

type GageProviderProps = {
  children: ReactNode
}

export const GageProvider = ({ children }: GageProviderProps): JSX.Element => {
  const [gages, setGages] = useState<Gage[]>([])
  const [refreshing, setRefreshing] = useState(false)
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

  const loadGages = async () => {
    // let isRefreshing = false
    try {
      // if (!gagesRefreshing) {
      //
      // }
      setRequestStatus('loading')
      // @todo debounce
      const { gages, total, refreshing } = await gageSearch(
        searchParams,
        pagination,
      )
      setGages(gages)
      // pagination kinda busted...

      setPagination({ ...pagination, total: getTotal(total) })
      setRequestStatus('success')
      // setGagesRefreshing(refreshing)
      // isRefreshing = refreshing

      setRefreshing(refreshing)

      // if (refreshing) {
      //   notification.info({
      //     icon: <SyncOutlined spin />,
      //     message: 'Refreshing gages',
      //     duration: 5,
      //   })
      // }
    } catch (e) {
      setRequestStatus('failure')
      console.error(e)
    } finally {
      // if (isRefreshing) {
      //   await new Promise((resolve) => setTimeout(resolve, 5000))
      //   await loadGages()
      // }
    }
  }

  useEffect(() => {
    ;(async () => {
      await loadGages()
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
        resetPagination,
        reset,
        setPagination,
        refreshing,
      }}
    >
      {children}
    </GageContext.Provider>
  )
}
