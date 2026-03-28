import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

export function FraudTypeChart() {

    const fraudTypeData = [
        { name: "Identity Theft", value: 45, color: "#3b82f6" },
        { name: "Loan Fraud", value: 30, color: "#f59e0b" },
        { name: "Card Fraud", value: 20, color: "#10b981" },
        { name: "Insurance Scam", value: 10, color: "#ef4444" },
    ];

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];


    return (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Fraud Type Breakdown</h2>
          <div className="h-80 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fraudTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {fraudTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
    )
}