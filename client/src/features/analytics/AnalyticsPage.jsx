import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { queryAPI } from '../../services/api';
import TemperatureChart from './TemperatureChart';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

// ── Skeleton for stat cards ───────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="bg-bg-card rounded-lg p-4 border border-border animate-pulse">
      <div className="h-3 w-28 bg-border rounded mb-3" />
      <div className="h-7 w-16 bg-border rounded" />
    </div>
  );
}

// ── Skeleton for chart sections ───────────────────────────────────────────────
function ChartSkeleton({ height = 'h-72' }) {
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
    <div className="flex flex-col items-center justify-center h-48 gap-3">
      <span className="text-3xl">⚠️</span>
      <p className="text-sm text-error">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded hover:bg-primary/10 transition-colors"
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
    <div className="flex flex-col items-center justify-center h-48 gap-2 text-text-placeholder">
      <span className="text-3xl">📊</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, valueClass = 'text-text-heading' }) {
  return (
    <div className="bg-bg-card rounded-lg p-4 border border-border">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${valueClass}`}>{value ?? '—'}</p>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Convert ISO timestamps → HH:MM labels for the chart X axis
function prepareChartData(timeSeries) {
  return timeSeries.map((point) => ({
    ...point,
    time: new Date(point.time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
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
      setError(err.message || 'Failed to load analytics data.');
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

  const totalEvents = frequencyData.reduce((sum, d) => sum + d.count, 0);
  const chartData = prepareChartData(timeSeries);

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-heading">Shipment Analytics</h1>
          <p className="text-text-secondary mt-1 text-sm">
            Temperature &amp; event analysis for{' '}
            <span className="font-mono font-semibold text-primary">{id || 'SHIP-XXXX'}</span>
          </p>
        </div>
        {!loading && (
          <button
            onClick={fetchAnalytics}
            aria-label="Refresh analytics"
            className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded hover:bg-primary/10 transition-colors"
          >
            ↻ Refresh
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {loading ? (
          [0, 1, 2, 3].map((i) => <StatSkeleton key={i} />)
        ) : error ? (
          <div className="col-span-4">
            <ErrorState message={error} onRetry={fetchAnalytics} />
          </div>
        ) : (
          <>
            <StatCard label="Total Events" value={totalEvents || '—'} />
            <StatCard
              label="Temperature Spikes"
              value={stats.spikeCount ?? '—'}
              valueClass="text-error"
            />
            <StatCard
              label="Avg Temperature"
              value={stats.avg != null ? `${stats.avg}°C` : '—'}
              valueClass="text-primary"
            />
            <StatCard
              label="Last Spike"
              value={lastSpike ? formatDate(lastSpike.time) : 'None'}
              valueClass="text-warning"
            />
          </>
        )}
      </div>

      {/* Temperature Chart */}
      <div className="bg-bg-card rounded-lg p-6 border border-border mb-8">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="text-lg font-semibold text-text-heading">Temperature Over Time</h2>
          {!loading && !error && stats.min != null && (
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <span>
                Min: <strong className="text-primary">{stats.min}°C</strong>
              </span>
              <span>
                Max: <strong className="text-error">{stats.max}°C</strong>
              </span>
              <span>
                Threshold:{' '}
                <strong className="text-warning">{stats.threshold ?? -15}°C</strong>
              </span>
            </div>
          )}
        </div>
        <div className="h-72">
          {loading ? (
            <ChartSkeleton height="h-72" />
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
      </div>

      {/* Event Markers Section */}
      <div className="bg-bg-card rounded-lg p-6 border border-border mb-8">
        <h2 className="text-lg font-semibold text-text-heading mb-4">Event Markers</h2>
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-border flex-shrink-0" />
                <div className="h-3 bg-border rounded w-48" />
                <div className="h-3 bg-border rounded w-24 ml-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchAnalytics} />
        ) : eventMarkers.length === 0 ? (
          <EmptyState message="No events found for this shipment." />
        ) : (
          <div className="flex flex-col gap-1">
            {eventMarkers.map((marker, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0 text-sm"
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    marker.eventType === 'TEMPERATURE_SPIKE'
                      ? 'bg-error'
                      : marker.eventType === 'ARRIVED_AT_PORT'
                      ? 'bg-green-500'
                      : marker.eventType === 'LOADED_ON_SHIP'
                      ? 'bg-primary'
                      : 'bg-text-secondary'
                  }`}
                  aria-hidden="true"
                />
                <span className="text-text-placeholder text-xs font-mono w-8">
                  v{marker.version}
                </span>
                <span className="text-text-secondary flex-1">{marker.label}</span>
                <span className="text-text-placeholder text-xs">
                  {formatDate(marker.time)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Frequency Bar Chart */}
      <div className="bg-bg-card rounded-lg p-6 border border-border">
        <h2 className="text-lg font-semibold text-text-heading mb-4">Event Frequency</h2>
        <div className="h-56">
          {loading ? (
            <ChartSkeleton height="h-56" />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchAnalytics} />
          ) : frequencyData.length === 0 ? (
            <EmptyState message="No events recorded for this shipment yet." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  stroke="#A1A1AA"
                  tick={{ fill: '#A1A1AA', fontSize: 11 }}
                  axisLine={{ stroke: '#3F3F46' }}
                  tickLine={{ stroke: '#3F3F46' }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#A1A1AA"
                  tick={{ fill: '#A1A1AA', fontSize: 11 }}
                  axisLine={{ stroke: '#3F3F46' }}
                  tickLine={{ stroke: '#3F3F46' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#27272A', border: '1px solid #3F3F46', borderRadius: '8px' }}
                  labelStyle={{ color: '#A1A1AA', fontSize: 12 }}
                  itemStyle={{ color: '#3B82F6', fontSize: 12 }}
                  formatter={(value) => [`${value} events`, 'Count']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Events">
                  {frequencyData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={entry.count === Math.max(...frequencyData.map(d => d.count)) ? '#EF4444' : '#3B82F6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
