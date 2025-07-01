import React, { useState, useEffect } from 'react';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ForecastCard from './components/ForecastCard';
import ThemeToggle from './components/ThemeToggle';
import DateTimeDisplay from './components/DateTimeDisplay';
import WeatherAnimation from './components/WeatherAnimations';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [units, setUnits] = useState('metric');
  const [bgImage, setBgImage] = useState('clear.jpg');
  const [weatherCondition, setWeatherCondition] = useState('clear');
  const [history, setHistory] = useState(() =>
    JSON.parse(localStorage.getItem('history') || '[]')
  );

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const toggleUnits = () => {
    setUnits((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');
    setCurrentWeather(null);
    setForecastData([]);

    try {
      const currentResp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=${units}`
      );
      if (!currentResp.ok) throw new Error('City not found');
      const currentData = await currentResp.json();
      setCurrentWeather(currentData);

      const main = currentData.weather[0].main.toLowerCase();
      const temp = currentData.main.temp;

      let overrideCondition = main;
      let image = 'clear.jpg';

      if (temp <= 1) {
        overrideCondition = 'snow';
        image = 'snow.jpg';
      } else if (main.includes('cloud')) {
        overrideCondition = 'clouds';
        image = 'clouds.jpg';
      } else if (main.includes('rain')) {
        overrideCondition = 'rain';
        image = 'rain.jpg';
      } else if (main.includes('snow')) {
        overrideCondition = 'snow';
        image = 'snow.jpg';
      } else if (main.includes('thunder')) {
        overrideCondition = 'thunder';
        image = 'thunder.jpg';
      }

      setWeatherCondition(overrideCondition);
      setBgImage(image);

      const forecastResp = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=${units}`
      );
      if (!forecastResp.ok) throw new Error('Forecast not available');
      const forecastJson = await forecastResp.json();
      const dailyData = processForecastData(forecastJson.list);
      setForecastData(dailyData);

      if (!history.includes(city)) {
        const updated = [city, ...history].slice(0, 5);
        setHistory(updated);
        localStorage.setItem('history', JSON.stringify(updated));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processForecastData = (list) => {
    const groups = {};
    list.forEach((entry) => {
      const dateText = entry.dt_txt.split(' ')[0];
      if (!groups[dateText]) groups[dateText] = [];
      groups[dateText].push(entry);
    });

    const result = [];
    Object.keys(groups).forEach((date) => {
      const entries = groups[date];
      let midEntry = entries.find((e) => e.dt_txt.endsWith('12:00:00'));
      if (!midEntry) {
        midEntry = entries.reduce((prev, curr) => {
          const prevHour = parseInt(prev.dt_txt.split(' ')[1].slice(0, 2));
          const currHour = parseInt(curr.dt_txt.split(' ')[1].slice(0, 2));
          return Math.abs(currHour - 12) < Math.abs(prevHour - 12)
            ? curr
            : prev;
        }, entries[0]);
      }
      const temps = entries.map((e) => e.main.temp);
      result.push({
        date,
        temp_min: Math.min(...temps),
        temp_max: Math.max(...temps),
        icon: midEntry.weather[0].icon,
        description: midEntry.weather[0].description,
        main: midEntry.weather[0].main,
      });
    });

    result.sort((a, b) => new Date(a.date) - new Date(b.date));
    return result.slice(0, 5);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div
      className="app-container"
      style={{
        background: `url('/${bgImage}') center/cover no-repeat`,
      }}
    >
      <WeatherAnimation condition={weatherCondition} />

      <div className="overlay">
        <header className="app-header">
          <h1>🌤️ Weather App</h1>
          <DateTimeDisplay />
          <div>
            <ThemeToggle />
            <button onClick={toggleUnits} className="unit-toggle">
              {units === 'metric' ? '°C → °F' : '°F → °C'}
            </button>
          </div>
        </header>

        <div className="search-section">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={fetchWeather}>Search</button>
        </div>

        {history.length > 0 && (
          <div className="history">
            <p>Recent:</p>
            {history.map((c, i) => (
              <button key={i} onClick={() => { setCity(c); fetchWeather(); }}>
                {c}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="info-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        {currentWeather && (
          <CurrentWeatherCard data={currentWeather} units={units} />
        )}

        {forecastData.length > 0 && (
          <div className="forecast-container">
            {forecastData.map((day) => (
              <ForecastCard key={day.date} day={day} units={units} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
