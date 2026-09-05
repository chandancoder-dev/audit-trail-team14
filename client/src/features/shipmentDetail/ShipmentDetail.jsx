import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { queryAPI } from "../../services/api";

function formatDate(dateValue) {
  if (!dateValue) return "—";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getEventTitle(eventType) {
  switch (eventType) {
    case "SHIPMENT_CREATED":
      return "Shipment Created";

    case "LOADED_ON_SHIP":
      return "Loaded on Ship";

    case "TEMPERATURE_SPIKE":
      return "Temperature Spike";

    case "ARRIVED_AT_PORT":
      return "Arrived at Port";

    default:
      return eventType;
  }
}

function getEventDescription(event) {
  const payload = event.payload || {};

  switch (event.eventType) {
    case "SHIPMENT_CREATED":
      return `Shipment ${event.shipmentId} was created from ${
        payload.origin || "unknown origin"
      } to ${payload.destination || "unknown destination"}.`;

    case "LOADED_ON_SHIP":
      return `Shipment moved to ${
        payload.location || "the next location"
      }.`;

    case "TEMPERATURE_SPIKE":
      return `Temperature event recorded at ${
        payload.temperature ?? "unknown"
      }°C.`;

    case "ARRIVED_AT_PORT":
      return `Shipment arrived at ${
        payload.port || payload.location || "the destination port"
      }.`;

    default:
      return "Shipment event recorded.";
  }
}

function ShipmentDetail() {
  const { shipmentId } = useParams();

  const [shipment, setShipment] = useState(null);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShipmentDetails = async () => {
      if (!shipmentId) {
        setError("Shipment ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [shipmentData, eventData] = await Promise.all([
          queryAPI.getShipment(shipmentId),
          queryAPI.getShipmentEvents(shipmentId),
        ]);

        setShipment(shipmentData);
        setEvents(Array.isArray(eventData) ? eventData : []);
      } catch (err) {
        console.error("Failed to load shipment details:", err);

        setError(
          err.message ||
            "Failed to load shipment details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShipmentDetails();
  }, [shipmentId]);

  // ------------------------------------------------------------
  // Loading State
  // ------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#18181B] px-4 text-[#D4D4D8]">
        <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] px-8 py-6 text-center">
          <p className="text-lg font-semibold text-[#FAFAFA]">
            Loading shipment...
          </p>

          <p className="mt-2 text-sm text-[#A1A1AA]">
            Fetching current state and event history.
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // Error State
  // ------------------------------------------------------------
  if (error || !shipment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#18181B] px-4 text-[#D4D4D8]">
        <div className="w-full max-w-lg rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 text-center">
          <h1 className="text-2xl font-bold text-[#FAFAFA]">
            Shipment Not Found
          </h1>

          <p className="mt-3 text-sm text-[#A1A1AA]">
            {error || "Unable to load this shipment."}
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const status = shipment.status || "unknown";
  const location =
    shipment.currentLocation || "—";
  const temperature =
    shipment.lastTemperature ?? "—";
  const version =
    shipment.lastVersion ?? 0;

  return (
    <div className="min-h-screen bg-[#18181B] px-4 py-8 text-[#D4D4D8] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
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

            {/* Actions */}
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

        {/* =====================================================
            SHIPMENT HEADER
        ====================================================== */}
        <section className="mb-6 rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm text-[#A1A1AA]">
                Shipment
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-[#FAFAFA]">
                {shipment.shipmentId}
              </h2>

              <p className="mt-2 text-sm text-[#A1A1AA]">
                {shipment.origin || "—"} →{" "}
                {shipment.destination || "—"}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-2 sm:self-auto">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />

              <span className="text-sm font-semibold capitalize text-[#22C55E]">
                {status.replace("_", " ")}
              </span>
            </div>

          </div>
        </section>

        {/* =====================================================
            CURRENT STATE
        ====================================================== */}
        <section className="mb-6 rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#FAFAFA]">
              Current State
            </h2>

            <p className="mt-1 text-sm text-[#A1A1AA]">
              Latest state from the shipment read model.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Status */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#202023] p-5">
              <p className="text-sm font-medium text-[#A1A1AA]">
                Status
              </p>

              <p className="mt-3 text-xl font-semibold capitalize text-[#22C55E]">
                {status.replace("_", " ")}
              </p>
            </div>

            {/* Location */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#202023] p-5">
              <p className="text-sm font-medium text-[#A1A1AA]">
                Current Location
              </p>

              <p className="mt-3 text-xl font-semibold text-[#FAFAFA]">
                {location}
              </p>
            </div>

            {/* Temperature */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#202023] p-5">
              <p className="text-sm font-medium text-[#A1A1AA]">
                Temperature
              </p>

              <p className="mt-3 text-xl font-semibold text-[#FAFAFA]">
                {temperature === "—"
                  ? "—"
                  : `${temperature}°C`}
              </p>
            </div>

            {/* Version */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#202023] p-5">
              <p className="text-sm font-medium text-[#A78BFA]">
                Event Version
              </p>

              <p className="mt-3 text-xl font-semibold text-[#3B82F6]">
                v{version}
              </p>
            </div>

          </div>
        </section>

        {/* =====================================================
            SHIPMENT INFORMATION
        ====================================================== */}
        <section className="mb-6 rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#FAFAFA]">
              Shipment Information
            </h2>

            <p className="mt-1 text-sm text-[#A1A1AA]">
              Information maintained by the shipment read model.
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
                Origin
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {shipment.origin || "—"}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Destination
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {shipment.destination || "—"}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Current Location
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {location}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Temperature
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {temperature === "—"
                  ? "—"
                  : `${temperature}°C`}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Total Events
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {shipment.eventCount ?? events.length}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Event Version
              </span>

              <span className="font-medium text-[#3B82F6]">
                Version {version}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#A1A1AA]">
                Last Event
              </span>

              <span className="font-medium text-[#FAFAFA]">
                {formatDate(shipment.lastEventAt)}
              </span>
            </div>

          </div>
        </section>

        {/* =====================================================
            EVENT TIMELINE
        ====================================================== */}
        <section className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6">

          <div className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h2 className="text-xl font-semibold text-[#FAFAFA]">
                  Event Timeline
                </h2>

                <p className="mt-1 text-sm text-[#A1A1AA]">
                  Complete chronological history from the immutable Event Store.
                </p>
              </div>

              <div className="rounded-xl border border-[#3F3F46] bg-[#202023] px-4 py-3">
                <p className="text-xs text-[#71717A]">
                  Total Events
                </p>

                <p className="mt-1 text-lg font-semibold text-[#3B82F6]">
                  {events.length}
                </p>
              </div>

            </div>
          </div>

          {events.length === 0 ? (
            <div className="rounded-xl border border-[#3F3F46] bg-[#202023] p-6 text-center">
              <p className="text-sm text-[#A1A1AA]">
                No events found for this shipment.
              </p>
            </div>
          ) : (
            <div className="relative">

              {/* Timeline line */}
              <div className="absolute bottom-2 left-[7px] top-2 w-px bg-[#3F3F46]" />

              <div className="space-y-8">

                {events.map((event) => {
                  const payload = event.payload || {};

                  return (
                    <div
                      key={event._id || `${event.shipmentId}-${event.version}`}
                      className="relative flex gap-5"
                    >

                      {/* Timeline Dot */}
                      <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-[#27272A] bg-[#3B82F6]" />

                      {/* Event Content */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                          <div>
                            <h3 className="font-semibold text-[#FAFAFA]">
                              {getEventTitle(event.eventType)}
                            </h3>

                            <p className="mt-1 text-xs font-medium tracking-wide text-[#3B82F6]">
                              {event.eventType}
                            </p>
                          </div>

                          <span className="text-sm text-[#A1A1AA]">
                            {formatDate(event.recordedAt)}
                          </span>

                        </div>

                        {/* Event Details */}
                        <div className="mt-4 rounded-xl border border-[#3F3F46] bg-[#202023] p-4">

                          <p className="text-sm leading-6 text-[#A1A1AA]">
                            {getEventDescription(event)}
                          </p>

                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

                            {/* Location */}
                            <div>
                              <p className="text-xs text-[#71717A]">
                                Location
                              </p>

                              <p className="mt-1 text-sm font-medium text-[#FAFAFA]">
                                {payload.location ||
                                  payload.origin ||
                                  "—"}
                              </p>
                            </div>

                            {/* Temperature */}
                            <div>
                              <p className="text-xs text-[#71717A]">
                                Temperature
                              </p>

                              <p className="mt-1 text-sm font-medium text-[#FAFAFA]">
                                {payload.temperature !==
                                undefined
                                  ? `${payload.temperature}°C`
                                  : "—"}
                              </p>
                            </div>

                            {/* Version */}
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
                  );
                })}

              </div>
            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default ShipmentDetail;