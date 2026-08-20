import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Mock temperature data simulating sensor readings for a shipping container
const MOCK_TEMPERATURE_DATA = [
  { time: '06:00', temperature: -18.2 },
  { time: '07:00', temperature: -18.0 },
  { time: '08:00', temperature: -17.8 },
  { time: '09:00', temperature: -17.5 },
  { time: '10:00', temperature: -16.9 },
  { time: '11:00', temperature: -15.2 },
  { time: '12:00', temperature: -13.8 },
  { time: '13:00', temperature: -11.5 },
  { time: '14:00', temperature: -9.2 },
  { time: '15:00', temperature: -12.4 },
  { time: '16:00', temperature: -15.1 },
  { time: '17:00', temperature: -17.0 },
  { time: '18:00', temperature: -17.8 },
  { time: '19:00', temperature: -18.1 },
  { time: '20:00', temperature: -18.3 },
  { time: '21:00', temperature: -18.0 },
];

// Temperature threshold (in °C) — above this triggers a TEMPERATURE_SPIKE event
const TEMPERATURE_THRESHOLD = -15;

// Custom tooltip for the chart
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const temp = payload[0].value;
  const isAboveThreshold = temp > TEMPERATURE_THRESHOLD;

  return (
    <div className="bg-bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="text-text-secondary text-xs mb-1">{label}</p>
      <p className={`text-sm font-semibold ${isAboveThreshold ? 'text-error' : 'text-primary'}`}>
        {temp}°C
      </p>
      {isAboveThreshold && (
        <p className="text-error text-xs mt-1">⚠ Above threshold ({TEMPERATURE_THRESHOLD}°C)</p>
      )}
    </div>
  );
}

function TemperatureChart({ data = MOCK_TEMPERATURE_DATA, threshold = TEMPERATURE_THRESHOLD }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" opacity={0.5} />

        {/* X Axis — Time */}
        <XAxis
          dataKey="time"
          stroke="#A1A1AA"
          tick={{ fill: '#A1A1AA', fontSize: 12 }}
          axisLine={{ stroke: '#3F3F46' }}
          tickLine={{ stroke: '#3F3F46' }}
          label={{
            value: 'Time',
            position: 'insideBottomRight',
            offset: -5,
            fill: '#71717A',
            fontSize: 12,
          }}
        />

        {/* Y Axis — Temperature */}
        <YAxis
          stroke="#A1A1AA"
          tick={{ fill: '#A1A1AA', fontSize: 12 }}
          axisLine={{ stroke: '#3F3F46' }}
          tickLine={{ stroke: '#3F3F46' }}
          domain={['auto', 'auto']}
          label={{
            value: 'Temperature (°C)',
            angle: -90,
            position: 'insideLeft',
            offset: 10,
            fill: '#71717A',
            fontSize: 12,
          }}
        />

        {/* Tooltip */}
        <Tooltip content={<CustomTooltip />} />

        {/* Legend */}
        <Legend
          wrapperStyle={{ color: '#A1A1AA', fontSize: 12, paddingTop: 8 }}
        />

        {/* Threshold Reference Line */}
        <ReferenceLine
          y={threshold}
          stroke="#EF4444"
          strokeDasharray="6 4"
          strokeWidth={2}
          label={{
            value: `Threshold (${threshold}°C)`,
            position: 'right',
            fill: '#EF4444',
            fontSize: 11,
          }}
        />

        {/* Temperature Line */}
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ fill: '#3B82F6', r: 3, strokeWidth: 0 }}
          activeDot={{ fill: '#2563EB', r: 5, strokeWidth: 2, stroke: '#FAFAFA' }}
          name="Temperature (°C)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TemperatureChart;
