import { createContext, useContext } from 'react'
import { Country, Gage, GageSource, RequestStatus } from '../../../types'
import { GageSearchParams } from '../../../controllers'

export const DEFAULT_GAGE_SEARCH_PARAMS: GageSearchParams = {
  state: 'AL',
  offset: 0,
  limit: 25,
  country: Country.US,
  searchTerm: '',
  source: GageSource.USGS,
}

export const DEFAULT_PAGINATION: TablePagination = {
  total: 0,
  offset: 0,
  limit: 0,
}

export type TablePagination = {
  total: number
  offset: number
  limit: number
}

type GageContextData = {
  gages: Gage[]
  searchParams: GageSearchParams
  setSearchParams: (params: GageSearchParams) => void
  requestStatus: RequestStatus
  reset: () => void
  pagination: TablePagination
}

export const GageContext = createContext({} as GageContextData)

export const useGagesContext = (): GageContextData => useContext(GageContext)
