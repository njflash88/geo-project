// src/App.jsx
import React, { useState } from 'react';
import Map from './components/Map';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Basic validation
    if (username && password) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="app-container">
      <div className="left-panel">
        <div className="login-section">
          <h2>Location Tracker</h2>
          {isLoggedIn ? (
            <div className="welcome-message">
              <p>Welcome, {username}!</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Username:</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Password:</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Login</button>
            </form>
          )}
        </div>

        <div className="button-section">
          <div className="button-group">
            {['Create Event', 'Add User', 'Start/End Event', 'Favorite routes', 'Result', 'Reload Map'].map((num) => (
              <button key={num} className="action-btn">{num}</button>
            ))}
          </div>
          
          <div className="button-group">
            {['Event Page', 'Routes', 'About'].map((letter) => (
              <button key={letter} className="utility-btn">{letter}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="map-container">
        <Map isLoggedIn={true} />
        {/* <Map isLoggedIn={isLoggedIn} /> */}
      </div>
    </div>
  );
}

export default App;
