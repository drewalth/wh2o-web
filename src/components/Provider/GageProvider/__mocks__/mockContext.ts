import {
  DEFAULT_GAGE_SEARCH_PARAMS,
  DEFAULT_PAGINATION,
  GageContextData,
} from '../GageContext'
import { Country, Gage, GageMetric, GageSource } from '../../../../types'

export const mockGages: Gage[] = [...Array(100)].map((_, idx) => {
  const id = idx + 1
  return {
    id: id.toString(),
    name: `mock-gage-${id}`,
    country: Country.US,
    source: GageSource.USGS,
    createdAt: new Date(),
    state: 'CO',
    siteId: id.toString(),
    description: `mock-gage-description-${id}`,
    primary: false,
    reading: Math.floor(Math.random() * 10),
    metric: GageMetric.CFS,
    disabled: false,
    lastFetch: new Date(),
    delta: Math.floor(Math.random() * 10),
  }
})

export const mockContext: GageContextData = {
  gages: mockGages,
  searchParams: DEFAULT_GAGE_SEARCH_PARAMS,
  setSearchParams: jest.fn(),
  requestStatus: 'success',
  reset: jest.fn(),
  fetchGages: jest.fn(),
  resetPagination: jest.fn(),
  pagination: DEFAULT_PAGINATION,
  setPagination: jest.fn(),
}
