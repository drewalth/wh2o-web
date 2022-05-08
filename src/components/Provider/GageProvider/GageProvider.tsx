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
import { notification } from 'antd'
import { useTranslation } from 'react-i18next'

type GageProviderProps = {
  children: ReactNode
}

export const GageProvider = ({ children }: GageProviderProps): JSX.Element => {
  const { t } = useTranslation()
  const [gages, setGages] = useState<Gage[]>([])
  const [gagesRefreshing, setGagesRefreshing] = useState(false)
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
    let isRefreshing = false
    try {
      if (!gagesRefreshing) {
        setRequestStatus('loading')
      }
      // @todo debounce
      const { gages, total, refreshing } = await gageSearch(
        searchParams,
        pagination,
      )
      setGages(gages)
      // pagination kinda busted...

      setPagination({ ...pagination, total: getTotal(total) })
      setRequestStatus('success')
      setGagesRefreshing(refreshing)
      isRefreshing = refreshing
    } catch (e) {
      setRequestStatus('failure')
      notification.error({
        message: t('failedToLoadGages'),
        placement: 'bottomRight',
      })
    } finally {
      if (isRefreshing) {
        await new Promise((resolve) => setTimeout(resolve, 5000 * 2))
        await loadGages()
      }
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
        gagesRefreshing,
      }}
    >
      {children}
    </GageContext.Provider>
  )
}
