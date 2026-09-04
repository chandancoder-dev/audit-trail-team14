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
} from "recharts";

const TEMPERATURE_THRESHOLD = -15;

function formatTime(value) {
  if (!value) return "";

  // AnalyticsPage may already provide a formatted HH:MM value.
  if (typeof value === "string" && /^\d{1,2}:\d{2}/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const point = payload[0]?.payload;

  if (!point) {
    return null;
  }

  const temperature = Number(point.temperature);
  const isAboveThreshold = temperature > TEMPERATURE_THRESHOLD;

  return (
    <div className="bg-bg-card border border-border rounded-lg p-3 shadow-lg min-w-[180px]">
      <p className="text-text-secondary text-xs mb-2">
        {formatDate(point.time)}
      </p>

      <p
        className={`text-sm font-semibold ${
          isAboveThreshold ? "text-error" : "text-primary"
        }`}
      >
        Temperature: {temperature}°C
      </p>

      {point.eventType && (
        <p className="text-text-secondary text-xs mt-1">
          Event: {point.eventType.replace(/_/g, " ")}
        </p>
      )}

      {point.version !== undefined && (
        <p className="text-text-placeholder text-xs mt-1">
          Version: v{point.version}
        </p>
      )}

      {point.location && (
        <p className="text-text-placeholder text-xs mt-1">
          Location: {point.location}
        </p>
      )}

      {isAboveThreshold && (
        <p className="text-error text-xs mt-2">
          ⚠ Above threshold ({TEMPERATURE_THRESHOLD}°C)
        </p>
      )}
    </div>
  );
}

function TemperatureChart({ data = [], threshold = TEMPERATURE_THRESHOLD }) {
  const chartData = data.map((point) => ({
    ...point,
    timeLabel: formatTime(point.time),
    temperature: Number(point.temperature),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-placeholder text-sm">
        No temperature data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" opacity={0.5} />

        <XAxis
          dataKey="timeLabel"
          stroke="#A1A1AA"
          tick={{
            fill: "#A1A1AA",
            fontSize: 12,
          }}
          axisLine={{
            stroke: "#3F3F46",
          }}
          tickLine={{
            stroke: "#3F3F46",
          }}
          label={{
            value: "Time",
            position: "insideBottomRight",
            offset: -5,
            fill: "#71717A",
            fontSize: 12,
          }}
        />

        <YAxis
          stroke="#A1A1AA"
          tick={{
            fill: "#A1A1AA",
            fontSize: 12,
          }}
          axisLine={{
            stroke: "#3F3F46",
          }}
          tickLine={{
            stroke: "#3F3F46",
          }}
          domain={["auto", "auto"]}
          label={{
            value: "Temperature (°C)",
            angle: -90,
            position: "insideLeft",
            offset: 10,
            fill: "#71717A",
            fontSize: 12,
          }}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend
          wrapperStyle={{
            color: "#A1A1AA",
            fontSize: 12,
            paddingTop: 8,
          }}
        />

        <ReferenceLine
          y={threshold}
          stroke="#EF4444"
          strokeDasharray="6 4"
          strokeWidth={2}
          label={{
            value: `Threshold (${threshold}°C)`,
            position: "right",
            fill: "#EF4444",
            fontSize: 11,
          }}
        />

        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{
            fill: "#3B82F6",
            r: 3,
            strokeWidth: 0,
          }}
          activeDot={{
            fill: "#2563EB",
            r: 5,
            strokeWidth: 2,
            stroke: "#FAFAFA",
          }}
          name="Temperature (°C)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TemperatureChart;
