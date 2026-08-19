import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function LocationMap({ markers = [], zoom = 10, height = '300px' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const validMarkers = markers.filter((m) => m.lat != null && m.lng != null);

  useEffect(() => {
    if (validMarkers.length === 0 || !mapContainerRef.current) return;

    // Clean up previous instance if it exists (handles StrictMode double-mount)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize map
    const center = [validMarkers[0].lat, validMarkers[0].lng];
    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
    });
    
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    validMarkers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng]).addTo(map);
      if (m.label) {
        marker.bindPopup(m.label);
      }
    });

    // Fix grey tiles issue
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [JSON.stringify(validMarkers), zoom]);

  if (validMarkers.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-gray-50 rounded-md text-sm text-gray-400">
        No location data available
      </div>
    );
  }

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height, width: '100%', borderRadius: '0.5rem', zIndex: 10 }} 
    />
  );
}