// "originCity" / "origin_city" -> "Origin City"
function formatLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderValue(value) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-[#6b6b70] italic text-base">Not provided</span>;
  }
  if (typeof value === 'boolean') {
    return (
      <span
        className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${
          value ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
        }`}
      >
        {value ? 'Yes' : 'No'}
      </span>
    );
  }
  if (typeof value === 'object') {
    return (
      <pre className="text-xs text-white font-mono whitespace-pre-wrap break-all">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }
  return (
    <span className="text-lg font-semibold text-white break-words">
      {String(value)}
    </span>
  );
}

export default function EventPayloadViewer({ payload }) {
  const entries = payload ? Object.entries(payload) : [];

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <h4 className="text-sm font-bold text-white">Payload</h4>
        <span className="text-[11px] font-semibold text-[#a0a0a5] bg-[#333336] px-2 py-0.5 rounded-full">
          {entries.length} {entries.length === 1 ? 'field' : 'fields'}
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-[#6b6b70] italic border border-dashed border-[#3a3a3d] rounded-xl px-4 py-4 text-center">
          No payload data for this event.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="bg-[#1c1c1e] border border-[#3a3a3d] rounded-xl p-4 hover:border-indigo-500/50 transition-colors"
            >
              <span className="block text-[11px] font-semibold tracking-wider uppercase text-[#a0a0a5] mb-2">
                {formatLabel(key)}
              </span>
              {renderValue(value)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
