export default function StatCard({ title, value, subtext, icon: Icon, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header with Icon and Trend */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          {Icon && <Icon className="h-6 w-6 text-blue-600" />}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded ${
            trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend}
          </span>
        )}
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      
      {/* Title */}
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      
      {/* Subtext */}
      {subtext && (
        <p className="text-gray-400 text-xs mt-2">{subtext}</p>
      )}
    </div>
  );
}