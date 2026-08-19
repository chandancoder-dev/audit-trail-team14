import { useParams } from 'react-router-dom';

function AnalyticsPage() {
  const { id } = useParams();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shipment Analytics</h1>
        <p className="text-gray-600 mt-1">
          Temperature & event analysis for{' '}
          <span className="font-mono font-semibold">{id || 'SHIP-XXXX'}</span>
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-2xl font-bold text-gray-900">—</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Temperature Spikes</p>
          <p className="text-2xl font-bold text-red-600">—</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Avg Temperature</p>
          <p className="text-2xl font-bold text-blue-600">—</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Last Spike</p>
          <p className="text-2xl font-bold text-orange-600">—</p>
        </div>
      </div>

      {/* Temperature Chart Section */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Temperature Over Time</h2>
        <div className="h-72 flex items-center justify-center text-gray-400">
          {/* Recharts TemperatureChart component will be placed here */}
          <p>Temperature chart will render here</p>
        </div>
      </div>

      {/* Event Markers Section */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Markers</h2>
        <div className="h-48 flex items-center justify-center text-gray-400">
          {/* Event markers overlaid on timeline */}
          <p>Event markers with timeline correlation will render here</p>
        </div>
      </div>

      {/* Event Frequency Section */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Frequency</h2>
        <div className="h-48 flex items-center justify-center text-gray-400">
          {/* Bar chart showing events per day */}
          <p>Event frequency bar chart will render here</p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
