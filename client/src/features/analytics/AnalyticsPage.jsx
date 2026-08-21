import { useParams } from 'react-router-dom';
import TemperatureChart from './TemperatureChart';

function AnalyticsPage() {
  const { id } = useParams();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-heading">Shipment Analytics</h1>
        <p className="text-text-secondary mt-1">
          Temperature & event analysis for{' '}
          <span className="font-mono font-semibold text-primary">{id || 'SHIP-XXXX'}</span>
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-text-secondary">Total Events</p>
          <p className="text-2xl font-bold text-text-heading">—</p>
        </div>
        <div className="bg-bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-text-secondary">Temperature Spikes</p>
          <p className="text-2xl font-bold text-error">—</p>
        </div>
        <div className="bg-bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-text-secondary">Avg Temperature</p>
          <p className="text-2xl font-bold text-primary">—</p>
        </div>
        <div className="bg-bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-text-secondary">Last Spike</p>
          <p className="text-2xl font-bold text-warning">—</p>
        </div>
      </div>

      {/* Temperature Chart Section */}
      <div className="bg-bg-card rounded-lg p-6 border border-border mb-8">
        <h2 className="text-lg font-semibold text-text-heading mb-4">Temperature Over Time</h2>
        <div className="h-72 flex items-center justify-center text-text-placeholder">
          <TemperatureChart />
        </div>
      </div>

      {/* Event Markers Section */}
      <div className="bg-bg-card rounded-lg p-6 border border-border mb-8">
        <h2 className="text-lg font-semibold text-text-heading mb-4">Event Markers</h2>
        <div className="h-48 flex items-center justify-center text-text-placeholder">
          {/* Event markers overlaid on timeline */}
          <p>Event markers with timeline correlation will render here</p>
        </div>
      </div>

      {/* Event Frequency Section */}
      <div className="bg-bg-card rounded-lg p-6 border border-border">
        <h2 className="text-lg font-semibold text-text-heading mb-4">Event Frequency</h2>
        <div className="h-48 flex items-center justify-center text-text-placeholder">
          {/* Bar chart showing events per day */}
          <p>Event frequency bar chart will render here</p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
