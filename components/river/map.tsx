import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl, { Map } from 'mapbox-gl'
import { useEffect, useState } from 'react'

/**
 * river preview map vs map panel
 *
 * use props to toggle detail.
 *
 */

interface MapProps {
  mapboxToken: string
  height?: number
}

export const RiverMap = (props: MapProps) => {
  mapboxgl.accessToken = props.mapboxToken

  const [map, setMap] = useState<Map>()

  const mapStyle = {
    height: props.height || 350,
    width: '100%',
    position: 'relative',
  }

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    })

    setMap(map)
  }, [])

  // @ts-ignore
  return <div id="map" style={mapStyle} />
}
