import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const LoanTrendChart = ({ data }) => {
  // अगर डेटा नहीं है, तो खाली array इस्तेमाल करें
  const chartData = data && data.length > 0 ? data : [];

  return (
    <div className="bg-white p-6 rounded-xl shadow ">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Loan Trends (Disbursement)
        </h2>
        
        {/* Backend se abhi filter logic nahi juda hai, isliye static text ya hidden rakh sakte hain */}
        <div className="text-sm text-gray-500">Monthly View</div>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb" }}
          />
          <Legend />

          {/* Active/Disbursed Loans Line */}
          <Line
            type="monotone"
            dataKey="amount"  // Backend 'amount' bhej raha hai
            stroke="#2563EB"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
            name="Disbursed Amount"
          />
        </LineChart>
      </ResponsiveContainer>

      {chartData.length === 0 && (
        <div className="text-center text-gray-400 mt-4 text-sm">
          No loan data found in backend.
        </div>
      )}
    </div>
  );
};

export default LoanTrendChart;