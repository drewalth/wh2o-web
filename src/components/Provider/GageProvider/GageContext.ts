import { createContext, useContext } from 'react'
import {
  Country,
  Gage,
  GageSearchParams,
  GageSource,
  RequestStatus,
  TablePagination,
} from '../../../types'

export const DEFAULT_PAGINATION: TablePagination = {
  page: 1,
  page_size: 10,
}

export const DEFAULT_GAGE_SEARCH_PARAMS: GageSearchParams = {
  state: 'AL',
  country: Country.US,
  name: '',
  source: GageSource.USGS,
  ...DEFAULT_PAGINATION,
}

type GageContextData = {
  gages: Gage[]
  searchParams: GageSearchParams
  setSearchParams: (params: GageSearchParams) => void
  requestStatus: RequestStatus
  reset: () => void
  pagination: TablePagination
  setPagination: (pagination: TablePagination) => void
  resetPagination: () => void
  fetchGages: (params: GageSearchParams) => Promise<void>
}

export const GageContext = createContext({} as GageContextData)

export const useGagesContext = (): GageContextData => useContext(GageContext)
