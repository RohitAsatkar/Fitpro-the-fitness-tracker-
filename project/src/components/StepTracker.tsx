import React, { useEffect, useState } from 'react';
import { Map, Navigation2, Route, Target, Settings, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import StepMap from './StepMap';
import StepStats from './StepStats';
import { useStepTracking } from '../hooks/useStepTracking';
import type { StepData, TrackingPreferences } from '../types';

export default function StepTracker() {
  const [showMap, setShowMap] = useState(false);
  const [permissionsDenied, setPermissionsDenied] = useState(false);
  const [deniedPermissions, setDeniedPermissions] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<TrackingPreferences>({
    units: 'metric',
    dailyGoal: 10000,
    showRoute: true,
  });

  const {
    steps,
    distance,
    calories,
    currentPath,
    isTracking,
    startTracking,
    stopTracking,
    dailyStats,
    weeklyStats,
    monthlyStats,
  } = useStepTracking(preferences);

  useEffect(() => {
    // Request necessary permissions when component mounts
    const requestPermissions = async () => {
      try {
        const permissionsToRequest = [
          { name: 'geolocation' as PermissionName, description: 'track your route on the map' },
          { name: 'accelerometer' as PermissionName, description: 'count your steps accurately' }
        ];

        const deniedPerms: string[] = [];
        
        for (const perm of permissionsToRequest) {
          try {
            const result = await navigator.permissions.query({ name: perm.name });
            if (result.state === 'denied') {
              deniedPerms.push(perm.description);
            }
          } catch (error) {
            console.warn(`${perm.name} permission not available:`, error);
            // Don't mark as denied if the permission API isn't available
          }
        }

        if (deniedPerms.length > 0) {
          setPermissionsDenied(true);
          setDeniedPermissions(deniedPerms);
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
        setPermissionsDenied(true);
      }
    };

    requestPermissions();
  }, []);

  if (permissionsDenied) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center text-red-600">
            <AlertCircle className="mr-2 h-6 w-6" />
            <h2 className="text-xl font-semibold">Permission Required</h2>
          </div>
          
          <div className="mb-6 text-gray-600">
            <p className="mb-4">
              To provide you with the best step tracking experience, we need permission to:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              {deniedPermissions.map((perm, index) => (
                <li key={index}>{perm}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-blue-700">
            <h3 className="mb-2 font-medium">How to enable permissions:</h3>
            <ol className="ml-6 list-decimal space-y-2">
              <li>Click the lock/info icon in your browser's address bar</li>
              <li>Find the permissions you want to enable</li>
              <li>Change the setting to "Allow"</li>
              <li>Refresh this page</li>
            </ol>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Main Stats Panel */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Today's Steps</h3>
              <Target className="h-5 w-5 text-blue-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{steps.toLocaleString()}</p>
            <div className="mt-2 text-sm text-gray-600">
              Goal: {preferences.dailyGoal.toLocaleString()}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Distance</h3>
              <Route className="h-5 w-5 text-green-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {preferences.units === 'metric'
                ? `${(distance / 1000).toFixed(2)} km`
                : `${(distance / 1609.34).toFixed(2)} mi`}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Calories</h3>
              <Navigation2 className="h-5 w-5 text-orange-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {Math.round(calories).toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Current Time</h3>
              <Map className="h-5 w-5 text-purple-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {format(new Date(), 'HH:mm')}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {format(new Date(), 'EEEE, MMM d')}
            </p>
          </div>
        </div>

        {/* Map and Stats Toggle */}
        <div className="mb-6 flex items-center space-x-4">
          <button
            onClick={() => setShowMap(false)}
            className={`rounded-md px-4 py-2 ${
              !showMap
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`rounded-md px-4 py-2 ${
              showMap
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Map View
          </button>
        </div>

        {/* Tracking Controls */}
        <div className="mb-6">
          <button
            onClick={isTracking ? stopTracking : startTracking}
            className={`rounded-md px-6 py-2 ${
              isTracking
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          {showMap ? (
            <StepMap
              currentPath={currentPath}
              preferences={preferences}
              onPreferencesChange={setPreferences}
            />
          ) : (
            <StepStats
              dailyStats={dailyStats}
              weeklyStats={weeklyStats}
              monthlyStats={monthlyStats}
              preferences={preferences}
              onPreferencesChange={setPreferences}
            />
          )}
        </div>
      </div>
    </div>
  );
}