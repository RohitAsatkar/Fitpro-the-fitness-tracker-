import { useState, useEffect, useCallback, useRef } from 'react';
import type { LatLng } from 'leaflet';
import type { StepData, TrackingPreferences } from '../types';

const STEP_THRESHOLD = 1.2; // Acceleration threshold for step detection
const MIN_STEP_DELAY = 250; // Minimum time (ms) between steps
const LOCATION_UPDATE_INTERVAL = 2000; // Location update frequency (ms)
const BATCH_SIZE = 10; // Number of steps to batch before saving

export function useStepTracking(preferences: TrackingPreferences) {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [currentPath, setCurrentPath] = useState<LatLng[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [dailyStats, setDailyStats] = useState<StepData[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<StepData[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<StepData[]>([]);
  
  // Refs for sensor data handling
  const lastStepTime = useRef(0);
  const accelerometer = useRef<Accelerometer | null>(null);
  const gyroscope = useRef<Gyroscope | null>(null);
  const locationWatchId = useRef<number | null>(null);
  const stepBuffer = useRef<StepData[]>([]);
  const lastLocation = useRef<GeolocationPosition | null>(null);

  // Initialize sensors
  const initializeSensors = useCallback(async () => {
    try {
      // Request permissions
      const permissions = await Promise.all([
        navigator.permissions.query({ name: 'accelerometer' as PermissionName }),
        navigator.permissions.query({ name: 'gyroscope' as PermissionName }),
        navigator.permissions.query({ name: 'geolocation' as PermissionName })
      ]);

      if (permissions.some(p => p.state === 'denied')) {
        throw new Error('Required sensor permissions denied');
      }

      // Initialize accelerometer
      accelerometer.current = new Accelerometer({ frequency: 60 });
      accelerometer.current.addEventListener('reading', handleAccelerometerReading);
      accelerometer.current.start();

      // Initialize gyroscope
      gyroscope.current = new Gyroscope({ frequency: 60 });
      gyroscope.current.addEventListener('reading', handleGyroscopeReading);
      gyroscope.current.start();

    } catch (error) {
      console.error('Error initializing sensors:', error);
      // Fallback to basic step counting if sensors are unavailable
      initializeFallbackTracking();
    }
  }, []);

  // Handle accelerometer readings
  const handleAccelerometerReading = useCallback(() => {
    if (!accelerometer.current) return;

    const { x, y, z } = accelerometer.current;
    const acceleration = Math.sqrt(x * x + y * y + z * z);
    const now = Date.now();

    // Detect step based on acceleration threshold and minimum delay
    if (acceleration > STEP_THRESHOLD && (now - lastStepTime.current) > MIN_STEP_DELAY) {
      lastStepTime.current = now;
      setSteps(prev => prev + 1);
      
      // Buffer step data
      const newStepData: StepData = {
        date: new Date().toISOString(),
        steps: 1,
        distance: calculateStepDistance(),
        calories: calculateCaloriesBurned(1),
      };
      
      stepBuffer.current.push(newStepData);

      // Save batch when buffer is full
      if (stepBuffer.current.length >= BATCH_SIZE) {
        saveStepData(stepBuffer.current);
        stepBuffer.current = [];
      }
    }
  }, []);

  // Handle gyroscope readings for improved accuracy
  const handleGyroscopeReading = useCallback(() => {
    if (!gyroscope.current) return;
    // Use gyroscope data to improve step detection accuracy
    const { x, y, z } = gyroscope.current;
    // Implement advanced step detection algorithm using gyroscope data
  }, []);

  // Calculate distance based on step length and count
  const calculateStepDistance = useCallback(() => {
    const stepLength = 0.762; // Average step length in meters
    return stepLength;
  }, []);

  // Calculate calories burned based on steps and user profile
  const calculateCaloriesBurned = useCallback((stepCount: number) => {
    const caloriesPerStep = 0.04;
    return stepCount * caloriesPerStep;
  }, []);

  // Save step data to local storage and sync with cloud
  const saveStepData = useCallback(async (data: StepData[]) => {
    try {
      // Save to local storage
      const existingData = localStorage.getItem('stepData');
      const allData = existingData 
        ? [...JSON.parse(existingData), ...data]
        : data;
      localStorage.setItem('stepData', JSON.stringify(allData));

      // Update statistics
      updateStatistics(data);

      // Sync with cloud (implement your cloud sync logic here)
      await syncWithCloud(data);
    } catch (error) {
      console.error('Error saving step data:', error);
    }
  }, []);

  // Sync data with cloud service
  const syncWithCloud = async (data: StepData[]) => {
    // Implement your cloud sync logic here
    // Example: API call to your backend service
    try {
      // const response = await fetch('your-api-endpoint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // Handle response
    } catch (error) {
      console.error('Error syncing with cloud:', error);
      // Store failed sync attempts for retry
      queueFailedSync(data);
    }
  };

  // Queue failed sync attempts for retry
  const queueFailedSync = (data: StepData[]) => {
    const failedSyncs = JSON.parse(localStorage.getItem('failedSyncs') || '[]');
    failedSyncs.push({ data, timestamp: Date.now() });
    localStorage.setItem('failedSyncs', JSON.stringify(failedSyncs));
  };

  // Update statistics with new data
  const updateStatistics = useCallback((newData: StepData[]) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    setDailyStats(prev => [...prev, ...newData]);
    
    setWeeklyStats(prev => {
      const filtered = prev.filter(stat => new Date(stat.date) > weekAgo);
      return [...filtered, ...newData];
    });

    setMonthlyStats(prev => {
      const filtered = prev.filter(stat => new Date(stat.date) > monthAgo);
      return [...filtered, ...newData];
    });
  }, []);

  // Initialize location tracking
  const initializeLocationTracking = useCallback(() => {
    if (!navigator.geolocation) return;

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    locationWatchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition: LatLng = [
          position.coords.latitude,
          position.coords.longitude
        ];

        // Calculate distance if we have a previous location
        if (lastLocation.current) {
          const newDistance = calculateDistance(
            lastLocation.current.coords,
            position.coords
          );
          setDistance(prev => prev + newDistance);
        }

        lastLocation.current = position;
        setCurrentPath(prev => [...prev, newPosition]);
      },
      (error) => console.error('Location error:', error),
      options
    );
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (point1: GeolocationCoordinates, point2: GeolocationCoordinates): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Fallback tracking when sensors are unavailable
  const initializeFallbackTracking = useCallback(() => {
    console.log('Using fallback step tracking');
    // Implement basic step tracking using device motion events
    window.addEventListener('devicemotion', handleDeviceMotion);
  }, []);

  // Handle device motion events for fallback tracking
  const handleDeviceMotion = useCallback((event: DeviceMotionEvent) => {
    if (!event.accelerationIncludingGravity) return;

    const { x, y, z } = event.accelerationIncludingGravity;
    if (x && y && z) {
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      // Implement basic step detection algorithm
    }
  }, []);

  // Start tracking
  const startTracking = useCallback(() => {
    setIsTracking(true);
    initializeSensors();
    initializeLocationTracking();
  }, [initializeSensors, initializeLocationTracking]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    setIsTracking(false);
    
    // Stop sensors
    if (accelerometer.current) {
      accelerometer.current.stop();
    }
    if (gyroscope.current) {
      gyroscope.current.stop();
    }
    
    // Stop location tracking
    if (locationWatchId.current !== null) {
      navigator.geolocation.clearWatch(locationWatchId.current);
    }

    // Save any remaining steps in buffer
    if (stepBuffer.current.length > 0) {
      saveStepData(stepBuffer.current);
      stepBuffer.current = [];
    }
  }, [saveStepData]);

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = () => {
      const savedData = localStorage.getItem('stepData');
      if (savedData) {
        const data = JSON.parse(savedData);
        updateStatistics(data);
      }
    };

    loadSavedData();
  }, [updateStatistics]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (accelerometer.current) {
        accelerometer.current.stop();
      }
      if (gyroscope.current) {
        gyroscope.current.stop();
      }
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [handleDeviceMotion]);

  return {
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
  };
}