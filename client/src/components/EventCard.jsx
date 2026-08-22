function formatEventType(eventType) {
  return eventType
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatTimestamp(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function EventCard({ event, onClick }) {
  const { eventType, version, recordedAt } = event;

  return (
    <div className="bg-gray-900 rounded-xl shadow-sm hover:shadow-md border border-gray-700 pt-3 pb-5 pl-3 pr-14 transition-all duration-200 w-full max-w-[340px] h-48 mb-6 flex flex-col gap-1.5 hover:-translate-y-0.5">
      {/* Top row: version badge + arrow */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full">
          v{version}
        </span>
        <span className="text-gray-500 text-sm leading-none">›</span>
      </div>

      {/* Title */}
      <h3 className="text-[19px] font-bold text-white leading-snug line-clamp-2">
        {formatEventType(eventType)}
      </h3>

      {/* Spacer pushes date/time to the bottom */}
      <div className="flex-1" />

      {/* Date + time */}
      <div className="flex flex-col gap-0.5 text-[14px] text-gray-400 pt-1.5 border-t border-gray-700">
        <span className="font-medium text-gray-300">
          {formatTimestamp(recordedAt)}
        </span>
        <span>{formatTime(recordedAt)}</span>
      </div>

      {/* View details button, pinned to the right */}
      <div className="flex justify-end mt-1">
        <button
          onClick={onClick}
          className="text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-5 py-2.5 transition-colors"
        >
          View details
        </button>
      </div>
    </div>
  );
}