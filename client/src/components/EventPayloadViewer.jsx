/**
 * EventPayloadViewer
 * -------------------
 * Renders an event's payload as readable, formatted JSON.
 */
export default function EventPayloadViewer({ payload }) {
  const isEmpty = !payload || Object.keys(payload).length === 0;

  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
        Payload
      </div>
      {isEmpty ? (
        <div className="text-xs italic text-slate-300">No payload data</div>
      ) : (
        <pre className="bg-black text-white text-xs rounded-lg p-3 overflow-x-auto border border-slate-700">
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}
    </div>
  );
}