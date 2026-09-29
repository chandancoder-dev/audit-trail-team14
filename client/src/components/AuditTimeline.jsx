import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [order, setOrder] = useState('newest');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [copied, setCopied] = useState(false);
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
      <div className="text-sm text-[#a0a0a5] p-6 bg-[#1c1c1e] min-h-screen">
        Loading shipment events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-400 p-6 bg-[#1c1c1e] min-h-screen">
        {error}
      </div>
    );
  }

  if (!sortedEvents.length) {
    return (
      <div className="text-sm text-[#a0a0a5] italic p-6 bg-[#1c1c1e] min-h-screen">
        No events recorded yet.
      </div>
    );
  }

  return (
    // Full-width background: covers the whole page, no side strips
    <div className="min-h-screen w-full bg-[#1c1c1e]">
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => navigate(`/shipment/${id}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#262628] hover:bg-[#333336] border border-[#3a3a3d] rounded-lg px-4 py-2 mb-5 transition-colors"
        >
          <span aria-hidden="true">←</span> Back to Shipment
        </button>

        <h1 className="text-3xl font-bold text-white mb-1">
          Audit Timeline
        </h1>

        <p className="text-[#a0a0a5] mb-6">
          Full event history for shipment {id}.
        </p>

        {/* No boxed panel: cards sit directly on the page background */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Event History
              </h2>

              <p className="text-sm text-[#a0a0a5]">
                Chronological record of all shipment events.
              </p>
            </div>

            <button
              onClick={() =>
                setOrder((o) =>
                  o === 'newest' ? 'oldest' : 'newest'
                )
              }
              className="text-sm font-medium border border-[#3a3a3d] rounded-md px-4 py-2 bg-[#262628] hover:bg-[#333336] text-white transition-colors"
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
              className="bg-[#262628] border border-[#3a3a3d] rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative px-6 pt-7 pb-5 border-b border-[#3a3a3d]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-2xl shrink-0">
                      📦
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block text-[11px] font-semibold bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-full mb-1.5">
                        Version {selectedEvent.version}
                      </span>
                      <h3 className="text-2xl font-bold text-white leading-tight">
                        {formatEventType(selectedEvent.eventType)}
                      </h3>
                      <p className="text-sm text-[#a0a0a5] mt-1">
                        🕒 {formatFullDate(selectedEvent.recordedAt)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-[#a0a0a5] hover:text-white hover:bg-[#333336] rounded-full w-8 h-8 flex items-center justify-center transition-colors shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {/* Event ID with copy button */}
                <div className="mt-4 flex items-center gap-2 bg-[#1c1c1e] border border-[#3a3a3d] rounded-lg px-3 py-2">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#a0a0a5] shrink-0">
                    Event ID
                  </span>
                  <span className="text-xs font-mono text-white truncate flex-1">
                    {selectedEvent._id}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedEvent._id);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="text-[11px] font-semibold text-indigo-300 hover:text-white bg-indigo-950 hover:bg-indigo-600 rounded-md px-2.5 py-1 transition-colors shrink-0"
                  >
                    {copied ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-7 overflow-y-auto">
                <EventPayloadViewer payload={selectedEvent.payload} />
                <EventMetadataViewer metadata={selectedEvent.metadata} />
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#3a3a3d] bg-[#1c1c1e]/50 flex justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-8 py-2.5 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}