import { useState } from 'react';
import AlertCard from './AlertCard';

// Mock alerts data
const MOCK_ALERTS = [
  {
    id: 'ALR-001',
    severity: 'critical',
    message: 'Temperature spike detected: -9.2°C exceeds threshold of -15°C on container SHIP-4521',
    timestamp: '2026-08-20T14:23:00Z',
    shipmentId: 'SHIP-4521',
    acknowledged: false,
  },
  {
    id: 'ALR-002',
    severity: 'critical',
    message: 'Temperature spike detected: -8.7°C exceeds threshold of -15°C on container SHIP-3892',
    timestamp: '2026-08-20T11:45:00Z',
    shipmentId: 'SHIP-3892',
    acknowledged: false,
  },
  {
    id: 'ALR-003',
    severity: 'warning',
    message: 'Container SHIP-4521 has been stationary for over 6 hours at Port of Rotterdam',
    timestamp: '2026-08-20T09:10:00Z',
    shipmentId: 'SHIP-4521',
    acknowledged: false,
  },
  {
    id: 'ALR-004',
    severity: 'warning',
    message: 'Shipment SHIP-2104 approaching estimated arrival but no port check-in received',
    timestamp: '2026-08-19T22:30:00Z',
    shipmentId: 'SHIP-2104',
    acknowledged: true,
  },
  {
    id: 'ALR-005',
    severity: 'info',
    message: 'Container SHIP-3892 successfully loaded onto vessel MV Pacific Star',
    timestamp: '2026-08-19T16:00:00Z',
    shipmentId: 'SHIP-3892',
    acknowledged: true,
  },
  {
    id: 'ALR-006',
    severity: 'info',
    message: 'New shipment SHIP-5010 created and registered in the system',
    timestamp: '2026-08-19T10:15:00Z',
    shipmentId: 'SHIP-5010',
    acknowledged: true,
  },
  {
    id: 'ALR-007',
    severity: 'critical',
    message: 'Temperature spike detected: -6.1°C exceeds threshold of -15°C on container SHIP-2104',
    timestamp: '2026-08-18T18:55:00Z',
    shipmentId: 'SHIP-2104',
    acknowledged: true,
  },
  {
    id: 'ALR-008',
    severity: 'warning',
    message: 'Container SHIP-5010 customs clearance pending for over 24 hours',
    timestamp: '2026-08-18T08:20:00Z',
    shipmentId: 'SHIP-5010',
    acknowledged: true,
  },
];

const SEVERITY_FILTERS = ['all', 'critical', 'warning', 'info'];

function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredAlerts =
    activeFilter === 'all'
      ? MOCK_ALERTS
      : MOCK_ALERTS.filter((a) => a.severity === activeFilter);

  const counts = {
    all: MOCK_ALERTS.length,
    critical: MOCK_ALERTS.filter((a) => a.severity === 'critical').length,
    warning: MOCK_ALERTS.filter((a) => a.severity === 'warning').length,
    info: MOCK_ALERTS.filter((a) => a.severity === 'info').length,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-heading">Alerts</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Monitor temperature spikes, threshold violations, and shipment events.
        </p>
      </div>

      {/* Severity Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {SEVERITY_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors border ${
              activeFilter === filter
                ? 'bg-primary text-white border-primary'
                : 'bg-bg-card text-text-secondary border-border hover:border-text-placeholder'
            }`}
          >
            {filter}
            <span className="ml-1.5 opacity-75">({counts[filter]})</span>
          </button>
        ))}
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-text-placeholder text-sm">No alerts match this filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertsPage;
