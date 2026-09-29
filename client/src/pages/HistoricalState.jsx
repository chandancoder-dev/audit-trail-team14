import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { queryAPI } from "../services/api";

function HistoricalState() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const shipmentId = searchParams.get("shipmentId");

  const [events, setEvents] = useState([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [historicalState, setHistoricalState] = useState(null);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState("");

  // Fetch real shipment events
  useEffect(() => {
    const loadEvents = async () => {
      if (!shipmentId) {
        setEvents([]);
        setError("Shipment ID is missing.");
        setLoadingEvents(false);
        return;
      }

      try {
        setLoadingEvents(true);
        setError("");

        const data = await queryAPI.getShipmentEvents(shipmentId);

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
  }, [shipmentId]);

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
    if (!shipmentId || !selectedDate) {
      return;
    }

    const loadHistoricalState = async () => {
      try {
        setLoadingState(true);
        setError("");

        const state = await queryAPI.getShipmentState(
          shipmentId,
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
  }, [shipmentId, selectedDate]);

  const handleEventSelection = (index) => {
    if (index < 0 || index >= events.length) {
      return;
    }

    setSelectedEventIndex(index);
  };

  const handleSliderChange = (event) => {
    handleEventSelection(Number(event.target.value));
  };

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
            No audit events have been recorded for {shipmentId}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg-primary px-4 py-6 font-sans text-text-heading sm:px-6 sm:py-8 md:px-10">
      <button
        type="button"
        onClick={() => navigate(shipmentId ? `/shipment/${shipmentId}` : "/dashboard")}
        className="mx-auto mb-5 flex max-w-275 items-center gap-1.5 text-sm text-text-secondary transition hover:text-text-heading"
      >
        <span aria-hidden="true">←</span>{" "}
        {shipmentId ? "Back to Shipment" : "Back to Dashboard"}
      </button>

      {/* Header */}
      <header className="mx-auto mb-8 flex max-w-275 flex-col items-start justify-between gap-5 md:flex-row md:items-center md:gap-8">
        <div className="min-w-0">
          <p className="mb-2 text-[12px] font-bold tracking-[1.8px] text-primary sm:text-[13px]">
            AUDIT TRAIL
          </p>

          <h1 className="mb-2 text-[26px] font-bold leading-tight text-text-heading sm:text-[30px] md:text-[36px]">
            Historical State
          </h1>

          <p className="max-w-2xl text-[14px] leading-6 text-text-secondary sm:text-[15px]">
            View the reconstructed shipment state at any point in time.
          </p>
        </div>

        <div className="w-full shrink-0 rounded-[10px] border border-border bg-bg-card px-4 py-3 text-[13px] text-text-secondary shadow-sm sm:w-auto sm:px-5">
          Shipment ID:{" "}
          <strong className="text-text-heading">{shipmentId}</strong>
        </div>
      </header>

      <main className="mx-auto grid min-w-0 max-w-275 gap-6">
        {/* Reconstructed State */}
        <section className="min-w-0 rounded-[14px] border border-border bg-bg-card p-4.5 shadow-sm sm:p-6">
          <div className="mb-6 flex min-w-0 flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="min-w-0">
              <h2 className="mb-1.5 text-xl font-bold text-text-heading">
                Reconstructed State
              </h2>

              <p className="text-[14px] leading-5 text-text-secondary">
                Shipment state at the selected point in time.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-success/15 px-3.5 py-1.5 text-xs font-bold tracking-wide text-success">
              {loadingState
                ? "LOADING"
                : historicalState?.status?.toUpperCase() || "NO STATE"}
            </span>
          </div>

          {loadingState ? (
            <div className="flex min-h-28 items-center justify-center rounded-[10px] border border-border bg-bg-input p-6 text-center text-sm text-text-secondary">
              Loading reconstructed state...
            </div>
          ) : historicalState ? (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="min-h-25 rounded-[10px] border border-border bg-bg-input p-4.5">
                <span className="mb-2 block text-[13px] text-text-secondary">
                  Selected Time
                </span>

                <strong className="block text-lg leading-6 text-text-heading">
                  {formatTime(selectedDate)}
                </strong>

                <span className="mt-1 block text-xs text-text-secondary">
                  {formatTimelineDate(selectedDate)}
                </span>
              </div>

              <div className="min-h-25 rounded-[10px] border border-border bg-bg-input p-4.5">
                <span className="mb-2 block text-[13px] text-text-secondary">
                  Status
                </span>

                <strong className="block wrap-break-word text-lg leading-6 text-text-heading">
                  {historicalState.status}
                </strong>
              </div>

              <div className="min-h-25 rounded-[10px] border border-border bg-bg-input p-4.5">
                <span className="mb-2 block text-[13px] text-text-secondary">
                  Location
                </span>

                <strong className="block wrap-break-word text-lg leading-6 text-text-heading">
                  {historicalState.currentLocation || "--"}
                </strong>
              </div>

              <div className="min-h-25 rounded-[10px] border border-border bg-bg-input p-4.5">
                <span className="mb-2 block text-[13px] text-text-secondary">
                  Temperature
                </span>

                <strong className="block text-lg leading-6 text-text-heading">
                  {historicalState.temperature !== null &&
                  historicalState.temperature !== undefined
                    ? `${historicalState.temperature}°C`
                    : "--"}
                </strong>
              </div>
            </div>
          ) : (
            <div className="flex min-h-28 items-center justify-center rounded-[10px] border border-border bg-bg-input p-6 text-center text-sm text-text-secondary">
              No shipment state exists at the selected time.
            </div>
          )}
        </section>

        {/* Time Travel */}
        <section className="min-w-0 rounded-[14px] border border-border bg-bg-card p-4.5 shadow-sm sm:p-6">
          <div className="mb-7 flex min-w-0 flex-col items-start justify-between gap-5 sm:flex-row sm:items-center sm:gap-8">
            <div className="min-w-0">
              <h2 className="mb-1.5 text-xl font-bold text-text-heading">
                Time Travel
              </h2>

              <p className="text-[14px] leading-5 text-text-secondary">
                Move through the shipment history.
              </p>
            </div>

            <div className="w-full shrink-0 text-left sm:w-auto sm:text-right">
              <span className="inline-flex rounded-lg bg-primary px-3.5 py-2 font-semibold text-text-heading shadow-sm">
                {formatTime(selectedDate)}
              </span>

              <p className="mt-2 text-xs text-text-secondary">
                {formatDateTime(selectedDate)}
              </p>

              <p className="mt-1 text-xs font-semibold text-primary">
                Event {selectedEventIndex + 1} of {events.length}
              </p>
            </div>
          </div>

          {/* Event-based slider */}
          <div className="relative min-w-0 px-1">
            <input
              type="range"
              min="0"
              max={events.length - 1}
              step="1"
              value={selectedEventIndex}
              onChange={handleSliderChange}
              aria-label="Select historical event"
              className="w-full cursor-pointer accent-primary"
            />
          </div>

          {/* Slider labels */}
          <div className="mt-4 flex min-w-0 justify-between gap-1 overflow-hidden text-[11px] text-text-secondary sm:gap-2 sm:text-[13px]">
            {events.map((event, index) => {
              const isActive = selectedEventIndex === index;

              return (
                <button
                  key={event._id || event.recordedAt}
                  type="button"
                  onClick={() => handleEventSelection(index)}
                  aria-current={isActive ? "step" : undefined}
                  className={`min-w-0 flex-1 overflow-hidden rounded-lg px-1.5 py-1.5 text-center transition-all ${
                    isActive
                      ? "bg-primary/10 font-bold text-primary"
                      : "text-text-secondary hover:bg-bg-input hover:text-text-heading"
                  }`}
                >
                  <span className="block truncate">
                    {formatTimelineDate(event.recordedAt)} •{" "}
                    {formatTime(event.recordedAt)}
                  </span>

                  <span className="mt-0.5 hidden truncate sm:block">
                    {event.eventType}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Event Timeline */}
        <section className="min-w-0 rounded-[14px] border border-border bg-bg-card p-4.5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="mb-1.5 text-xl font-bold text-text-heading">
              Event Timeline
            </h2>

            <p className="text-[14px] leading-5 text-text-secondary">
              Events recorded for this shipment.
            </p>
          </div>

          <div className="min-w-0 flex flex-col gap-4">
            {events.map((event, index) => {
              const isActive = selectedEventIndex === index;

              return (
                <button
                  key={event._id || event.recordedAt}
                  type="button"
                  onClick={() => handleEventSelection(index)}
                  aria-current={isActive ? "step" : undefined}
                  className="group flex w-full min-w-0 cursor-pointer gap-3 text-left sm:gap-4"
                >
                  {/* Marker */}
                  <div
                    className={`flex h-7 w-7 min-w-7 items-center justify-center self-start rounded-full text-xs transition-all sm:h-8 sm:w-8 sm:min-w-8 ${
                      isActive
                        ? "bg-primary font-bold text-text-heading shadow-[0_0_0_4px_rgba(255,255,255,0.05)]"
                        : "bg-border text-text-secondary group-hover:bg-primary/30 group-hover:text-text-heading"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Event content */}
                  <div
                    className={`min-w-0 flex-1 rounded-[10px] border bg-bg-card p-4 transition-all sm:p-4.5 ${
                      isActive
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-bg-input/40"
                    }`}
                  >
                    <div className="flex min-w-0 flex-col justify-between gap-3 sm:flex-row sm:gap-6">
                      <div className="min-w-0">
                        <h3 className="mb-1 truncate text-base font-semibold text-text-heading">
                          {getEventStatus(event)}
                        </h3>

                        <p className="mt-1 truncate text-xs font-semibold tracking-[0.5px] text-primary">
                          {event.eventType}
                        </p>

                        <p className="mt-1 truncate text-[13px] text-text-secondary">
                          {getEventLocation(event)}
                        </p>
                      </div>

                      <span className="shrink-0 text-left font-bold text-primary sm:text-right">
                        <span className="block">
                          {formatTimelineDate(event.recordedAt)} •{" "}
                          {formatTime(event.recordedAt)}
                        </span>

                        {isActive && (
                          <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wide text-success">
                            Selected
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center">
                      <p className="text-[13px] text-text-secondary">
                        Temperature: {getEventTemperature(event)}
                      </p>
                    </div>

                    <p className="mt-2 leading-6 text-[13px] text-text-secondary">
                      {event.payload?.details ||
                        "Event recorded in the audit trail."}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HistoricalState;