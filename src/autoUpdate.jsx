// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css';

// Replace with your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2c2FtcGxlcyIsImEiOiJjbDd0ZWZ2b2MwMG5jM3ZxdGxob3Z3a2V2In0.FcTb3iWUtYq3xZq3Xq3q3Q';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [position, setPosition] = useState({
    latitude: null,
    longitude: null,
    altitude: null,
    accuracy: null
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  const [heading, setHeading] = useState(null);
  const [speed, setSpeed] = useState(null);
  const watchId = useRef(null);

  // Initialize map
  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0],
      zoom: 10,
      pitch: 60
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    
    return () => {
      if (map.current) map.current.remove();
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  // Start watching position
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    // Create blinking marker element
    const el = document.createElement('div');
    el.className = 'blinking-marker';
    const innerCircle = document.createElement('div');
    innerCircle.className = 'inner-circle';
    el.appendChild(innerCircle);
    
    // Setup position watcher
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, altitude, accuracy, heading, speed } = pos.coords;
        setPosition({ latitude, longitude, altitude, accuracy });
        setHeading(heading);
        setSpeed(speed);
        setIsMoving(speed > 0.5);
        setIsLoading(false);
        
        // Update map position
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 16,
            bearing: heading || 0,
            essential: true,
            duration: 1000
          });
          
          // Update or create marker
          if (marker.current) {
            marker.current.setLngLat([longitude, latitude]);
          } else {
            marker.current = new mapboxgl.Marker({
              element: el,
              rotation: heading || 0
            })
            .setLngLat([longitude, latitude])
            .addTo(map.current);
          }
        }
      },
      (err) => {
        setError(`ERROR(${err.code}): ${err.message}`);
        setIsLoading(false);
      },
      options
    );

    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h1>Live Location Tracker</h1>
        <p>Real-time GPS position with altitude tracking</p>
      </div>
      
      <div className="map-container">
        <div ref={mapContainer} className="map" />
        
        <div className="status-indicator">
          {isLoading ? (
            <div className="status loading">
              <div className="spinner"></div>
              <span>Detecting your location...</span>
            </div>
          ) : error ? (
            <div className="status error">
              <span>⚠️ {error}</span>
            </div>
          ) : (
            <div className="status active">
              <div className={`pulse ${isMoving ? 'moving' : ''}`}></div>
              <span>{isMoving ? 'Moving' : 'Stationary'}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="position-info">
        <div className="data-card">
          <div className="data-header">
            <h3>Current Position</h3>
            {position.speed !== null && (
              <div className="speed-indicator">
                <span>Speed: {speed ? (speed * 3.6).toFixed(1) : '0.0'} km/h</span>
              </div>
            )}
          </div>
          
          <div className="data-grid">
            <div className="data-item">
              <div className="label">Latitude</div>
              <div className="value">
                {position.latitude !== null ? position.latitude.toFixed(6) : '--'}
              </div>
            </div>
            
            <div className="data-item">
              <div className="label">Longitude</div>
              <div className="value">
                {position.longitude !== null ? position.longitude.toFixed(6) : '--'}
              </div>
            </div>
            
            <div className="data-item">
              <div className="label">Altitude</div>
              <div className="value">
                {position.altitude !== null ? `${position.altitude.toFixed(1)} meters` : '--'}
              </div>
            </div>
            
            <div className="data-item">
              <div className="label">Accuracy</div>
              <div className="value">
                {position.accuracy !== null ? `±${position.accuracy.toFixed(1)} meters` : '--'}
              </div>
            </div>
          </div>
          
          <div className="compass">
            <div className="compass-rose">
              <div className="direction" style={{ transform: `rotate(${heading || 0}deg)` }}>
                <div className="arrow"></div>
              </div>
            </div>
            <div className="compass-label">
              {heading !== null ? `${Math.round(heading)}° ${getDirection(heading)}` : 'Heading: --'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer">
        <p>This app requires location permissions and works best on GPS-enabled devices outdoors</p>
      </div>
    </div>
  );
}

// Helper function to get compass direction
function getDirection(degrees) {
  if (degrees === null) return '';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export default App;