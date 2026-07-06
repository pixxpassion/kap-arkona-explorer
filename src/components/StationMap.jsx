// src/components/StationMap.jsx
// Bindet dieselbe lokale Kartenquelle ein, die auch kap-arkona.de/wegweiser
// nutzt (map.kap-arkona.de), statt auf eine externe Karte zu verlinken.
import { MapContainer, TileLayer, CircleMarker, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TILE_URL = 'https://map.kap-arkona.de/tiles/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende';

const targetIcon = new L.DivIcon({
  className: 'poi-marker',
  html: '📍',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

export default function StationMap({ target, title, userLocation }) {
  return (
    <div className="station-map-wrapper">
      <MapContainer
        center={[target.latitude, target.longitude]}
        zoom={17}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={19} />
        <Marker position={[target.latitude, target.longitude]} icon={targetIcon}>
          <Popup>{title}</Popup>
        </Marker>
        {userLocation && (
          <CircleMarker
            center={[userLocation.latitude, userLocation.longitude]}
            radius={8}
            pathOptions={{ color: '#fff', weight: 2, fillColor: '#1a5fa8', fillOpacity: 1 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
