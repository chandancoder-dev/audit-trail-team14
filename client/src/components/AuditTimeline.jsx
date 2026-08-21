import { useState, useMemo } from "react";
import EventCard from "./EventCard";

const mockEvents = [
  {
    _id: "event-001",
    eventType: "CONTAINER_CREATED",
    version: 1,
    recordedAt: "2026-08-21T12:00:00",
    payload: {
      containerId: "CONT-001",
      status: "Created",
      location: "Warehouse",
    },
    metadata: {
      source: "System",
      user: "Admin",
    },
  },
  {
    _id: "event-002",
    eventType: "LOADED_ON_SHIP",
    version: 2,
    recordedAt: "2026-08-21T12:30:00",
    payload: {
      containerId: "CONT-001",
      status: "In Transit",
      location: "Port A",
    },
    metadata: {
      source: "Shipment Service",
      user: "Operator",
    },
  },
  {
    _id: "event-003",
    eventType: "TEMPERATURE_SPIKE",
    version: 3,
    recordedAt: "2026-08-21T13:15:00",
    payload: {
      containerId: "CONT-001",
      status: "Temperature Alert",
      temperature: "31°C",
      location: "At Sea",
    },
    metadata: {
      source: "Temperature Sensor",
      user: "System",
    },
  },
  {
    _id: "event-004",
    eventType: "ARRIVED_AT_PORT",
    version: 4,
    recordedAt: "2026-08-21T14:00:00",
    payload: {
      containerId: "CONT-001",
      status: "Arrived",
      location: "Port B",
    },
    metadata: {
      source: "Port System",
      user: "Operator",
    },
  },
];

function formatEventType(eventType) {
  return eventType
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatTimestamp(isoString) {
  return new Date(isoString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AuditTimeline({ events = mockEvents }) {
  const [order, setOrder] = useState("newest");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const sortedEvents = useMemo(() => {
    const copy = [...events];

    copy.sort((a, b) => {
      const diff = new Date(a.recordedAt) - new Date(b.recordedAt);

      return order === "newest" ? -diff : diff;
    });

    return copy;
  }, [events, order]);

  if (!sortedEvents.length) {
    return (
      <div className="text-sm text-slate-400 italic p-6 bg-gray-900 min-h-screen">
        No events recorded yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-1">Audit Timeline</h1>

      <p className="text-slate-400 mb-6">
        View the full event history for this shipment.
      </p>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Event History</h2>

            <p className="text-sm text-slate-400">
              Chronological record of all shipment events.
            </p>
          </div>

          <button
            onClick={() =>
              setOrder((currentOrder) =>
                currentOrder === "newest" ? "oldest" : "newest",
              )
            }
            className="text-sm font-medium border border-gray-600 rounded-md px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white transition-colors"
          >
            Sort: {order === "newest" ? "Newest first" : "Oldest first"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onClick={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      </div>

      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl max-w-lg w-full p-5 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {formatEventType(selectedEvent.eventType)}
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  v{selectedEvent.version} · {selectedEvent._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">
                  Payload
                </h4>

                <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto">
                  {JSON.stringify(selectedEvent.payload, null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-2">
                  Metadata
                </h4>

                <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto">
                  {JSON.stringify(selectedEvent.metadata, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
