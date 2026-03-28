// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// export default function MonthlyDisbursementChart({ data }) {
//   return (
//     <div className="bg-white rounded-xl shadow-card p-4 border border-gray-100">
//       <div className="text-sm font-medium mb-2 text-gray-900">Monthly Loan Disbursement</div>
//       <div className="h-64">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data} margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//             <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} />
//             <YAxis tick={{ fill: '#475569', fontSize: 12 }} tickFormatter={(v) => new Intl.NumberFormat('en-IN').format(v)} />
//             <Tooltip 
//               contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, color: '#0f172a' }}
//               labelStyle={{ color: '#0f172a', fontWeight: 600 }}
//               itemStyle={{ color: '#2563eb' }}
//               formatter={(value) => new Intl.NumberFormat('en-IN').format(value)}
//             />
//             <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   )
// }

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonthlyDisbursementChart({ data }) {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl shadow-card border border-gray-100">
        <p className="text-sm">No monthly disbursement data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
      <div className="text-sm font-medium mb-4 text-gray-900">Monthly Loan Disbursement</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            {/* Axes */}
            <XAxis
              dataKey="month"
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 12 }}
              tickFormatter={(v) => new Intl.NumberFormat('en-IN').format(v)}
              axisLine={{ stroke: '#cbd5e1' }}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, color: '#0f172a', fontSize: 13 }}
              labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              itemStyle={{ color: '#2563eb' }}
              formatter={(value) => `₹${new Intl.NumberFormat('en-IN').format(value)}`}
            />

            {/* Gradient fill */}
            <defs>
              <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Line */}
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 6 }}
              fill="url(#line-gradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
