import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { queryAPI } from "../../services/api";
import TemperatureChart from "./TemperatureChart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ── Skeleton for stat cards ───────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="bg-bg-card rounded-xl p-4 sm:p-5 border border-border animate-pulse">
      <div className="h-3 w-28 bg-border rounded mb-3" />
      <div className="h-7 w-20 bg-border rounded" />
    </div>
  );
}

// ── Skeleton for chart sections ───────────────────────────────────────────────
function ChartSkeleton({ height = "h-72" }) {
  return (
    <div
      className={`${height} rounded-lg bg-border/30 animate-pulse flex items-center justify-center`}
    >
      <span className="text-text-placeholder text-sm">Loading…</span>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-48 px-4 gap-3 text-center">
      <span className="text-3xl" aria-hidden="true">
        ⚠️
      </span>

      <p className="text-sm text-error max-w-md">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-48 px-4 gap-2 text-text-placeholder text-center">
      <span className="text-3xl" aria-hidden="true">
        📊
      </span>
      <p className="text-sm max-w-md">{message}</p>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, valueClass = "text-text-heading" }) {
  return (
    <div className="bg-bg-card rounded-xl p-4 sm:p-5 border border-border transition-colors hover:border-border/80">
      <p className="text-xs sm:text-sm text-text-secondary">{label}</p>

      <p
        className={`text-xl sm:text-2xl font-bold mt-1.5 break-words ${valueClass}`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return String(dateStr);
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Convert ISO timestamps → HH:MM labels for the chart X axis
function prepareChartData(timeSeries) {
  return timeSeries.map((point) => ({
    ...point,
    time: new Date(point.time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  }));
}

// ── Main page ─────────────────────────────────────────────────────────────────
function AnalyticsPage() {
  const { id } = useParams();

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await queryAPI.getShipmentAnalytics(id);
      setAnalyticsData(data);
    } catch (err) {
      setError(err.message || "Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const stats = analyticsData?.temperature?.stats || {};
  const timeSeries = analyticsData?.temperature?.timeSeries || [];
  const eventMarkers = analyticsData?.temperature?.eventMarkers || [];
  const frequencyData = analyticsData?.frequency || [];
  const spikes = analyticsData?.temperature?.spikes || [];
  const lastSpike = spikes.length > 0 ? spikes[spikes.length - 1] : null;

  const totalEvents = frequencyData.reduce((sum, item) => sum + item.count, 0);
  const chartData = prepareChartData(timeSeries);

  const maxFrequency =
    frequencyData.length > 0
      ? Math.max(...frequencyData.map((item) => item.count))
      : 0;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-text-placeholder mb-1">
            Analytics
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-text-heading">
            Shipment Analytics
          </h1>

          <p className="text-text-secondary mt-1.5 text-sm">
            Temperature and event analysis for{" "}
            <span className="font-mono font-semibold text-primary">
              {id || "SHIP-XXXX"}
            </span>
          </p>
        </div>

        {!loading && (
          <button
            onClick={fetchAnalytics}
            aria-label="Refresh analytics"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-primary border border-primary/30 px-3.5 py-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <span aria-hidden="true">↻</span>
            Refresh
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {loading ? (
          [0, 1, 2, 3].map((item) => <StatSkeleton key={item} />)
        ) : error ? (
          <div className="col-span-2 lg:col-span-4">
            <ErrorState message={error} onRetry={fetchAnalytics} />
          </div>
        ) : (
          <>
            <StatCard label="Total Events" value={totalEvents || "—"} />

            <StatCard
              label="Temperature Spikes"
              value={stats.spikeCount ?? "—"}
              valueClass="text-error"
            />

            <StatCard
              label="Avg Temperature"
              value={stats.avg != null ? `${stats.avg}°C` : "—"}
              valueClass="text-primary"
            />

            <StatCard
              label="Last Spike"
              value={lastSpike ? formatDate(lastSpike.time) : "None"}
              valueClass="text-warning"
            />
          </>
        )}
      </div>

      {/* Temperature Chart */}
      <section className="bg-bg-card rounded-xl p-4 sm:p-6 border border-border mb-6 sm:mb-8">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-text-heading">
              Temperature Over Time
            </h2>

            <p className="text-xs sm:text-sm text-text-placeholder mt-1">
              Sensor readings across the shipment event timeline
            </p>
          </div>

          {!loading && !error && stats.min != null && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="text-text-secondary">
                Min: <strong className="text-primary">{stats.min}°C</strong>
              </span>

              <span className="text-text-secondary">
                Max: <strong className="text-error">{stats.max}°C</strong>
              </span>

              <span className="text-text-secondary">
                Threshold:{" "}
                <strong className="text-warning">
                  {stats.threshold ?? -15}°C
                </strong>
              </span>
            </div>
          )}
        </div>

        <div className="h-72 sm:h-80">
          {loading ? (
            <ChartSkeleton height="h-72 sm:h-80" />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchAnalytics} />
          ) : chartData.length === 0 ? (
            <EmptyState message="No temperature readings recorded for this shipment yet." />
          ) : (
            <TemperatureChart
              data={chartData}
              threshold={stats.threshold ?? -15}
              eventMarkers={eventMarkers}
            />
          )}
        </div>
      </section>

      {/* Event Markers */}
      <section className="bg-bg-card rounded-xl p-4 sm:p-6 border border-border mb-6 sm:mb-8">
        <div className="mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-text-heading">
            Event Markers
          </h2>

          <p className="text-xs sm:text-sm text-text-placeholder mt-1">
            Chronological events recorded for this shipment
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="flex items-center gap-3 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-border shrink-0" />
                <div className="h-3 bg-border rounded flex-1 max-w-xs" />
                <div className="h-3 bg-border rounded w-24 ml-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchAnalytics} />
        ) : eventMarkers.length === 0 ? (
          <EmptyState message="No events found for this shipment." />
        ) : (
          <div className="divide-y divide-border/40">
            {eventMarkers.map((marker, idx) => (
              <div
                key={`${marker.version}-${marker.eventType}-${idx}`}
                className="flex flex-wrap sm:flex-nowrap items-center gap-3 py-3 text-sm"
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    marker.eventType === "TEMPERATURE_SPIKE"
                      ? "bg-error"
                      : marker.eventType === "ARRIVED_AT_PORT"
                        ? "bg-green-500"
                        : marker.eventType === "LOADED_ON_SHIP"
                          ? "bg-primary"
                          : "bg-text-secondary"
                  }`}
                  aria-hidden="true"
                />

                <span className="text-text-placeholder text-xs font-mono w-8 shrink-0">
                  v{marker.version}
                </span>

                <span className="text-text-secondary flex-1 min-w-0">
                  {marker.label}
                </span>

                <span className="text-text-placeholder text-xs sm:text-right w-full sm:w-auto pl-5 sm:pl-0">
                  {formatDate(marker.time)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Event Frequency */}
      <section className="bg-bg-card rounded-xl p-4 sm:p-6 border border-border">
        <div className="mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-text-heading">
            Event Frequency
          </h2>

          <p className="text-xs sm:text-sm text-text-placeholder mt-1">
            Number of shipment events recorded by date
          </p>
        </div>

        <div className="h-56 sm:h-64">
          {loading ? (
            <ChartSkeleton height="h-56 sm:h-64" />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchAnalytics} />
          ) : frequencyData.length === 0 ? (
            <EmptyState message="No events recorded for this shipment yet." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={frequencyData}
                margin={{
                  top: 5,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#3F3F46"
                  opacity={0.5}
                />

                <XAxis
                  dataKey="date"
                  stroke="#A1A1AA"
                  tick={{
                    fill: "#A1A1AA",
                    fontSize: 11,
                  }}
                  axisLine={{
                    stroke: "#3F3F46",
                  }}
                  tickLine={{
                    stroke: "#3F3F46",
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#A1A1AA"
                  tick={{
                    fill: "#A1A1AA",
                    fontSize: 11,
                  }}
                  axisLine={{
                    stroke: "#3F3F46",
                  }}
                  tickLine={{
                    stroke: "#3F3F46",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#27272A",
                    border: "1px solid #3F3F46",
                    borderRadius: "8px",
                  }}
                  labelStyle={{
                    color: "#A1A1AA",
                    fontSize: 12,
                  }}
                  itemStyle={{
                    color: "#3B82F6",
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value} events`, "Count"]}
                />

                <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Events">
                  {frequencyData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={
                        entry.count === maxFrequency ? "#EF4444" : "#3B82F6"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}

export default AnalyticsPage;
