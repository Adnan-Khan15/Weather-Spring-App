import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric'); // Celsius by default

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:8080/api/weather/${city}`
      );
      
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const getTemperature = () => {
    if (!weather?.main?.temp) return 'N/A';
    return unit === 'metric' 
      ? `${Math.round(weather.main.temp)}°C`
      : `${Math.round((weather.main.temp * 9/5) + 32)}°F`;
  };

  
const getWeatherIcon = () => {
  if (!weather?.weather?.[0]?.icon) return null;
  return (
    <img 
      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
      alt={weather.weather[0].description}
      className="weather-icon"
      onError={(e) => {
        e.target.style.display = 'none'; // Hide if image fails to load
      }}
    />
  );
};

  return (
    <div className="app">
      <div className="container">
        <h1 className="app-title">Weather Forecast</h1>
        
        <div className="search-container">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
          />
          <button 
            onClick={fetchWeather}
            className="search-button"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        <button onClick={toggleUnit} className="unit-toggle">
          Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
        </button>

        {error && <p className="error-message">{error}</p>}

        {weather && (
          <div className="weather-card">
            <div className="weather-header">
              <h2>
                {weather.name}, {weather.sys?.country}
              </h2>
              <p className="weather-date">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="weather-main">
              <div className="temperature">
                {getTemperature()}
                {getWeatherIcon() && (
                  <img 
                    src={getWeatherIcon()} 
                    alt="Weather icon" 
                    className="weather-icon"
                  />
                )}
              </div>
              <p className="weather-description">
                {weather.weather?.[0]?.description}
              </p>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span>💧 Humidity</span>
                <span>{weather.main?.humidity}%</span>
              </div>
              <div className="detail-item">
                <span>🌬️ Wind</span>
                <span>
                  {unit === 'metric' 
                    ? `${weather.wind?.speed} m/s` 
                    : `${(weather.wind?.speed * 2.237).toFixed(1)} mph`}
                </span>
              </div>
              <div className="detail-item">
                <span>🌡️ Feels Like</span>
                <span>
                  {unit === 'metric'
                    ? `${Math.round(weather.main?.feels_like)}°C`
                    : `${Math.round((weather.main?.feels_like * 9/5) + 32)}°F`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;