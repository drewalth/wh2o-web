import { useEffect, useState } from 'react'
import mapboxgl, { Map } from 'mapbox-gl'

interface GageMapProps {
  mapboxToken: string
  latitude: number
  longitude: number
  height?: number
}

export const GageMap = (props: GageMapProps) => {
  const { mapboxToken, latitude, longitude } = props
  const [map, setMap] = useState<Map>()
  const [mapStyleLoaded, setMapStyleLoaded] = useState(false)

  const mapStyle = {
    height: props.height || 350,
    width: '100%',
    position: 'relative',
  }

  const emptyStyle = {
    ...mapStyle,
    backgroundColor: '#5D6D7E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  useEffect(() => {
    if (!mapboxToken || !!map) return
    mapboxgl.accessToken = mapboxToken
    const mapInstance = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [longitude, latitude], // starting position [lng, lat]
      zoom: 12, // starting zoom
    })

    setMap(mapInstance)
  }, [])

  // @ts-ignore
  return <div id="map" style={mapStyle} />
}
