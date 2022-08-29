import React from 'react'
import { Helmet } from 'react-helmet'

export type SEOProps = {
  description?: string
  title?: string
  link?: string
}

const DEFAULT_TITLE = 'wh2o'
const DEFAULT_DESCRIPTION =
  'Historical river flow data, forecasting, and custom reporting for rivers in the United States, Canada, Chile and New Zealand.'
const DEFAULT_LINK = 'https://wh2o.io'

export const SEO = ({ title, description, link }: SEOProps) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title || DEFAULT_TITLE}</title>
      <link rel="canonical" href={link || DEFAULT_LINK} />
      <meta name="description" content={description || DEFAULT_DESCRIPTION} />
    </Helmet>
  )
}
