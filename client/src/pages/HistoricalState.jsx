import { useState } from "react";

function HistoricalState() {
  const events = [
    {
      time: "12:00",
      minutes: 0,
      eventType: "CONTAINER_CREATED",
      status: "Created",
      location: "Warehouse",
      temperature: "22°C",
      details: "Container was created and registered in the system.",
    },
    {
      time: "12:30",
      minutes: 30,
      eventType: "LOADED_ON_SHIP",
      status: "In Transit",
      location: "Port A",
      temperature: "22°C",
      details: "Container was loaded onto the ship.",
    },
    {
      time: "13:15",
      minutes: 75,
      eventType: "TEMPERATURE_SPIKE",
      status: "Temperature Alert",
      location: "At Sea",
      temperature: "31°C",
      details: "Temperature exceeded the expected shipment range.",
    },
    {
      time: "14:00",
      minutes: 120,
      eventType: "ARRIVED_AT_PORT",
      status: "Arrived",
      location: "Port B",
      temperature: "23°C",
      details: "Shipment arrived at the destination port.",
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
      "0"
    )}`;
  };

  const selectedEventIndex = events.findIndex(
    (event) => event.minutes === currentEvent.minutes
  );

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6 text-text-heading font-sans sm:px-6 sm:py-8 md:px-10">
      {/* Header */}
      <header className="mx-auto mb-8 flex max-w-275 flex-col items-start justify-between gap-4 md:flex-row md:gap-6">
        <div>
          <p className="mb-2 text-[13px] font-bold tracking-[1.5px] text-primary">
            AUDIT TRAIL
          </p>

          <h1 className="mb-2 text-[26px] font-bold text-text-heading sm:text-[30px] md:text-[36px]">
            Historical State
          </h1>

          <p className="text-[14px] text-text-secondary sm:text-[15px]">
            View the reconstructed shipment state at any point in time.
          </p>
        </div>

        <div className="w-full rounded-[10px] border border-border bg-bg-card px-4 py-3 text-text-secondary md:w-auto">
          Shipment ID:{" "}
          <strong className="text-text-heading">SHIP-001</strong>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto grid max-w-275 gap-5">
        {/* Reconstructed State */}
        <section className="rounded-[14px] border border-border bg-bg-card p-4.5 sm:p-6">
          <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-5">
            <div>
              <h2 className="mb-1.5 text-xl font-bold text-text-heading">
                Reconstructed State
              </h2>

              <p className="text-[14px] text-text-secondary">
                Shipment state at the selected point in time.
              </p>
            </div>

            <span className="rounded-full bg-success/15 px-3 py-1.5 text-xs font-bold text-success">
              {currentEvent.status.toUpperCase()}
            </span>
          </div>

          {/* State cards */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[10px] border border-border bg-bg-input p-4.5">
              <span className="mb-2 block text-[13px] text-text-secondary">
                Selected Time
              </span>

              <strong className="text-lg text-text-heading">
                {formatTime(selectedMinute)}
              </strong>
            </div>

            <div className="rounded-[10px] border border-border bg-bg-input p-4.5">
              <span className="mb-2 block text-[13px] text-text-secondary">
                Status
              </span>

              <strong className="text-lg text-text-heading">
                {currentEvent.status}
              </strong>
            </div>

            <div className="rounded-[10px] border border-border bg-bg-input p-4.5">
              <span className="mb-2 block text-[13px] text-text-secondary">
                Location
              </span>

              <strong className="text-lg text-text-heading">
                {currentEvent.location}
              </strong>
            </div>

            <div className="rounded-[10px] border border-border bg-bg-input p-4.5">
              <span className="mb-2 block text-[13px] text-text-secondary">
                Temperature
              </span>

              <strong className="text-lg text-text-heading">
                {currentEvent.temperature}
              </strong>
            </div>
          </div>
        </section>

        {/* Time Travel */}
        <section className="rounded-[14px] border border-border bg-bg-card p-4.5 sm:p-6">
          <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-5">
            <div>
              <h2 className="mb-1.5 text-xl font-bold text-text-heading">
                Time Travel
              </h2>

              <p className="text-[14px] text-text-secondary">
                Move through the shipment history.
              </p>
            </div>

            <span className="self-start rounded-lg bg-primary px-3.5 py-2 font-semibold text-text-heading">
              {formatTime(selectedMinute)}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="120"
            value={selectedMinute}
            onChange={(e) => setSelectedMinute(Number(e.target.value))}
            className="w-full cursor-pointer accent-primary"
          />

          <div className="mt-2 flex justify-between text-[13px] text-text-secondary">
            <span>12:00</span>
            <span>12:30</span>
            <span>13:15</span>
            <span>14:00</span>
          </div>
        </section>

        {/* Event Timeline */}
        <section className="rounded-[14px] border border-border bg-bg-card p-4.5 sm:p-6">
          <div className="mb-6">
            <h2 className="mb-1.5 text-xl font-bold text-text-heading">
              Event Timeline
            </h2>

            <p className="text-[14px] text-text-secondary">
              Events recorded for this shipment.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            {events.map((event, index) => {
              const isActive = selectedEventIndex === index;

              return (
                <div
                  key={event.time}
                  className={`flex cursor-pointer gap-2.5 sm:gap-3.5 ${
                    isActive ? "" : ""
                  }`}
                  onClick={() => setSelectedMinute(event.minutes)}
                >
                  {/* Marker */}
                  <div
                    className={`flex h-7 w-7 min-w-7 items-center justify-center rounded-full text-xs sm:h-8 sm:w-8 sm:min-w-8 ${
                      isActive
                        ? "bg-primary text-text-heading"
                        : "bg-border text-text-secondary"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Event content */}
                  <div
                    className={`flex-1 rounded-[10px] border bg-bg-card p-3.5 sm:p-4 ${
                      isActive
                        ? "border-primary"
                        : "border-border"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:gap-5">
                      <div>
                        <h3 className="mb-1 text-base font-semibold text-text-heading">
                          {event.status}
                        </h3>

                        <p className="mt-1 text-xs font-semibold tracking-[0.5px] text-primary">
                          {event.eventType}
                        </p>

                        <p className="mt-1 text-[13px] text-text-secondary">
                          {event.location}
                        </p>
                      </div>

                      <span className="font-bold text-primary">
                        {event.time}
                      </span>
                    </div>

                    <p className="mt-2.5 text-[13px] text-text-secondary">
                      Temperature: {event.temperature}
                    </p>

                    <p className="mt-2 text-[13px] leading-6 text-text-secondary">
                      {event.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HistoricalState;
