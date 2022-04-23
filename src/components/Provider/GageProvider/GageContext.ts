import { createContext, useContext } from 'react'
import {
  Country,
  Gage,
  GageSource,
  RequestStatus,
  TablePagination,
  GageSearchParams,
} from '../../../types'

export const DEFAULT_PAGINATION: TablePagination = {
  total: 0,
  page: 1,
  page_size: 10,
}

export const DEFAULT_GAGE_SEARCH_PARAMS: GageSearchParams = {
  state: 'BC',
  country: Country.CA,
  searchTerm: '',
  source: GageSource.ENVIRONMENT_CANADA,
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
}

export const GageContext = createContext({} as GageContextData)

export const useGagesContext = (): GageContextData => useContext(GageContext)
