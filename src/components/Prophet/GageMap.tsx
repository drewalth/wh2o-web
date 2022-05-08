import { MapContainer, TileLayer, Tooltip, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import gaugeData from './all_sites_filtered_on_mean.json'
import { useTranslation } from 'react-i18next'

export type GageMapProps = {
  onSelectGauge: (siteNo: string, siteNm: string) => void
}

export const GageMap = ({ onSelectGauge }: GageMapProps) => {
  const { t } = useTranslation()
  return (
    <MapContainer
      center={[36.705, -97.0]}
      zoom={5}
      scrollWheelZoom={false}
      className={'leaflet-container'}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {gaugeData.map((gauge) => (
          <Marker
            position={[gauge.dec_lat_va, gauge.dec_long_va]}
            key={gauge.site_no}
            eventHandlers={{
              click: () => {
                onSelectGauge(gauge.site_no, gauge.station_nm)
              },
            }}
          >
            <Popup>
              {t('graphGeneratedForGage')}: {gauge.station_nm}
            </Popup>
            <Tooltip>
              {t('description')}: {gauge.station_nm}
            </Tooltip>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}
