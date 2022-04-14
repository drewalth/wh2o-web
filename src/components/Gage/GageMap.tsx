import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './gage-map.css'

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN

mapboxgl.accessToken = mapboxToken

export type GageMapProps = {
  latitude: number
  longitude: number
}

export const GageMap = ({ latitude, longitude }: GageMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapboxToken || !mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [longitude, latitude],
      zoom: 12,
    })
    const el = document.createElement('div')
    el.className = 'map-marker'
    document.body.appendChild(el)
    new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map)
  }, [])

  return (
    <div
      style={{
        height: 'calc(100vh - 72px)',
        position: 'absolute',
        zIndex: 1,
        width: '100%',
      }}
      ref={mapRef}
      id={'YOUR_CONTAINER_ELEMENT_ID'}
      className={'map'}
    />
  )
}
