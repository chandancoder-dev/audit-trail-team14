import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { queryAPI } from '../../services/api';
import AlertCard from './AlertCard';

const SEVERITY_FILTERS = ['all', 'critical', 'warning', 'info'];

// ── Skeleton loader ───────────────────────────────────────────────────────────
function AlertSkeleton() {
  return (
    <div className="bg-bg-card border border-border border-l-4 border-l-border rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-border flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-border rounded w-3/4" />
          <div className="h-3 bg-border rounded w-1/2" />
          <div className="flex gap-2 mt-2">
            <div className="h-4 w-14 bg-border rounded" />
            <div className="h-4 w-20 bg-border rounded" />
            <div className="h-4 w-16 bg-border rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ filter }) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-10 text-center">
      <p className="text-3xl mb-2">🔔</p>
      <p className="text-text-heading font-medium text-sm">No alerts found</p>
      <p className="text-text-placeholder text-xs mt-1">
        {filter === 'all'
          ? 'No alerts have been generated yet. Temperature spikes will appear here automatically.'
          : `No ${filter} alerts at this time.`}
      </p>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-10 text-center">
      <p className="text-3xl mb-2">⚠️</p>
      <p className="text-sm text-error">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-xs text-primary border border-primary/30 px-3 py-1.5 rounded hover:bg-primary/10 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function AlertsPage() {
  const { id: shipmentId } = useParams();

  const [allAlerts, setAllAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Per-shipment view when a shipmentId is in the URL; otherwise all alerts.
      // We filter by severity client-side so the filter badge counts stay accurate.
      const data = shipmentId
        ? await queryAPI.getShipmentAlerts(shipmentId)
        : await queryAPI.getAlerts({ limit: 100 });
      const fetched = data.alerts || [];
      setAllAlerts(fetched);
    } catch (err) {
      setError(err.message || 'Failed to load alerts.');
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // ── Filter counts (from full dataset) ────────────────────────────────────
  const counts = {
    all: allAlerts.length,
    critical: allAlerts.filter((a) => a.severity === 'critical').length,
    warning: allAlerts.filter((a) => a.severity === 'warning').length,
    info: allAlerts.filter((a) => a.severity === 'info').length,
  };

  // ── Client-side filter ────────────────────────────────────────────────────
  const filteredAlerts =
    activeFilter === 'all'
      ? allAlerts
      : allAlerts.filter((a) => a.severity === activeFilter);

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-heading">Alerts</h1>
          <p className="text-text-secondary mt-1 text-sm">
            {shipmentId
              ? `Alerts for shipment ${shipmentId}.`
              : 'Monitor temperature spikes, threshold violations, and shipment events.'}
          </p>
        </div>
        {!loading && (
          <button
            onClick={fetchAlerts}
            aria-label="Refresh alerts"
            className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded hover:bg-primary/10 transition-colors"
          >
            ↻ Refresh
          </button>
        )}
      </div>

      {/* Severity Filter Buttons */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {SEVERITY_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            disabled={loading}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors border ${
              activeFilter === filter
                ? 'bg-primary text-white border-primary'
                : 'bg-bg-card text-text-secondary border-border hover:border-text-placeholder'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {filter}
            <span className="ml-1.5 opacity-75">
              ({loading ? '…' : counts[filter]})
            </span>
          </button>
        ))}
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => <AlertSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchAlerts} />
      ) : filteredAlerts.length === 0 ? (
        <EmptyState filter={activeFilter} />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert._id} alert={alert} />
          ))}
        </div>
      )}

      {/* Total count footer */}
      {!loading && !error && allAlerts.length > 0 && (
        <p className="text-xs text-text-placeholder mt-4 text-right">
          Showing {filteredAlerts.length} of {allAlerts.length} alert{allAlerts.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

export default AlertsPage;
