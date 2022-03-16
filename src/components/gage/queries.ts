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
query($id: Int!) {
  gage(id:$id) {
    id
    name
    source
    siteId
    state
    latitude
    longitude
    metric
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
