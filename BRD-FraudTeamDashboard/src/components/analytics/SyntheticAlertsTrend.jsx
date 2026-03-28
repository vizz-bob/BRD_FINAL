import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SyntheticAlertsTrend({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 w-full min-w-0">
        <h2 className="text-sm sm:text-[16px] font-bold text-black mb-4 sm:mb-6">Synthetic ID Alerts (Weekly)</h2>
        <div className="h-48 sm:h-64 flex items-center justify-center text-sm text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 w-full min-w-0">
      <h2 className="text-sm sm:text-[16px] font-bold text-black mb-4 sm:mb-6">Synthetic ID Alerts (Weekly)</h2>

      <div className="h-48 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              axisLine={{ stroke: '#9ca3af' }}
              tickLine={{ stroke: '#9ca3af' }}
              tick={{ fill: '#4b5563', fontSize: 11 }}
              tickFormatter={(val) => {
                const date = new Date(val);
                return isNaN(date) ? String(val) : date.toLocaleDateString("en-US", { weekday: "short" });
              }}
            />
            <YAxis
              axisLine={{ stroke: '#9ca3af' }}
              tickLine={{ stroke: '#9ca3af' }}
              tick={{ fill: '#4b5563', fontSize: 11 }}
              width={30}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ fill: '#ffffff', stroke: '#dc2626', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#dc2626', stroke: "none" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}