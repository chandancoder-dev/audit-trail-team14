/**
 * EventMetadataViewer
 * --------------------
 * Renders an event's metadata as a clean, readable key-value list.
 */
function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export default function EventMetadataViewer({ metadata }) {
  const entries = metadata ? Object.entries(metadata) : [];

  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
        Metadata
      </div>
      {entries.length === 0 ? (
        <div className="text-xs italic text-slate-300">No metadata</div>
      ) : (
        <div className="bg-gray-900 border border-gray-700 rounded-lg divide-y divide-gray-700">
          {entries.map(([key, value]) => (
            <div key={key} className="flex justify-between items-center px-3 py-2 text-xs">
              <span className="text-slate-400">{formatKey(key)}</span>
              <span className="text-white font-medium">{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}