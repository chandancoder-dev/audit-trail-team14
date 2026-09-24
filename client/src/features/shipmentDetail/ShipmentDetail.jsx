import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { queryAPI } from "../../services/api";

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
      return eventType
        ? eventType
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())
        : "Unknown Event";
  }
}

function getEventDescription(event) {
  switch (event.eventType) {
    case "SHIPMENT_CREATED":
      return "Shipment was created and added to the event store.";

    case "LOADED_ON_SHIP":
      return "Shipment was loaded onto the vessel and is now in transit.";

    case "TEMPERATURE_SPIKE":
      return "A temperature spike was recorded for this shipment.";

    case "ARRIVED_AT_PORT":
      return "Shipment arrived at the destination port.";

    default:
      return "An event was recorded for this shipment.";
  }
}

function getStatusStyles(status) {
  switch (status) {
    case "created":
      return {
        dot: "bg-[#A1A1A1]",
        badge:
          "border-[#A1A1A1]/30 bg-[#A1A1A1]/10 text-[#D4D4D8]",
        text: "text-[#D4D4D8]",
      };

    case "in_transit":
      return {
        dot: "bg-[#3B82F6]",
        badge:
          "border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#60A5FA]",
        text: "text-[#60A5FA]",
      };

    case "alert":
      return {
        dot: "bg-[#F59E0B]",
        badge:
          "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#FBBF24]",
        text: "text-[#FBBF24]",
      };

    case "arrived":
      return {
        dot: "bg-[#22C55E]",
        badge:
          "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#4ADE80]",
        text: "text-[#4ADE80]",
      };

    default:
      return {
        dot: "bg-[#71717A]",
        badge:
          "border-[#71717A]/30 bg-[#71717A]/10 text-[#A1A1AA]",
        text: "text-[#A1A1AA]",
      };
  }
}

export default function ShipmentDetail() {
  const { shipmentId } = useParams();

  const [shipment, setShipment] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch shipment details and event history
  const fetchShipmentDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [shipmentData, eventData] = await Promise.all([
        queryAPI.getShipment(shipmentId),
        queryAPI.getShipmentEvents(shipmentId),
      ]);

      setShipment(shipmentData?.data || shipmentData);
      setEvents(eventData?.data || eventData || []);
    } catch (err) {
      console.error("Failed to fetch shipment details:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load shipment details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial page load
  useEffect(() => {
    if (!shipmentId) {
      setError("Shipment ID is missing.");
      setLoading(false);
      return;
    }

    fetchShipmentDetails();
  }, [shipmentId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181B] px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent" />

              <p className="text-sm text-[#A1A1AA]">
                Loading shipment details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !shipment) {
    return (
      <div className="min-h-screen bg-[#18181B] px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/dashboard"
            className="mb-6 inline-flex items-center text-sm text-[#A1A1AA] transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <div className="rounded-xl border border-red-500/20 bg-[#27272A] p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold text-white">
              Unable to Load Shipment
            </h2>

            <p className="mb-6 text-sm text-[#A1A1AA]">
              {error || "Shipment details could not be found."}
            </p>

            <button
              type="button"
              onClick={() => fetchShipmentDetails()}
              className="rounded-lg border border-[#3F3F46] bg-[#18181B] px-4 py-2 text-sm font-medium text-white transition hover:border-[#52525B] hover:bg-[#27272A]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = shipment.status || "created";
  const statusStyles = getStatusStyles(status);

  const currentLocation =
    shipment.currentLocation || shipment.location || "—";

  const temperature =
    shipment.lastTemperature ??
    shipment.temperature ??
    "—";

  const version =
    shipment.lastVersion ??
    shipment.version ??
    "—";

  const lastUpdated = shipment.lastEventAt
    ? formatDate(shipment.lastEventAt)
    : events.length > 0
    ? formatDate(
        events[events.length - 1]?.recordedAt ||
          events[events.length - 1]?.createdAt ||
          events[events.length - 1]?.timestamp
      )
    : "—";

  const statusLabel = status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  // Sort events by version for consistent lifecycle ordering
  const sortedEvents = [...events].sort((a, b) => {
    const versionA = Number(a.version ?? 0);
    const versionB = Number(b.version ?? 0);

    return versionA - versionB;
  });

  // Shipment lifecycle stages
  const lifecycleSteps = [
    {
      eventType: "SHIPMENT_CREATED",
      label: "Created",
      description: "Shipment created",
    },
    {
      eventType: "LOADED_ON_SHIP",
      label: "In Transit",
      description: "Loaded on ship",
    },
    {
      eventType: "TEMPERATURE_SPIKE",
      label: "Temperature Alert",
      description: "Temperature event",
    },
    {
      eventType: "ARRIVED_AT_PORT",
      label: "Arrived",
      description: "Arrived at port",
    },
  ];

  const completedEventTypes = new Set(
    sortedEvents.map((event) => event.eventType)
  );

  const lastEventType =
    sortedEvents.length > 0
      ? sortedEvents[sortedEvents.length - 1]?.eventType
      : null;

  let currentLifecycleIndex = lifecycleSteps.findIndex(
    (step) => step.eventType === lastEventType
  );

  if (currentLifecycleIndex === -1) {
    if (status === "arrived") {
      currentLifecycleIndex = 3;
    } else if (status === "alert") {
      currentLifecycleIndex = 2;
    } else if (status === "in_transit") {
      currentLifecycleIndex = 1;
    } else {
      currentLifecycleIndex = 0;
    }
  }

  return (
    <div className="min-h-screen bg-[#18181B] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="mb-5 inline-flex items-center text-sm text-[#A1A1AA] transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Shipment Details
                </h1>

                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusStyles.badge}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${statusStyles.dot}`}
                  />

                  {statusLabel}
                </span>
              </div>

              <p className="text-sm text-[#71717A]">
                Shipment ID:{" "}
                <span className="font-medium text-[#D4D4D8]">
                  {shipment.shipmentId || shipmentId}
                </span>
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap gap-3">
              {/* History */}
              <Link
                to={`/historicalstate?shipmentId=${encodeURIComponent(
                  shipmentId
                )}`}
                className="inline-flex items-center gap-2 rounded-lg border border-[#3F3F46] bg-[#27272A] px-4 py-2 text-sm font-medium text-[#D4D4D8] transition hover:border-[#52525B] hover:bg-[#3F3F46]"
              >
                <span className="text-base">↶</span>
                History
              </Link>

              <Link
                to={`/shipment/${shipmentId}/analytics`}
                className="rounded-lg border border-[#3F3F46] bg-[#27272A] px-4 py-2 text-sm font-medium text-[#D4D4D8] transition hover:border-[#52525B] hover:bg-[#3F3F46]"
              >
                Analytics
              </Link>

              <Link
                to={`/audittimeline/${shipmentId}`}
                className="rounded-lg border border-[#3F3F46] bg-[#27272A] px-4 py-2 text-sm font-medium text-[#D4D4D8] transition hover:border-[#52525B] hover:bg-[#3F3F46]"
              >
                Timeline
              </Link>

              <Link
                to={`/shipment/${shipmentId}/alerts`}
                className="rounded-lg border border-[#3F3F46] bg-[#27272A] px-4 py-2 text-sm font-medium text-[#D4D4D8] transition hover:border-[#52525B] hover:bg-[#3F3F46]"
              >
                Alerts
              </Link>
            </div>
          </div>
        </div>

        {/* Current State */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Current State
            </h2>

            <p className="mt-1 text-sm text-[#71717A]">
              Latest reconstructed state from the event-sourced ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Status */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                Status
              </p>

              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${statusStyles.dot}`}
                />

                <span
                  className={`text-lg font-semibold ${statusStyles.text}`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Current Location */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                Current Location
              </p>

              <p className="text-lg font-semibold text-white">
                {currentLocation}
              </p>
            </div>

            {/* Temperature */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                Temperature
              </p>

              <p className="text-lg font-semibold text-white">
                {temperature === "—" ? "—" : `${temperature}°C`}
              </p>
            </div>

            {/* Event Version */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                Event Version
              </p>

              <p className="text-lg font-semibold text-white">
                {version === "—" ? "—" : `v${version}`}
              </p>
            </div>

            {/* Last Updated */}
            <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                Last Updated
              </p>

              <p className="text-sm font-semibold text-white">
                {lastUpdated}
              </p>
            </div>
          </div>
        </section>

        {/* Shipment Lifecycle */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Shipment Lifecycle
            </h2>

            <p className="mt-1 text-sm text-[#71717A]">
              Current progress of the shipment through its recorded lifecycle.
            </p>
          </div>

          <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {lifecycleSteps.map((step, index) => {
                const isCompleted = completedEventTypes.has(
                  step.eventType
                );

                const isCurrent = index === currentLifecycleIndex;

                return (
                  <div
                    key={step.eventType}
                    className="relative"
                  >
                    {/* Connector */}
                    {index < lifecycleSteps.length - 1 && (
                      <div
                        className={`absolute left-[22px] top-11 hidden h-px w-[calc(100%-10px)] md:block ${
                          index < currentLifecycleIndex
                            ? "bg-[#3B82F6]"
                            : "bg-[#3F3F46]"
                        }`}
                      />
                    )}

                    <div className="relative z-10 flex items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
                          isCompleted || isCurrent
                            ? "border-[#3B82F6] bg-[#3B82F6]/10 text-[#60A5FA]"
                            : "border-[#3F3F46] bg-[#18181B] text-[#71717A]"
                        }`}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold ${
                            isCompleted || isCurrent
                              ? "text-white"
                              : "text-[#71717A]"
                          }`}
                        >
                          {step.label}
                        </p>

                        <p className="mt-1 text-xs text-[#71717A]">
                          {step.description}
                        </p>

                        {isCurrent && (
                          <span className="mt-2 inline-flex rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-[#60A5FA]">
                            Current Stage
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Shipment Information */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Shipment Information
            </h2>

            <p className="mt-1 text-sm text-[#71717A]">
              Basic information and latest event details.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#3F3F46] bg-[#27272A]">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Shipment ID */}
              <div className="border-b border-[#3F3F46] p-5 md:border-r">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                  Shipment ID
                </p>

                <p className="text-sm font-medium text-[#E4E4E7]">
                  {shipment.shipmentId || shipmentId}
                </p>
              </div>

              {/* Origin */}
              <div className="border-b border-[#3F3F46] p-5">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                  Origin
                </p>

                <p className="text-sm font-medium text-[#E4E4E7]">
                  {shipment.origin || "—"}
                </p>
              </div>

              {/* Destination */}
              <div className="border-b border-[#3F3F46] p-5 md:border-r">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                  Destination
                </p>

                <p className="text-sm font-medium text-[#E4E4E7]">
                  {shipment.destination || "—"}
                </p>
              </div>

              {/* Current Location */}
              <div className="border-b border-[#3F3F46] p-5">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                  Current Location
                </p>

                <p className="text-sm font-medium text-[#E4E4E7]">
                  {currentLocation}
                </p>
              </div>

              {/* Temperature */}
              <div className="border-b border-[#3F3F46] p-5 md:border-r">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                  Temperature
                </p>

                <p className="text-sm font-medium text-[#E4E4E7]">
                  {temperature === "—"
                    ? "—"
                    : `${temperature}°C`}
                </p>
              </div>

              {/* Total Events */}
              <div className="border-b border-[#3F3F46] p-5">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                  Total Events
                </p>

                <p className="text-sm font-medium text-[#E4E4E7]">
                  {shipment.eventCount ?? events.length}
                </p>
              </div>

              {/* Version */}
              <div className="border-b border-[#3F3F46] p-5 md:border-r">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                  Version
                </p>

                <p className="text-sm font-medium text-[#E4E4E7]">
                  {version === "—" ? "—" : `v${version}`}
                </p>
              </div>

              {/* Last Event */}
              <div className="border-b border-[#3F3F46] p-5">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#71717A]">
                  Last Event
                </p>

                <p className="text-sm font-medium text-[#E4E4E7]">
                  {shipment.lastEventType
                    ? getEventTitle(shipment.lastEventType)
                    : sortedEvents.length > 0
                    ? getEventTitle(
                        sortedEvents[sortedEvents.length - 1]?.eventType
                      )
                    : "—"}
                </p>

                {shipment.lastEventAt && (
                  <p className="mt-1 text-xs text-[#71717A]">
                    {formatDate(shipment.lastEventAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Event Timeline */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Event Timeline
            </h2>

            <p className="mt-1 text-sm text-[#71717A]">
              Chronological history of events recorded in the event store.
            </p>
          </div>

          <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-6">
            {sortedEvents.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-[#71717A]">
                  No events found for this shipment.
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline vertical line */}
                <div className="absolute bottom-3 left-[9px] top-3 w-px bg-[#3F3F46]" />

                <div className="space-y-8">
                  {sortedEvents.map((event, index) => {
                    const eventPayload = event.payload || {};

                    const eventLocation =
                      eventPayload.location ||
                      eventPayload.port ||
                      eventPayload.currentLocation ||
                      "—";

                    const eventTemperature =
                      eventPayload.temperature ??
                      eventPayload.temp;

                    return (
                      <div
                        key={
                          event._id ||
                          event.id ||
                          `${event.eventType}-${event.version}-${index}`
                        }
                        className="relative flex gap-5"
                      >
                        {/* Timeline Dot */}
                        <div className="relative z-10 mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-4 border-[#27272A] bg-[#3B82F6]" />

                        {/* Event Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="font-semibold text-[#F4F4F5]">
                                {getEventTitle(event.eventType)}
                              </h3>

                              <p className="mt-1 text-xs text-[#71717A]">
                                {event.eventType}
                              </p>
                            </div>

                            <div className="shrink-0 text-xs text-[#A1A1AA]">
                              {formatDate(
                                event.recordedAt ||
                                  event.createdAt ||
                                  event.timestamp
                              )}
                            </div>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-[#A1A1AA]">
                            {getEventDescription(event)}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {eventLocation !== "—" && (
                              <span className="rounded-md border border-[#3F3F46] bg-[#18181B] px-2.5 py-1 text-xs text-[#A1A1AA]">
                                Location:{" "}
                                <span className="text-[#D4D4D8]">
                                  {eventLocation}
                                </span>
                              </span>
                            )}

                            {eventTemperature !== undefined &&
                              eventTemperature !== null && (
                                <span className="rounded-md border border-[#3F3F46] bg-[#18181B] px-2.5 py-1 text-xs text-[#A1A1AA]">
                                  Temperature:{" "}
                                  <span className="text-[#D4D4D8]">
                                    {eventTemperature}°C
                                  </span>
                                </span>
                              )}

                            {event.version !== undefined &&
                              event.version !== null && (
                                <span className="rounded-md border border-[#3F3F46] bg-[#18181B] px-2.5 py-1 text-xs text-[#A1A1AA]">
                                  Version:{" "}
                                  <span className="text-[#D4D4D8]">
                                    v{event.version}
                                  </span>
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}