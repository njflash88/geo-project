import React from 'react';
import GeolocationAltitude from './GeolocationAltitude';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Geolocation Altitude Display</h1>
        <p>Your current position with altitude information</p>
      </header>
      <GeolocationAltitude />
    </div>
  );
}

export default App;