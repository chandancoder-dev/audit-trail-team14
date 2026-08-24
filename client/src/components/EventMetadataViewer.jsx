/**
 * EventMetadataViewer
 * --------------------
 * Renders an event's metadata as a simple key-value list.
 */
export default function EventMetadataViewer({ metadata }) {
  const entries = metadata ? Object.entries(metadata) : [];
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
        Metadata
      </div>
      {entries.length === 0 ? (
        <div className="text-xs italic text-slate-300">No metadata</div>
      ) : (
        <dl className="space-y-1">
          {entries.map(([key, value]) => (
            <div key={key} className="flex gap-2 text-xs">
              <dt className="min-w-[90px] text-slate-400">{key}</dt>
              <dd className="text-white">{String(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}