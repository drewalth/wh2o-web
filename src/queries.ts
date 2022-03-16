import { gql } from '@apollo/client'

export const GAGES_SEARCH = gql(`
query GagesSearch($gageSearchInput: GageSearchInput!) {
  gagesSearch(gageSearchInput: $gageSearchInput) {
    gages {
    id
    name
    latestReading
    state
    source
    metric
    lastFetch
    updatedAt
    }
    total
    offset
    limit
  }
}
`)

export const GAGE = gql(`
query Gage($id: Int!) {
  gage(id:$id) {
    id
    name
    source
    siteId
    state
    metric
    latitude
    longitude
    latestReading
    delta
    country
    lastFetch
    updatedAt
    readings {
      value
      metric
      createdAt
    }
  }
}
`)
