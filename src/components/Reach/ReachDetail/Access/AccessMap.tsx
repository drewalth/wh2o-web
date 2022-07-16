import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN

export type AccessMapProps = {
  latitude?: number
  longitude?: number
}

export const AccessMap = ({ latitude, longitude }: AccessMapProps) => {
  const { t } = useTranslation()
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapboxToken || !mapRef.current || !longitude || !latitude) return

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [longitude, latitude],
      zoom: 12,
    })

    return () => {
      map.remove()
    }
  }, [])

  if (!latitude || !longitude) {
    return (
      <div
        style={{
          height: '40vh',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ccc',
        }}
      >
        <Typography.Text>{t('noLocationDataAvailable')}</Typography.Text>
      </div>
    )
  }
  return (
    <div
      style={{
        height: '40vh',
        width: '100%',
      }}
      ref={mapRef}
      id={'YOUR_CONTAINER_ELEMENT_ID'}
      className={'map'}
    />
  )
}
