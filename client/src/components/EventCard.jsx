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
    <div className="bg-[#262628] rounded-2xl border border-[#3a3a3d] hover:border-[#4a4a4e] p-5 transition-all duration-200 w-full min-h-[13rem] flex flex-col gap-2 hover:-translate-y-0.5">
      {/* Top row: version badge + arrow */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full">
          v{version}
        </span>
        <span className="text-[#a0a0a5] text-sm leading-none">›</span>
      </div>

      {/* Title */}
      <h3 className="text-[19px] font-bold text-white leading-snug line-clamp-2">
        {formatEventType(eventType)}
      </h3>

      {/* Spacer pushes date/time to the bottom */}
      <div className="flex-1" />

      {/* Date + time */}
      <div className="flex flex-col gap-0.5 text-[14px] text-[#a0a0a5] pt-2 border-t border-[#3a3a3d]">
        <span className="font-medium text-white">
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