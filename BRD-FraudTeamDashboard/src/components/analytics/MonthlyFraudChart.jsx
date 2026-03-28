import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

export function MonthlyFraudChart() {
    const monthlyFraudData = [
        { month: "Jan", frauds: 25 },
        { month: "Feb", frauds: 40 },
        { month: "Mar", frauds: 32 },
        { month: "Apr", frauds: 45 },
        { month: "May", frauds: 28 },
        { month: "Jun", frauds: 55 },
        { month: "Jul", frauds: 50 },
        { month: "Aug", frauds: 38 },
        { month: "Sep", frauds: 47 },
        { month: "Oct", frauds: 60 },
        { month: "Nov", frauds: 53 },
        { month: "Dec", frauds: 62 },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 w-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Monthly Fraud Trend</h2>
            <div className="h-56 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyFraudData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} width={30} />
                        <Tooltip />
                        <Bar dataKey="frauds" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}