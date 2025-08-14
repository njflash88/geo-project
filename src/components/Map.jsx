// src/Map.jsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox token here
mapboxgl.accessToken = 'pk.eyJ1IjoiZmxhc2g4OCIsImEiOiJjbGVyOTNvcnkwdTNnM3hqd2xucGZlNDBxIn0.oesJClY8acmXOVDTDPPnCA';

const Map = ({ isLoggedIn }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [114.255, 22.77], // Initial Hong Kong coordinates
      zoom: 9
    });

    // Add zoom and rotation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Start watching position
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          
          // Update map center
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true
          });

          // Update or create marker
          if (!markerRef.current) {
            markerRef.current = new mapboxgl.Marker({ color: '#FF0000' })
              .setLngLat([longitude, latitude])
              .addTo(map.current);
          } else {
            markerRef.current.setLngLat([longitude, latitude]);
          }
        },
        error => {
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation not supported');
    }

    // Cleanup
    return () => {
      if (map.current) map.current.remove();
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isLoggedIn]);

  return <div ref={mapContainer} className="map" />;
};

export default Map;