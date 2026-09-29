import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { queryAPI } from "../../services/api";
import TemperatureChart from "./TemperatureChart";

// ── Skeletons / states ────────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="bg-bg-card rounded-xl p-4 sm:p-5 border border-border animate-pulse">
      <div className="h-3 w-28 bg-border rounded mb-3" />
      <div className="h-7 w-20 bg-border rounded" />
    </div>
  );
}

function ChartSkeleton({ height = "h-72" }) {
  return (
    <div
      className={`${height} rounded-lg bg-border/30 animate-pulse flex items-center justify-center`}
    >
      <span className="text-text-placeholder text-sm">Loading…</span>
    </div>
  );
}

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

function StatCard({ label, value, valueClass = "text-text-heading", sub }) {
  return (
    <div className="bg-bg-card rounded-xl p-4 sm:p-5 border border-border transition-colors hover:border-border/80">
      <p className="text-xs sm:text-sm text-text-secondary">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold mt-1.5 break-words ${valueClass}`}>
        {value ?? "—"}
      </p>
      {sub && <p className="text-[11px] text-text-placeholder mt-1">{sub}</p>}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatFullDateTime(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return String(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Human-readable duration from milliseconds (e.g. "2d 4h", "3h 12m", "45s").
function formatDuration(ms) {
  if (ms == null || Number.isNaN(ms)) return "—";
  if (ms < 1000) return "< 1s";
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

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
  const navigate = useNavigate();

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

  // ── Derived values (all from real event data) ──────────────────────────────
  const stats = analyticsData?.temperature?.stats || {};
  const timeSeries = analyticsData?.temperature?.timeSeries || [];
  const eventMarkers = analyticsData?.temperature?.eventMarkers || [];
  const insights = analyticsData?.insights || null;
  const compliance = insights?.compliance || null;
  const durations = insights?.durations || {};
  const milestones = insights?.milestones || {};

  const chartData = prepareChartData(timeSeries);
  const totalEvents = eventMarkers.length;

  const threshold = stats.threshold ?? compliance?.threshold ?? -15;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <button
        type="button"
        onClick={() => navigate(`/shipment/${id}`)}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-text-secondary transition hover:text-text-heading"
      >
        <span aria-hidden="true">←</span> Back to Shipment
      </button>

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

      {/* Cold-chain compliance banner — the forensic verdict */}
      {!loading && !error && compliance && compliance.maintained !== null && (
        <div
          className={`mb-6 sm:mb-8 rounded-xl border p-4 sm:p-5 flex items-start gap-3 ${
            compliance.maintained
              ? "border-green-500/30 bg-green-500/10"
              : "border-red-500/30 bg-red-500/10"
          }`}
        >
          <div>
            <h2
              className={`text-base sm:text-lg font-semibold ${
                compliance.maintained ? "text-green-400" : "text-error"
              }`}
            >
              {compliance.maintained
                ? "Cold chain maintained"
                : `Cold chain breached — ${compliance.breachCount} reading${
                    compliance.breachCount !== 1 ? "s" : ""
                  } above threshold`}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              {compliance.maintained
                ? `All ${compliance.totalReadings} temperature reading${
                    compliance.totalReadings !== 1 ? "s" : ""
                  } stayed at or below the ${threshold}°C threshold.`
                : `${compliance.breachCount} of ${compliance.totalReadings} readings exceeded the ${threshold}°C threshold` +
                  (compliance.worstTemperature != null
                    ? ` — peak recorded at ${compliance.worstTemperature}°C.`
                    : ".")}
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
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
              label="Transit Time"
              value={
                durations.transitMs != null
                  ? formatDuration(durations.transitMs)
                  : "In progress"
              }
              valueClass="text-text-heading"
              sub={
                milestones.arrivedAt
                  ? "Loaded → Arrived"
                  : milestones.loadedAt
                  ? "Not yet arrived"
                  : "Not yet loaded"
              }
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
                Threshold: <strong className="text-warning">{threshold}°C</strong>
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
              threshold={threshold}
              eventMarkers={eventMarkers}
            />
          )}
        </div>
      </section>

      {/* Lifecycle Milestones */}
      <section className="bg-bg-card rounded-xl p-4 sm:p-6 border border-border mb-6 sm:mb-8">
        <div className="mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-text-heading">
            Lifecycle Milestones
          </h2>
          <p className="text-xs sm:text-sm text-text-placeholder mt-1">
            Key timestamps and time between milestones.
          </p>
        </div>

        {loading ? (
          <ChartSkeleton height="h-40" />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchAnalytics} />
        ) : !insights ? (
          <EmptyState message="No lifecycle data for this shipment yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary">Created</span>
              <span className="text-text-heading">
                {formatFullDateTime(milestones.createdAt)}
              </span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary">Time to load</span>
              <span className="text-primary font-medium">
                {formatDuration(durations.timeToLoadMs)}
              </span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary">Loaded on ship</span>
              <span className="text-text-heading">
                {milestones.loadedAt ? formatFullDateTime(milestones.loadedAt) : "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary">Transit time</span>
              <span className="text-primary font-medium">
                {durations.transitMs != null
                  ? formatDuration(durations.transitMs)
                  : "In progress"}
              </span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary">Arrived at port</span>
              <span className="text-text-heading">
                {milestones.arrivedAt ? formatFullDateTime(milestones.arrivedAt) : "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary">Total lifespan</span>
              <span className="text-primary font-medium">
                {formatDuration(durations.totalLifespanMs)}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Temperature Readings table */}
      <section className="bg-bg-card rounded-xl p-4 sm:p-6 border border-border mb-6 sm:mb-8">
        <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-text-heading">
              Temperature Readings
            </h2>
            <p className="text-xs sm:text-sm text-text-placeholder mt-1">
              Every recorded sensor reading with its exact value, location, and
              status against the {threshold}°C threshold.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-8 bg-border/40 rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchAnalytics} />
        ) : timeSeries.length === 0 ? (
          <EmptyState message="No temperature readings recorded for this shipment yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-text-placeholder">
                  <th className="py-2.5 pr-4 font-medium">Version</th>
                  <th className="py-2.5 pr-4 font-medium">Recorded At</th>
                  <th className="py-2.5 pr-4 font-medium">Location</th>
                  <th className="py-2.5 pr-4 font-medium">Temperature</th>
                  <th className="py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {timeSeries.map((point, idx) => {
                  const isBreach = point.temperature > threshold;
                  return (
                    <tr
                      key={`${point.version}-${idx}`}
                      className="text-text-secondary hover:bg-bg-input/40 transition-colors"
                    >
                      <td className="py-2.5 pr-4 font-mono text-xs text-text-placeholder">
                        v{point.version}
                      </td>
                      <td className="py-2.5 pr-4 whitespace-nowrap">
                        {formatFullDateTime(point.time)}
                      </td>
                      <td className="py-2.5 pr-4">{point.location || "—"}</td>
                      <td
                        className={`py-2.5 pr-4 font-semibold ${
                          isBreach ? "text-error" : "text-primary"
                        }`}
                      >
                        {point.temperature}°C
                      </td>
                      <td className="py-2.5">
                        {isBreach ? (
                          <span className="inline-flex rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-medium text-error">
                            Above threshold
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-green-500/15 px-2 py-0.5 text-[11px] font-medium text-green-400">
                            Within range
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AnalyticsPage;
