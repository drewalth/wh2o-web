import React, { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mapboxgl from '!mapbox-gl'

mapboxgl.accessToken = process.env.GATSBY_MAPBOX_TOKEN || ''

export type GageMapProps = {
  latitude: number
  longitude: number
}

export const GageMap = ({ latitude, longitude }: GageMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  // const [lng, setLng] = useState(-70.9)
  // const [lat, setLat] = useState(42.35)
  const [zoom, setZoom] = useState(12)

  useEffect(() => {
    if (!mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [longitude, latitude],
      zoom: zoom
    })
    const el = document.createElement('div')
    el.className = 'marker'
    document.body.appendChild(el)
    new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map)
  }, [])

  return (
    <div
      style={{ height: 'calc(100vh - 72px)', position: 'absolute', zIndex: 1 }}
      ref={mapRef}
      id={'YOUR_CONTAINER_ELEMENT_ID'}
      className={'map'}
    />
  )
}
