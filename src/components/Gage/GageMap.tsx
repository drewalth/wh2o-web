import { MapContainer, TileLayer, Tooltip, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import allSites from '../Common/all_sites_filtered_on_mean.json'

export type GageMapProps = {
  siteIds?: string[]
  onSelectGauge?: (siteNo: string, siteNm: string) => void
  style?: Record<string, string>
}

export const GageMap = ({ siteIds, onSelectGauge, style }: GageMapProps) => {
  const sites =
    siteIds !== undefined
      ? allSites.filter((s) => siteIds.includes(s.site_no))
      : allSites

  return (
    <div style={style}>
      <MapContainer
        center={[38.2, -97.0]}
        zoom={4}
        scrollWheelZoom={false}
        className={'leaflet-container'}
        style={{ height: 360 }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {sites.map((data) => (
            <Marker
              position={[data.dec_lat_va, data.dec_long_va]}
              key={data.site_no}
              eventHandlers={{
                click: () => {
                  onSelectGauge?.(data.site_no, data.station_nm)
                },
              }}
            >
              <Popup>Graph generated for gauge: {data.station_nm}</Popup>
              <Tooltip>Description: {data.station_nm}</Tooltip>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
