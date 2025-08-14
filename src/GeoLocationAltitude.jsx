import React, { useState, useEffect } from 'react';

const GeolocationAltitude = () => {
  const [position, setPosition] = useState({
    latitude: null,
    longitude: null,
    altitude: null,
    accuracy: null,
    altitudeAccuracy: null
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permission, setPermission] = useState('prompt');

  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    // Check permission state
    navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
      setPermission(permissionStatus.state);
      permissionStatus.onchange = () => setPermission(permissionStatus.state);
    });

    const options = {
      enableHighAccuracy: true, // Essential for altitude data
      timeout: 15000, // Wait max 15 seconds
      maximumAge: 0 // Don't use cached position
    };

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          altitude: pos.coords.altitude,
          accuracy: pos.coords.accuracy,
          altitudeAccuracy: pos.coords.altitudeAccuracy
        });
        setIsLoading(false);
      },
      (err) => {
        setError(`ERROR(${err.code}): ${err.message}`);
        setIsLoading(false);
      },
      options
    );
  }, []);

  const getLocationStatus = () => {
    if (isLoading) return "⌛ Detecting location...";
    if (error) return `❌ Error: ${error}`;
    if (permission === 'denied') return "🔒 Location permission denied";
    
    return "📍 Location detected!";
  };

  const formatValue = (value, unit) => {
    if (value === null) return "N/A";
    return `${value.toFixed(2)} ${unit}`;
  };

  return (
    <div className="geolocation-container">
      <div className="status-indicator">
        <div className={`status-dot ${isLoading ? 'loading' : error ? 'error' : 'success'}`}></div>
        <span>{getLocationStatus()}</span>
      </div>
      
      <div className="position-card">
        {/* Current Position with Altitude in h3 */}
        <h3 className="current-position">
          Current Position: {position.altitude !== null ? 
            `${position.altitude.toFixed(1)} meters above sea level` : 
            "Altitude data unavailable"}
        </h3>
        
        <div className="position-details">
          <div className="detail-row">
            <span>Latitude:</span>
            <span>{formatValue(position.latitude, '°')}</span>
          </div>
          <div className="detail-row">
            <span>Longitude:</span>
            <span>{formatValue(position.longitude, '°')}</span>
          </div>
          <div className="detail-row">
            <span>Horizontal Accuracy:</span>
            <span>{formatValue(position.accuracy, 'meters')}</span>
          </div>
          <div className="detail-row">
            <span>Altitude Accuracy:</span>
            <span>{formatValue(position.altitudeAccuracy, 'meters')}</span>
          </div>
        </div>
      </div>
      
      <div className="notes">
        <h4>Important Notes:</h4>
        <ul>
          <li>Altitude requires a GPS-enabled device (smartphone/tablet)</li>
          <li>Better results outdoors with clear sky view</li>
          <li>Altitude accuracy is typically lower than horizontal position accuracy</li>
          <li>Desktop computers rarely provide altitude data</li>
        </ul>
      </div>
    </div>
  );
};

export default GeolocationAltitude;