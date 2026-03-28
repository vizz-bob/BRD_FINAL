import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts";

const ActiveUserChart = ({ usersPerBranch }) => {
  // Backend se data 'usersPerBranch' prop ke zariye aayega
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("week"); // Filter UI ke liye, par abhi data backend se raw aayega

  useEffect(() => {
    if (usersPerBranch && usersPerBranch.length > 0) {
      setChartData(usersPerBranch);
    }
  }, [usersPerBranch]);

  // Auto-color logic
  const getColor = (value) => {
    if (value > 1500) return "#22C55E"; // Green
    if (value > 500) return "#3B82F6"; // Blue
    return "#005DA6"; // blue dark
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Active Users Analytics
        </h2>

        {/* Filter Dropdown (Optional: Backend logic required for real filtering) */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" /> {/* Backend should send 'label' (e.g. Mon, Tue or Branch A) */}
          <YAxis />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
          />
          <Legend />

          <Bar dataKey="users" radius={[8, 8, 0, 0]} name="Active Users">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.users || 0)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {(!chartData || chartData.length === 0) && (
        <div className="text-center text-gray-400 text-sm mt-4">
          No user activity data available from backend
        </div>
      )}
    </div>
  );
};

export default ActiveUserChart;