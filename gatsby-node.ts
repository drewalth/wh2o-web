const axios = require('axios')
const path = require('path')
const baseURL = process.env.BASE_API_URL || 'http://localhost:3000'

const http = axios.create({
  baseURL
})
import { Gage, GageSource } from './src/types'

export type GagePageData = Pick<
  Gage,
  'id' | 'state' | 'name' | 'siteId' | 'source' | 'country' | 'latitude' | 'longitude'
>

const loadGages = async (): Promise<Gage[]> => {
  return http
    .get('/gatsby-gages')
    .then((res) => res.data)
    .catch((e) => {
      console.error(e)
      return []
    })
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /apexcharts/,
            use: loaders.null()
          }
        ]
      }
    })
  }
}

exports.createPages = async function ({ graphql, actions }) {
  const handleCreate = (gage: any) => {
    actions.createPage({
      path: `/gages/${gage.state.toLocaleLowerCase()}/${gage.id}`,
      component: path.resolve(`./src/components/gage/GageDetail.tsx`),
      defer: false,
      context: {
        gage
      }
    })
  }

  if (process.env.NODE_ENV === 'development') {
    const mockGages: GagePageData[] = [...Array(10)].map((el, i) => ({
      id: i + 1,
      state: 'co',
      name: `gage-name-${i + 1}`,
      siteId: `gage-siteId-${i + 1}`,
      source: GageSource.USGS,
      country: 'us'
    }))

    mockGages.forEach((gage) => handleCreate(gage))
  } else {
    const gages = await loadGages()
    gages.forEach((gage) => handleCreate(gage))
  }
}
