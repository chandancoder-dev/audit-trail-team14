import { useEffect, useMemo, useState } from "react";
import { queryAPI } from "../services/api";

const SHIPMENT_ID = "SHIP-001";

function HistoricalState() {
  const [events, setEvents] = useState([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [historicalState, setHistoricalState] = useState(null);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState("");

  // Fetch real shipment events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        setError("");

        const data = await queryAPI.getShipmentEvents(SHIPMENT_ID);

        const sortedEvents = Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                new Date(a.recordedAt).getTime() -
                new Date(b.recordedAt).getTime(),
            )
          : [];

        setEvents(sortedEvents);
        setSelectedEventIndex(0);
      } catch (err) {
        console.error("Failed to load shipment events:", err);
        setError(err.message || "Failed to load shipment events.");
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  // Get the currently selected event
  const selectedEvent = useMemo(() => {
    if (!events.length) {
      return null;
    }

    return events[selectedEventIndex] || events[0];
  }, [events, selectedEventIndex]);

  // Use the exact timestamp of the selected event
  const selectedDate = useMemo(() => {
    if (!selectedEvent?.recordedAt) {
      return null;
    }

    return new Date(selectedEvent.recordedAt);
  }, [selectedEvent]);

  // Fetch reconstructed state whenever selected event changes
  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const loadHistoricalState = async () => {
      try {
        setLoadingState(true);
        setError("");

        const state = await queryAPI.getShipmentState(
          SHIPMENT_ID,
          selectedDate.toISOString(),
        );

        setHistoricalState(state);
      } catch (err) {
        console.error("Failed to load historical state:", err);

        if (err.status === 404) {
          setHistoricalState(null);
        } else {
          setError(err.message || "Failed to load historical state.");
        }
      } finally {
        setLoadingState(false);
      }
    };

    loadHistoricalState();
  }, [selectedDate]);

  const formatTime = (date) => {
    if (!date) {
      return "--:--";
    }

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatTimelineDate = (date) => {
    if (!date) {
      return "--";
    }

    return new Date(date).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
    });
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "--";
    }

    return new Date(date).toLocaleString();
  };

  const getEventStatus = (event) => {
    return event?.payload?.status || event?.eventType || "Unknown";
  };

  const getEventLocation = (event) => {
    return event?.payload?.location || "Unknown";
  };

  const getEventTemperature = (event) => {
    const temperature = event?.payload?.temperature;

    if (temperature === undefined || temperature === null) {
      return "--";
    }

    return `${temperature}°C`;
  };

  if (loadingEvents) {
    return (
      <div className="min-h-screen bg-bg-primary px-4 py-10 text-text-normal sm:px-6 md:px-10">
        <div className="mx-auto max-w-275">
          <p className="text-text-secondary">Loading shipment history...</p>
        </div>
      </div>
    );
  }

  if (error && !events.length) {
    return (
      <div className="min-h-screen bg-bg-primary px-4 py-10 text-text-normal sm:px-6 md:px-10">
        <div className="mx-auto max-w-275 rounded-[14px] border border-error bg-bg-card p-6">
          <h1 className="mb-2 text-xl font-bold text-text-heading">
            Unable to load shipment history
          </h1>

          <p className="text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="min-h-screen bg-bg-primary px-4 py-10 text-text-normal sm:px-6 md:px-10">
        <div className="mx-auto max-w-275 rounded-[14px] border border-border bg-bg-card p-6">
          <h1 className="mb-2 text-xl font-bold text-text-heading">
            No events found
          </h1>

          <p className="text-text-secondary">
            No audit events have been recorded for {SHIPMENT_ID}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6 font-sans text-text-heading sm:px-6 sm:py-8 md:px-10">
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
          <strong className="text-text-heading">{SHIPMENT_ID}</strong>
        </div>
      </header>

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
              {loadingState
                ? "LOADING"
                : historicalState?.status?.toUpperCase() || "NO STATE"}
            </span>
          </div>

          {loadingState ? (
            <div className="rounded-[10px] border border-border bg-bg-input p-6 text-center text-text-secondary">
              Loading reconstructed state...
            </div>
          ) : historicalState ? (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[10px] border border-border bg-bg-input p-4.5">
                <span className="mb-2 block text-[13px] text-text-secondary">
                  Selected Time
                </span>

                <strong className="text-lg text-text-heading">
                  {formatTime(selectedDate)}
                </strong>
              </div>

              <div className="rounded-[10px] border border-border bg-bg-input p-4.5">
                <span className="mb-2 block text-[13px] text-text-secondary">
                  Status
                </span>

                <strong className="text-lg text-text-heading">
                  {historicalState.status}
                </strong>
              </div>

              <div className="rounded-[10px] border border-border bg-bg-input p-4.5">
                <span className="mb-2 block text-[13px] text-text-secondary">
                  Location
                </span>

                <strong className="text-lg text-text-heading">
                  {historicalState.currentLocation || "--"}
                </strong>
              </div>

              <div className="rounded-[10px] border border-border bg-bg-input p-4.5">
                <span className="mb-2 block text-[13px] text-text-secondary">
                  Temperature
                </span>

                <strong className="text-lg text-text-heading">
                  {historicalState.temperature !== null &&
                  historicalState.temperature !== undefined
                    ? `${historicalState.temperature}°C`
                    : "--"}
                </strong>
              </div>
            </div>
          ) : (
            <div className="rounded-[10px] border border-border bg-bg-input p-6 text-center text-text-secondary">
              No shipment state exists at the selected time.
            </div>
          )}
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

            <div className="text-right">
              <span className="rounded-lg bg-primary px-3.5 py-2 font-semibold text-text-heading">
                {formatTime(selectedDate)}
              </span>

              <p className="mt-2 text-xs text-text-secondary">
                {formatDateTime(selectedDate)}
              </p>
            </div>
          </div>

          {/* Event-based slider */}
          <input
            type="range"
            min="0"
            max={events.length - 1}
            step="1"
            value={selectedEventIndex}
            onChange={(e) => setSelectedEventIndex(Number(e.target.value))}
            className="w-full cursor-pointer accent-primary"
          />

          {/* Slider labels */}
          <div className="mt-3 flex justify-between gap-2 text-[12px] text-text-secondary sm:text-[13px]">
            {events.map((event, index) => (
              <button
                key={event._id || event.recordedAt}
                type="button"
                onClick={() => setSelectedEventIndex(index)}
                className={`text-center transition-colors ${
                  selectedEventIndex === index
                    ? "font-bold text-primary"
                    : "text-text-secondary"
                }`}
              >
                <span className="block">
                  {formatTimelineDate(event.recordedAt)} •{" "}
                  {formatTime(event.recordedAt)}
                </span>

                <span className="hidden sm:block">{event.eventType}</span>
              </button>
            ))}
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
                  key={event._id || event.recordedAt}
                  className="flex cursor-pointer gap-2.5 sm:gap-3.5"
                  onClick={() => setSelectedEventIndex(index)}
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
                      isActive ? "border-primary" : "border-border"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:gap-5">
                      <div>
                        <h3 className="mb-1 text-base font-semibold text-text-heading">
                          {getEventStatus(event)}
                        </h3>

                        <p className="mt-1 text-xs font-semibold tracking-[0.5px] text-primary">
                          {event.eventType}
                        </p>

                        <p className="mt-1 text-[13px] text-text-secondary">
                          {getEventLocation(event)}
                        </p>
                      </div>

                      <span className="text-right font-bold text-primary">
                        <span className="block">
                          {formatTimelineDate(event.recordedAt)} •{" "}
                          {formatTime(event.recordedAt)}
                        </span>
                      </span>
                    </div>

                    <p className="mt-2.5 text-[13px] text-text-secondary">
                      Temperature: {getEventTemperature(event)}
                    </p>

                    <p className="mt-2 text-[13px] leading-6 text-text-secondary">
                      {event.payload?.details ||
                        "Event recorded in the audit trail."}
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
