// src/components/LocationMap.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Vite doesn't bundle Leaflet's default marker icons correctly out of the
// box — this explicit fix is required or markers silently fail to render.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// markers: [{ lat, lng, label }] — one marker for the public showcase page
// (Section 5), two markers (declared vs. agent's actual GPS) for the
// verification comparison view (Section 13) — same component, either use case.
export default function LocationMap({ markers = [], zoom = 10, height = '300px' }) {
  const validMarkers = markers.filter((m) => m.lat != null && m.lng != null);

  if (validMarkers.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-muted rounded-md text-sm text-muted-foreground">
        No location data available
      </div>
    );
  }

  const center = [validMarkers[0].lat, validMarkers[0].lng];

  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: '100%', borderRadius: '0.5rem' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validMarkers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]}>
          {m.label && <Popup>{m.label}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
}