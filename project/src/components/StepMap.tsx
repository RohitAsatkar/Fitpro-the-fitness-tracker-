import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import { Settings } from 'lucide-react';
import type { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TrackingPreferences } from '../types';

interface StepMapProps {
  currentPath: LatLng[];
  preferences: TrackingPreferences;
  onPreferencesChange: (prefs: TrackingPreferences) => void;
}

// Component to handle auto-centering the map
function AutoCenter({ position }: { position: LatLng }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position);
  }, [map, position]);

  return null;
}

export default function StepMap({ currentPath, preferences, onPreferencesChange }: StepMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const defaultCenter: LatLng = currentPath.length > 0
    ? currentPath[currentPath.length - 1]
    : [51.505, -0.09]; // Default to London if no path

  // Handle offline support
  useEffect(() => {
    const handleOffline = () => {
      // Store current map tiles in cache
      if ('caches' in window) {
        caches.open('map-tiles').then(cache => {
          // Cache current viewport tiles
          const bounds = mapRef.current?.getBounds();
          if (bounds) {
            const zoom = mapRef.current?.getZoom() || 15;
            const north = bounds.getNorth();
            const south = bounds.getSouth();
            const east = bounds.getEast();
            const west = bounds.getWest();

            // Calculate tile coordinates and cache them
            for (let x = west; x <= east; x += 0.01) {
              for (let y = south; y <= north; y += 0.01) {
                const url = `https://{s}.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
                cache.add(url);
              }
            }
          }
        });
      }
    };

    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, []);

  return (
    <div className="relative h-[600px] w-full">
      <MapContainer
        center={defaultCenter}
        zoom={15}
        className="h-full w-full rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {preferences.showRoute && currentPath.length > 0 && (
          <>
            <Polyline
              positions={currentPath}
              color="#3B82F6"
              weight={3}
              opacity={0.7}
            />
            <Marker position={currentPath[currentPath.length - 1]} />
            <AutoCenter position={currentPath[currentPath.length - 1]} />
          </>
        )}
      </MapContainer>

      {/* Map Settings */}
      <div className="absolute right-4 top-4 z-[1000] rounded-lg bg-white p-4 shadow-lg">
        <div className="mb-4 flex items-center">
          <Settings className="mr-2 h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">Map Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.showRoute}
                onChange={(e) =>
                  onPreferencesChange({
                    ...preferences,
                    showRoute: e.target.checked,
                  })
                }
                className="mr-2 rounded border-gray-300"
              />
              Show Route
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Units
            </label>
            <select
              value={preferences.units}
              onChange={(e) =>
                onPreferencesChange({
                  ...preferences,
                  units: e.target.value as 'metric' | 'imperial',
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="metric">Metric (km)</option>
              <option value="imperial">Imperial (mi)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}