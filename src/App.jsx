import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZmxhc2g4OCIsImEiOiJjbGVyOTNvcnkwdTNnM3hqd2xucGZlNDBxIn0.oesJClY8acmXOVDTDPPnCA';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [locationStatus, setLocationStatus] = useState('Loading map...');
  const [isLoading, setIsLoading] = useState(true);
  const [accuracy, setAccuracy] = useState(null);
  const [coordinates, setCoordinates] = useState({ lng: 114.222, lat: 22.3118 });
  const markerRef = useRef(null);
  const accuracyCircleRef = useRef(null);
const l;
  useEffect(() => {
    // Initialize the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coordinates.lng, coordinates.lat],
      zoom: 10
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // When the map loads, attempt to get user location
    map.current.on('load', () => {
      setLocationStatus('Detecting your location...');
      getLocation();
    });

    // Cleanup
    return () => map.current.remove();
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        const altitude = GeolocationCoordinates.altitude;
        console.log("** altitude = " + altitude);
        l = altitude;
        setCoordinates({ lng: longitude, lat: latitude });
        setAccuracy(accuracy);
        setIsLoading(false);
        setLocationStatus('Location found!');
        
        // Update map view
        map.current.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          essential: true
        });
        
        // Add or update marker
        if (!markerRef.current) {
          markerRef.current = new mapboxgl.Marker({ color: '#3b82f6' })
            .setLngLat([longitude, latitude])
            .addTo(map.current);
        } else {
          markerRef.current.setLngLat([longitude, latitude]);
        }
        
        // Add accuracy circle
        addAccuracyCircle(longitude, latitude, accuracy);
      },
      error => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationStatus('Permission denied. Please enable location access in browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationStatus('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationStatus('The request to get location timed out.');
            break;
          default:
            setLocationStatus('An unknown error occurred.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const addAccuracyCircle = (lng, lat, accuracy) => {
    // Remove existing circle if it exists
    if (accuracyCircleRef.current) {
      if (map.current.getLayer('accuracy-circle')) {
        map.current.removeLayer('accuracy-circle');
        map.current.removeSource('accuracy-circle');
      }
    }
    
    // Create new circle
    map.current.addSource('accuracy-circle', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      }
    });
    
    map.current.addLayer({
      id: 'accuracy-circle',
      type: 'circle',
      source: 'accuracy-circle',
      paint: {
        'circle-radius': accuracy,
        'circle-color': 'rgba(59, 130, 246, 0.2)',
        'circle-stroke-color': 'rgba(59, 130, 246, 0.5)',
        'circle-stroke-width': 1
      }
    });
    
    accuracyCircleRef.current = true;
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Automatic Geolocation Demo</h1>
        <p>Your location is detected automatically when the map loads</p>
      </header>
      
      <div className="map-container">
        <div ref={mapContainer} className="map" />
      </div>
      
      <div className="control-panel">
        <div className="status-card">
          <div className={`status-indicator ${isLoading ? 'loading' : locationStatus.includes('found') ? 'success' : ''}`}></div>
          <div className="status-text">
            <h3>Location Status</h3>
            <p>{locationStatus}</p>
            {accuracy && <p>Accuracy: {Math.round(accuracy)} meters</p>}
          </div>
        </div>
        
        <div className="coordinates">
          <h3>Current Position</h3>
          <p>Longitude: {coordinates.lng.toFixed(6)}</p>
          <p>Latitude: {coordinates.lat.toFixed(6)}</p>
          <p>Altitude: {l}</p> 
        </div>
      </div>
      
      <div className="info-section">
        <h2>How This Works</h2>
        <ul>
          <li>The map automatically requests location when it loads</li>
          <li>Browser will ask for permission to access your location</li>
          <li>If granted, your position is shown with a blue marker</li>
          <li>The blue circle shows the accuracy of your location</li>
          <li>No button click required - it just works!</li>
        </ul>
      </div>
      
      <footer className="app-footer">
        <p>Built with React, Vite, and Mapbox GL JS | Automatic Geolocation Demo</p>
      </footer>
    </div>
  );
}

export default App;