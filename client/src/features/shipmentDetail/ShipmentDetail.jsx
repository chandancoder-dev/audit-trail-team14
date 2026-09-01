import React from "react";
import { useParams, Link } from "react-router-dom";
import { mockShipment, shipmentEvents } from "./shipmentData";


function ShipmentDetail() {
  const { shipmentId } = useParams();

  // For now we use mock data.
  // Later this will come from GET /shipment/:id
  const shipment = {
    ...mockShipment,
    shipmentId: shipmentId || mockShipment.shipmentId,
  };

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
              View the current state and event history of this shipment.
            </p>
          </div>

          {/* Shipment ID + Actions */}
          <div className="flex flex-col gap-4 sm:items-end">
            {/* Shipment ID */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] px-5 py-4">
              <p className="text-sm text-[#A1A1AA]">
                Shipment ID
              </p>

              <p className="mt-1 text-lg font-semibold text-[#FAFAFA]">
                {shipment.shipmentId}
              </p>
            </div>

            {/* Navigation Actions — go to  Analytics & Alerts pages */}
            <div className="flex gap-3">
              <Link
                to={`/shipment/${shipment.shipmentId}/analytics`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2563EB]"
              >
                📊 View Analytics
              </Link>

              <Link
                to="/alerts"
                className="inline-flex items-center gap-2 rounded-lg border border-[#3B82F6] px-4 py-2 text-sm font-semibold text-[#3B82F6] transition-colors hover:bg-[#3B82F6] hover:text-white"
              >
                🔔 View Alerts
              </Link>
            </div>
          </div>
        </div>

        {/* Shipment Header */}
        <section className="mb-6 rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm text-[#A1A1AA]">
                Container
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-[#FAFAFA]">
                {shipment.containerId}
              </h2>

              <p className="mt-2 text-sm text-[#A1A1AA]">
                Shipment {shipment.shipmentId}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 self-start rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-2 sm:self-auto">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />

              <span className="text-sm font-semibold text-[#22C55E]">
                {shipment.status}
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
                {shipment.status}
              </p>
            </div>

            {/* Location */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#202023] p-5">
              <p className="text-sm font-medium text-[#A1A1AA]">
                Current Location
              </p>

              <p className="mt-3 text-xl font-semibold text-[#FAFAFA]">
                {shipment.location}
              </p>
            </div>

            {/* Temperature */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#202023] p-5">
              <p className="text-sm font-medium text-[#A1A1AA]">
                Temperature
              </p>

              <p className="mt-3 text-xl font-semibold text-[#FAFAFA]">
                {shipment.temperature}°C
              </p>
            </div>

            {/* Version */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#202023] p-5">
              <p className="text-sm font-medium text-[#A78BFA]">
                Event Version
              </p>

              <p className="mt-3 text-xl font-semibold text-[#3B82F6]">
                v{shipment.version}
              </p>
            </div>

          </div>
        </section>

        {/* Shipment Information */}
        <section className="mb-6 rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6">

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
                {shipment.shipmentId}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Container ID
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {shipment.containerId}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Current Location
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {shipment.location}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Temperature
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {shipment.temperature}°C
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Event Version
              </span>

              <span className="font-medium text-[#3B82F6]">
                Version {shipment.version}
              </span>
            </div>

          </div>
        </section>

        {/* Event Timeline */}
        <section className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6">

          <div className="mb-8">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="text-xl font-semibold text-[#FAFAFA]">
        Event Timeline
      </h2>

      <p className="mt-1 text-sm text-[#A1A1AA]">
        Complete chronological history of shipment events.
      </p>
    </div>

    <div className="rounded-xl border border-[#3F3F46] bg-[#202023] px-4 py-3">
      <p className="text-xs text-[#71717A]">
        Total Events
      </p>

      <p className="mt-1 text-lg font-semibold text-[#3B82F6]">
        {shipmentEvents.length}
      </p>
    </div>
  </div>
</div>

          <div className="relative">

            {/* Timeline Line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#3F3F46]" />

            <div className="space-y-8">

              {shipmentEvents.map((event) => (
                <div
                  key={event.id}
                  className="relative flex gap-5"
                >

                  {/* Timeline Dot */}
                  <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-[#27272A] bg-[#3B82F6]" />

                  {/* Event Content */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                      <div>
                        <h3 className="font-semibold text-[#FAFAFA]">
                          {event.title}
                        </h3>

                        <p className="mt-1 text-xs font-medium tracking-wide text-[#3B82F6]">
                          {event.eventType}
                        </p>
                      </div>

                      <span className="text-sm text-[#A1A1AA]">
                        {event.timestamp}
                      </span>

                    </div>

                    {/* Event Details */}
                    <div className="mt-4 rounded-xl border border-[#3F3F46] bg-[#202023] p-4">

                      <p className="text-sm leading-6 text-[#A1A1AA]">
                        {event.description}
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

                        <div>
                          <p className="text-xs text-[#71717A]">
                            Location
                          </p>

                          <p className="mt-1 text-sm font-medium text-[#FAFAFA]">
                            {event.location}
                          </p>
                        </div>

                        {event.temperature && (
                          <div>
                            <p className="text-xs text-[#71717A]">
                              Temperature
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#FAFAFA]">
                              {event.temperature}°C
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-xs text-[#71717A]">
                            Version
                          </p>

                          <p className="mt-1 text-sm font-medium text-[#3B82F6]">
                            v{event.version}
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          </div>

        </section>

      </div>
    </div>
  );
}

export default ShipmentDetail;