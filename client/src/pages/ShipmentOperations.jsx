function ShipmentOperations() {
  return (
    <div className="min-h-screen bg-[#18181B] px-5 py-10 font-sans">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#FAFAFA]">
            Shipment Operations
          </h1>

          <p className="text-sm text-[#A1A1AA]">
            Create and manage shipment lifecycle events.
          </p>
        </div>

        {/* Create Shipment Card */}
        <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 shadow-lg">
          <h2 className="mb-2 text-2xl font-semibold text-[#FAFAFA]">
            Create Shipment
          </h2>

          <p className="mb-7 text-sm text-[#A1A1AA]">
            Start a new shipment and create its initial event stream.
          </p>

          {/* Shipment ID */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Shipment ID
            </label>

            <input
              type="text"
              placeholder="Enter shipment ID"
              className="w-full rounded-lg border border-[#3F3F46] bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
            />
          </div>

          {/* Origin */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Origin
            </label>

            <input
              type="text"
              placeholder="Enter origin location"
              className="w-full rounded-lg border border-[#3F3F46] bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
            />
          </div>

          {/* Destination */}
          <div className="mb-7">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Destination
            </label>

            <input
              type="text"
              placeholder="Enter destination location"
              className="w-full rounded-lg border border-[#3F3F46] bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
            />
          </div>

          {/* Create Button */}
          <button
            type="button"
            className="w-full rounded-lg bg-[#3B82F6] px-4 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
          >
            Create Shipment
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShipmentOperations;