import React from 'react';
import './ForecastCard.css';

function ForecastCard({ day }) {
  // day: { date: 'YYYY-MM-DD', temp_min, temp_max, icon, description, main }
  // Format date nicely: e.g., "Mon, Jun 23"
  const dateObj = new Date(day.date);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString(undefined, options);

  const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
  return (
    <div className="forecast-card">
      <p className="forecast-date">{formattedDate}</p>
      <img src={iconUrl} alt={day.description} />
      <p className="forecast-temp">
        {Math.round(day.temp_min)}° / {Math.round(day.temp_max)}°C
      </p>
      <p className="forecast-desc">{day.main}</p>
    </div>
  );
}

export default ForecastCard;
