import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";

const colorMap = {
  "HIGH RISK": "#ef4444",
  "MEDIUM RISK": "#f59e0b",
  "LOW RISK": "#10b981",
};

const PIE_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get("/analytics/dashboard/")
      .then((res) => setAnalytics(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-center justify-center">
        <div>Loading analytics...</div>
      </div>
    );
  }

  // 1. FRAUD SCORE DISTRIBUTION MAPPING
  const fraudScoreData = Object.entries(
    analytics.risk_score_distribution || {}
  ).map(([range, count]) => ({ range, count }));

  // 2. RISK CATEGORY PIE MAPPING
  const pieDataRaw = analytics.risk_distribution || [];
  const pieData = pieDataRaw.map(item => {
    let rawName = String(item.risk_level || "").toUpperCase().trim();
    let finalName =
      rawName === "HIGH" || rawName === "HIGH RISK" ? "HIGH RISK" :
      rawName === "MEDIUM" || rawName === "MEDIUM RISK" ? "MEDIUM RISK" :
      rawName === "LOW" || rawName === "LOW RISK" ? "LOW RISK" : rawName;
    if (!finalName.includes("RISK") && finalName !== "") finalName = `${finalName} RISK`;
    return {
      name: finalName.substring(0, 3).toLowerCase(),
      value: item.count || item.value || 0
    };
  });

  // 3. SYNTHETIC ID WEEKLY MAPPING
  const syntheticData = Array.isArray(analytics.synthetic_id_weekly)
    ? analytics.synthetic_id_weekly.map(d => ({ ...d, name: d.name.toLowerCase() }))
    : [];

  // 4. AML HITS WEEKLY MAPPING
  const amlData = Array.isArray(analytics.aml_hits_weekly)
    ? analytics.aml_hits_weekly.map(d => ({ ...d, name: d.name.toLowerCase() }))
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-3 sm:p-4 lg:p-0">

      {/* Fraud Score Distribution */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 w-full min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-black mb-4 sm:mb-6">
          Fraud Score Distribution
        </h3>
        <div style={{ height: 220, width: '100%' }} className="sm:!h-64">
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            <BarChart data={fraudScoreData}>
              <XAxis
                dataKey="range"
                axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                tickLine={{ stroke: '#9ca3af' }}
                tick={{ fill: '#4b5563', fontSize: 11 }}
              />
              <YAxis
                axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                tickLine={{ stroke: '#9ca3af' }}
                tick={{ fill: '#4b5563', fontSize: 11 }}
              />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="count" fill="#4f46e5" barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Category Pie */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 w-full min-w-0 flex flex-col">
        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-4 sm:mb-6">
          Risk Category Pie
        </h3>
        <div className="flex-1 flex flex-row items-center gap-4 sm:gap-10">
          {/* PIE CHART */}
          <div className="w-[45%] flex justify-center items-center" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={0}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                  isAnimationActive={false}
                >
                  {pieData.map((item, i) => (
                    <Cell
                      key={i}
                      fill={colorMap[item.name.toUpperCase()] || PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value, name) => [value, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* LEGEND */}
          <div className="w-[55%] flex flex-col justify-center gap-2 sm:gap-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center text-xs sm:text-sm text-gray-700">
                <span
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-2 sm:mr-3 flex-shrink-0"
                  style={{ backgroundColor: colorMap[item.name.toUpperCase()] || PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="font-medium truncate">
                  {item.name.replace(/\b\w/g, l => l.toUpperCase())}
                  &nbsp;
                  <span className="font-bold text-gray-900">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Synthetic ID Alerts */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 w-full min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-black mb-4 sm:mb-6">
          Synthetic ID Alerts (Weekly)
        </h3>
        <div style={{ height: 220, width: '100%', position: 'relative' }} className="sm:!h-64">
          <div style={{ position: 'absolute', top: -20, left: 40, fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
            Alerts
          </div>
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            <LineChart data={syntheticData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <XAxis
                dataKey="name"
                label={{ value: 'Days', position: 'bottom', offset: 0, fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                padding={{ left: 10, right: 10 }}
                axisLine={{ stroke: '#94a3b8', strokeWidth: 1.5 }}
                tickLine={{ stroke: '#94a3b8' }}
                tick={{ fill: '#475569', fontSize: 11 }}
              />
              <YAxis
                domain={[0, 12]}
                ticks={[0, 3, 6, 9, 12]}
                axisLine={{ stroke: '#94a3b8', strokeWidth: 1.5 }}
                tickLine={{ stroke: '#94a3b8' }}
                tick={{ fill: '#475569', fontSize: 11 }}
              />
              <Tooltip
                labelStyle={{ color: '#4b5563', fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}
                itemStyle={{ color: '#ef4444', fontSize: '12px', fontWeight: 500, padding: 0 }}
                formatter={(value) => [value, 'value ']}
              />
              <Line
                type="linear"
                dataKey="value"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: '#ffffff', stroke: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#ef4444', stroke: "none" }}
                isAnimationActive={false}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AML Hits */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 w-full min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-black mb-4 sm:mb-6">
          AML Sanction Hits (Weekly)
        </h3>
        <div style={{ height: 220, width: '100%', position: 'relative' }} className="sm:!h-64">
          <div style={{ position: 'absolute', top: -20, left: 40, fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
            Hits
          </div>
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            <LineChart data={amlData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <XAxis
                dataKey="name"
                label={{ value: 'Days', position: 'bottom', offset: 0, fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                padding={{ left: 10, right: 10 }}
                axisLine={{ stroke: '#94a3b8', strokeWidth: 1.5 }}
                tickLine={{ stroke: '#94a3b8' }}
                tick={{ fill: '#475569', fontSize: 11 }}
              />
              <YAxis
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
                axisLine={{ stroke: '#94a3b8', strokeWidth: 1.5 }}
                tickLine={{ stroke: '#94a3b8' }}
                tick={{ fill: '#475569', fontSize: 11 }}
              />
              <Tooltip
                labelStyle={{ color: '#4b5563', fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}
                itemStyle={{ color: '#3b82f6', fontSize: '12px', fontWeight: 500, padding: 0 }}
                formatter={(value) => [value, 'value ']}
              />
              <Line
                type="linear"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: '#ffffff', stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: "none" }}
                isAnimationActive={false}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}