function ConflictDialog({ conflict, onRefresh, onClose }) {
  if (!conflict) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6 shadow-2xl">

        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl mt-0.5">⚠️</span>
          <div>
            <h2
              id="conflict-title"
              className="text-lg font-semibold text-[#FAFAFA]"
            >
              Data Has Changed
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-1">
              This shipment was modified by another operation while you were working.
            </p>
          </div>
        </div>

        {/* Version info */}
        <div className="rounded-lg border border-[#3F3F46] bg-[#202023] p-4 mb-6 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-[#A1A1AA]">Your version</span>
            <span className="font-mono text-[#EF4444]">v{conflict.expectedVersion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A1A1AA]">Current version</span>
            <span className="font-mono text-[#22C55E]">v{conflict.currentVersion}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="flex-1 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
          >
            Refresh & Retry
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#3F3F46] px-4 py-2.5 text-sm font-semibold text-[#A1A1AA] transition hover:border-[#71717A] hover:text-[#FAFAFA]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConflictDialog;
