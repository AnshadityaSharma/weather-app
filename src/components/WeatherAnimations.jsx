import React from 'react';
import './WeatherAnimations.css';

const WeatherAnimations = ({ condition }) => {
  if (!condition) return null;

  switch (condition.toLowerCase()) {
    case 'clouds':
      return (
        <div className="weather-animation clouds">
          <div className="cloud cloud1"></div>
          <div className="cloud cloud2"></div>
        </div>
      );

    case 'clear':
      return (
        <div className="weather-animation sunny-sky">
          <div className="floating-sun sun1"></div>
          <div className="floating-sun sun2"></div>
          <div className="floating-sun sun3"></div>
        </div>
      );

    case 'rain':
      return (
        <div className="weather-animation rain">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="raindrop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
      );

 case 'thunderstorm':
  return (
    <div className="weather-animation thunderstorm">
      {/* Transient dark overlay */}
      <div className="storm-overlay"></div>

      {/* Layered clouds */}
      <div className="storm-clouds">
        <div className="cloudt fast cloud1"></div>
        <div className="cloudt slow cloud2"></div>
      </div>

      {/* Three independent lightning bolts */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="lightning-bolt" style={{ '--i': i }} />
      ))}
       <div className="weather-animation rain">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="raindrop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
    </div>
  );



    case 'snow':
      return (
        <div className="weather-animation snow">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
      );

    default:
      return null;
  }
};

export default WeatherAnimations;
