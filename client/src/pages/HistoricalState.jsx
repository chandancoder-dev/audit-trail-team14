import { useState } from "react";
import "../styles/historicalState.css";

function HistoricalState() {
  const events = [
    {
      time: "12:00",
      minutes: 0,
      status: "Created",
      location: "Warehouse",
      temperature: "22°C",
    },
    {
      time: "12:30",
      minutes: 30,
      status: "In Transit",
      location: "Port A",
      temperature: "22°C",
    },
    {
      time: "13:15",
      minutes: 75,
      status: "Temperature Alert",
      location: "At Sea",
      temperature: "31°C",
    },
    {
      time: "14:00",
      minutes: 120,
      status: "Arrived",
      location: "Port B",
      temperature: "23°C",
    },
  ];

  const [selectedMinute, setSelectedMinute] = useState(30);

  const currentEvent = [...events]
    .reverse()
    .find((event) => event.minutes <= selectedMinute);

  const formatTime = (minutes) => {
    const hour = 12 + Math.floor(minutes / 60);
    const minute = minutes % 60;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0",
    )}`;
  };

  const selectedEventIndex = events.findIndex(
    (event) => event.minutes === currentEvent.minutes,
  );

  return (
    <div className="historical-page">
      <header className="history-header">
        <div>
          <p className="page-label">AUDIT TRAIL</p>

          <h1>Historical State</h1>

          <p className="page-description">
            View the reconstructed shipment state at any point in time.
          </p>
        </div>

        <div className="shipment-badge">
          Shipment ID: <strong>SHIP-001</strong>
        </div>
      </header>

      <main className="history-content">
        <section className="state-card">
          <div className="section-heading">
            <div>
              <h2>Reconstructed State</h2>

              <p>Shipment state at the selected point in time.</p>
            </div>

            <span className="status-badge">
              {currentEvent.status.toUpperCase()}
            </span>
          </div>

          <div className="state-grid">
            <div className="state-item">
              <span>Selected Time</span>
              <strong>{formatTime(selectedMinute)}</strong>
            </div>

            <div className="state-item">
              <span>Status</span>
              <strong>{currentEvent.status}</strong>
            </div>

            <div className="state-item">
              <span>Location</span>
              <strong>{currentEvent.location}</strong>
            </div>

            <div className="state-item">
              <span>Temperature</span>
              <strong>{currentEvent.temperature}</strong>
            </div>
          </div>
        </section>

        <section className="timeline-card">
          <div className="section-heading">
            <div>
              <h2>Time Travel</h2>

              <p>Move through the shipment history.</p>
            </div>

            <span className="selected-time">{formatTime(selectedMinute)}</span>
          </div>

          <input
            type="range"
            min="0"
            max="120"
            value={selectedMinute}
            onChange={(e) => setSelectedMinute(Number(e.target.value))}
            className="history-slider"
          />

          <div className="slider-labels">
            <span>12:00</span>
            <span>12:30</span>
            <span>13:15</span>
            <span>14:00</span>
          </div>
        </section>

        <section className="events-card">
          <div className="section-heading">
            <div>
              <h2>Event Timeline</h2>

              <p>Events recorded for this shipment.</p>
            </div>
          </div>

          <div className="timeline">
            {events.map((event, index) => (
              <div
                className={`timeline-event ${
                  selectedEventIndex === index ? "active-event" : ""
                }`}
                key={event.time}
                onClick={() => setSelectedMinute(event.minutes)}
              >
                <div className="timeline-marker">{index + 1}</div>

                <div className="event-content">
                  <div className="event-top">
                    <div>
                      <h3>{event.status}</h3>

                      <p>{event.location}</p>
                    </div>

                    <span className="event-time">{event.time}</span>
                  </div>

                  <p className="event-temperature">
                    Temperature: {event.temperature}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HistoricalState;
