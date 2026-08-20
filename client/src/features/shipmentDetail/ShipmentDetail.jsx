import React from "react";

const mockShipment = {
  shipmentId: "SHIP-001",
  containerId: "CONT-001",
  status: "In Transit",
  location: "Arabian Sea",
  temperature: 24,
  version: 2,
};

function ShipmentDetail() {
  return (
    <div className="min-h-screen bg-[#18181B] px-4 py-8 text-[#D4D4D8] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#3B82F6]">
              Audit Trail
            </p>

            <h1 className="text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
              Shipment Details
            </h1>

            <p className="mt-2 text-[#A1A1AA]">
              View the current state and information of this shipment.
            </p>
          </div>

          {/* Shipment Identifier */}
          <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] px-5 py-4">
            <p className="text-sm text-[#A1A1AA]">Shipment ID</p>
            <p className="mt-1 text-lg font-semibold text-[#FAFAFA]">
              {mockShipment.shipmentId}
            </p>
          </div>
        </div>

        {/* Shipment Header Card */}
        <section className="mb-6 rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm text-[#A1A1AA]">Container</p>

              <h2 className="mt-1 text-2xl font-semibold text-[#FAFAFA]">
                {mockShipment.containerId}
              </h2>

              <p className="mt-2 text-sm text-[#A1A1AA]">
                Shipment {mockShipment.shipmentId}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 self-start rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-2 sm:self-auto">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />

              <span className="text-sm font-semibold text-[#22C55E]">
                {mockShipment.status}
              </span>
            </div>
          </div>
        </section>

        {/* Current State */}
        <section className="mb-6 rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#FAFAFA]">
              Current State
            </h2>

            <p className="mt-1 text-sm text-[#A1A1AA]">
              Latest reconstructed state of the shipment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Status */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#202023] p-5">
              <p className="text-sm font-medium text-[#A1A1AA]">
                Status
              </p>

              <p className="mt-3 text-xl font-semibold text-[#22C55E]">
                {mockShipment.status}
              </p>
            </div>

            {/* Location */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#202023] p-5">
              <p className="text-sm font-medium text-[#A1A1AA]">
                Current Location
              </p>

              <p className="mt-3 text-xl font-semibold text-[#FAFAFA]">
                {mockShipment.location}
              </p>
            </div>

            {/* Temperature */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#202023] p-5">
              <p className="text-sm font-medium text-[#A1A1AA]">
                Temperature
              </p>

              <p className="mt-3 text-xl font-semibold text-[#FAFAFA]">
                {mockShipment.temperature}°C
              </p>
            </div>

            {/* Version */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#202023] p-5">
              <p className="text-sm font-medium text-[#A1A1AA]">
                Event Version
              </p>

              <p className="mt-3 text-xl font-semibold text-[#3B82F6]">
                v{mockShipment.version}
              </p>
            </div>

          </div>
        </section>

        {/* Shipment Information */}
        <section className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#FAFAFA]">
              Shipment Information
            </h2>

            <p className="mt-1 text-sm text-[#A1A1AA]">
              Basic information associated with this shipment.
            </p>
          </div>

          <div className="divide-y divide-[#3F3F46]">

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Shipment ID
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {mockShipment.shipmentId}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Container ID
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {mockShipment.containerId}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Current Location
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {mockShipment.location}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Temperature
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {mockShipment.temperature}°C
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Event Version
              </span>

              <span className="font-medium text-[#3B82F6]">
                Version {mockShipment.version}
              </span>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}

export default ShipmentDetail;