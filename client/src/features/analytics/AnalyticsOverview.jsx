import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { queryAPI } from "../../services/api";

// ── Status metadata ────────────────────────────────────────────────────────────
const STATUS_META = {
  created: { label: "Created", color: "#A1A1AA", chip: "bg-zinc-500/15 text-zinc-300" },
  in_transit: { label: "In Transit", color: "#3B82F6", chip: "bg-blue-500/15 text-blue-400" },
  alert: { label: "Alert", color: "#EF4444", chip: "bg-red-500/15 text-error" },
  arrived: { label: "Arrived", color: "#22C55E", chip: "bg-green-500/15 text-green-400" },
};

const EVENT_LABELS = {
  SHIPMENT_CREATED: "Created",
  LOADED_ON_SHIP: "Loaded on Ship",
  TEMPERATURE_SPIKE: "Temperature Spike",
  ARRIVED_AT_PORT: "Arrived at Port",
};

const EVENT_COLORS = {
  SHIPMENT_CREATED: "#A1A1AA",
  LOADED_ON_SHIP: "#3B82F6",
  TEMPERATURE_SPIKE: "#EF4444",
  ARRIVED_AT_PORT: "#22C55E",
};

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function StatCard({ label, value, valueClass = "text-[#FAFAFA]", sub }) {
  return (
    <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-5">
      <p className="text-sm text-[#A1A1AA]">{label}</p>
      <p className={`mt-1.5 text-3xl font-bold ${valueClass}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-[#71717A]">{sub}</p>}
    </div>
  );
}

// Horizontal proportion bar for status distribution.
function StatusBar({ statusCounts, total }) {
  const order = ["created", "in_transit", "alert", "arrived"];
  const segments = order
    .map((key) => ({ key, count: statusCounts[key] || 0 }))
    .filter((s) => s.count > 0);

  if (total === 0) return null;

  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-[#202023]">
        {segments.map((s) => (
          <div
            key={s.key}
            title={`${STATUS_META[s.key].label}: ${s.count}`}
            style={{
              width: `${(s.count / total) * 100}%`,
              backgroundColor: STATUS_META[s.key].color,
            }}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {order.map((key) => (
          <div
            key={key}
            className="rounded-lg border border-[#3F3F46] bg-[#202023] p-3"
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: STATUS_META[key].color }}
              />
              <span className="text-xs text-[#A1A1AA]">
                {STATUS_META[key].label}
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold text-[#FAFAFA]">
              {statusCounts[key] || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsOverview() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await queryAPI.getAnalyticsOverview();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load analytics overview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const totals = data?.totals || { shipments: 0, events: 0, activeAlerts: 0 };
  const statusCounts = data?.statusCounts || {
    created: 0,
    in_transit: 0,
    arrived: 0,
    alert: 0,
  };
  const eventsByType = data?.eventsByType || [];
  const shipments = data?.shipments || [];

  const maxEventTypeCount =
    eventsByType.length > 0
      ? Math.max(...eventsByType.map((e) => e.count))
      : 0;

  const completionRate =
    totals.shipments > 0
      ? Math.round(((statusCounts.arrived || 0) / totals.shipments) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#18181B] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-[#A1A1AA] transition hover:text-white"
        >
          <span aria-hidden="true">←</span> Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-6 sm:mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#71717A] mb-1">
              Analytics
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA]">
              Fleet Analytics Overview
            </h1>
            <p className="text-[#A1A1AA] mt-1.5 text-sm">
              Status, activity and event breakdown across all your shipments.
            </p>
          </div>

          {!loading && (
            <button
              onClick={fetchOverview}
              aria-label="Refresh overview"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#3B82F6] border border-[#3B82F6]/30 px-3.5 py-2 rounded-lg hover:bg-[#3B82F6]/10 transition-colors"
            >
              <span aria-hidden="true">↻</span> Refresh
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl border border-[#3F3F46] bg-[#27272A] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-[#27272A] p-8 text-center">
            <p className="text-sm text-[#A1A1AA] mb-4">{error}</p>
            <button
              onClick={fetchOverview}
              className="rounded-lg border border-[#3F3F46] bg-[#18181B] px-4 py-2 text-sm text-white hover:border-[#52525B]"
            >
              Try Again
            </button>
          </div>
        ) : totals.shipments === 0 ? (
          <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-10 text-center">
            <h2 className="text-lg font-semibold text-[#FAFAFA]">No shipments yet</h2>
            <p className="mt-2 text-sm text-[#A1A1AA]">
              Create a shipment to start seeing fleet analytics.
            </p>
            <Link
              to="/shipment-operations"
              className="mt-4 inline-flex rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2563EB]"
            >
              Create Shipment
            </Link>
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
              <StatCard label="Total Shipments" value={totals.shipments} />
              <StatCard
                label="In Transit"
                value={statusCounts.in_transit || 0}
                valueClass="text-[#60A5FA]"
              />
              <StatCard
                label="Delivered"
                value={statusCounts.arrived || 0}
                valueClass="text-[#4ADE80]"
                sub={`${completionRate}% completion rate`}
              />
              <StatCard
                label="Active Alerts"
                value={totals.activeAlerts}
                valueClass="text-error"
                sub={`${totals.events} events recorded`}
              />
            </div>

            {/* Status distribution */}
            <section className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="mb-5">
                <h2 className="text-lg sm:text-xl font-semibold text-[#FAFAFA]">
                  Shipment Status Distribution
                </h2>
                <p className="text-xs sm:text-sm text-[#71717A] mt-1">
                  How your {totals.shipments} shipment
                  {totals.shipments !== 1 ? "s" : ""} are split across the
                  lifecycle.
                </p>
              </div>
              <StatusBar statusCounts={statusCounts} total={totals.shipments} />
            </section>

            {/* Event composition */}
            <section className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="mb-5">
                <h2 className="text-lg sm:text-xl font-semibold text-[#FAFAFA]">
                  Events by Type
                </h2>
                <p className="text-xs sm:text-sm text-[#71717A] mt-1">
                  Composition of all {totals.events} recorded events.
                </p>
              </div>

              <div className="space-y-3">
                {eventsByType.map((e) => (
                  <div key={e.eventType} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-xs text-[#A1A1AA]">
                      {EVENT_LABELS[e.eventType] || e.eventType}
                    </span>
                    <div className="flex-1 h-5 rounded bg-[#202023] overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${
                            maxEventTypeCount > 0
                              ? (e.count / maxEventTypeCount) * 100
                              : 0
                          }%`,
                          backgroundColor: EVENT_COLORS[e.eventType] || "#3B82F6",
                        }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-sm font-semibold text-[#FAFAFA]">
                      {e.count}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* All shipments table */}
            <section className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-4 sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg sm:text-xl font-semibold text-[#FAFAFA]">
                  All Shipments
                </h2>
                <p className="text-xs sm:text-sm text-[#71717A] mt-1">
                  Most recently active first — click a row to open its details.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#3F3F46] text-left text-xs uppercase tracking-wider text-[#71717A]">
                      <th className="py-2.5 pr-4 font-medium">Shipment</th>
                      <th className="py-2.5 pr-4 font-medium">Status</th>
                      <th className="py-2.5 pr-4 font-medium">Location</th>
                      <th className="py-2.5 pr-4 font-medium">Last Event</th>
                      <th className="py-2.5 pr-4 font-medium">Events</th>
                      <th className="py-2.5 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F3F46]">
                    {shipments.map((s) => {
                      const meta = STATUS_META[s.status] || STATUS_META.created;
                      return (
                        <tr
                          key={s.shipmentId}
                          onClick={() => navigate(`/shipment/${s.shipmentId}`)}
                          className="cursor-pointer text-[#D4D4D8] hover:bg-[#202023] transition-colors"
                        >
                          <td className="py-2.5 pr-4 font-semibold text-[#FAFAFA]">
                            {s.shipmentId}
                          </td>
                          <td className="py-2.5 pr-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.chip}`}
                            >
                              {meta.label}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4">
                            {s.currentLocation || "—"}
                          </td>
                          <td className="py-2.5 pr-4">
                            {EVENT_LABELS[s.lastEventType] || s.lastEventType || "—"}
                          </td>
                          <td className="py-2.5 pr-4">{s.eventCount ?? "—"}</td>
                          <td className="py-2.5 whitespace-nowrap text-[#A1A1AA]">
                            {formatDateTime(s.lastEventAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default AnalyticsOverview;
