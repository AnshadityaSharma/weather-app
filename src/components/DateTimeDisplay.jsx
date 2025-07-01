import React, { useState, useEffect } from 'react';

function DateTimeDisplay() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update every second
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Format: e.g., Saturday, June 21, 2025 14:35:20
  const formatted = now.toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="datetime-display">
      {formatted}
    </div>
  );
}

export default DateTimeDisplay;
