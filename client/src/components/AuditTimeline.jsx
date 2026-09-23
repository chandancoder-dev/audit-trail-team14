import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { queryAPI } from '../services/api';
import EventCard from './EventCard';
import EventPayloadViewer from './EventPayloadViewer';
import EventMetadataViewer from './EventMetadataViewer';

function formatEventType(eventType) {
  return eventType
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatFullDate(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function AuditTimeline() {
  const { id } = useParams();

  const [events, setEvents] = useState([]);
  const [order, setOrder] = useState('newest');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await queryAPI.getShipmentTimeline(id);

        setEvents(Array.isArray(data) ? data : data.events || []);
      } catch (err) {
        setError(err.message || 'Failed to load shipment events.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEvents();
    }
  }, [id]);

  const sortedEvents = [...events].sort((a, b) => {
    const diff = new Date(a.recordedAt) - new Date(b.recordedAt);
    return order === 'newest' ? -diff : diff;
  });

  if (loading) {
    return (
      <div className="text-sm text-slate-400 p-6 bg-gray-900 min-h-screen">
        Loading shipment events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-400 p-6 bg-gray-900 min-h-screen">
        {error}
      </div>
    );
  }

  if (!sortedEvents.length) {
    return (
      <div className="text-sm text-slate-400 italic p-6 bg-gray-900 min-h-screen">
        No events recorded yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-1">
        Audit Timeline
      </h1>

      <p className="text-slate-400 mb-6">
        Full event history for shipment {id}.
      </p>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              Event History
            </h2>

            <p className="text-sm text-slate-400">
              Chronological record of all shipment events.
            </p>
          </div>

          <button
            onClick={() =>
              setOrder((o) =>
                o === 'newest' ? 'oldest' : 'newest'
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative px-6 pt-6 pb-5 border-b border-gray-700">
              <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-2xl" />

              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block text-[11px] font-semibold bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-full mb-2">
                    Version {selectedEvent.version}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {formatEventType(selectedEvent.eventType)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatFullDate(selectedEvent.recordedAt)} · ID: {selectedEvent._id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-white hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5 overflow-y-auto">
              <EventPayloadViewer payload={selectedEvent.payload} />
              <EventMetadataViewer metadata={selectedEvent.metadata} />
            </div>

            <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/50">
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-lg py-2.5 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}