import React from 'react';
import './CurrentWeatherCard.css';

export default function CurrentWeatherCard({ data, units }) {
  const { name, main, weather, wind, sys } = data;

  const formatTime = (ts) => {
    return new Date(ts * 1000).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="current-card">
      <h2>{name}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
        alt={weather[0].description}
      />
      <p className="temp">{Math.round(main.temp)}°{units === 'metric' ? 'C' : 'F'}</p>
      <p className="desc">{weather[0].description}</p>
      <p>Humidity: {main.humidity}%</p>
      <p>Wind: {wind.speed} {units === 'metric' ? 'm/s' : 'mph'}</p>
      <p>🌅 Sunrise: {formatTime(sys.sunrise)}</p>
      <p>🌇 Sunset: {formatTime(sys.sunset)}</p>
    </div>
  );
}
