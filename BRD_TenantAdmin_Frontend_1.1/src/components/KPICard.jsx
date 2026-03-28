export default function KPICard({ icon, title, value, trend }) {
  const Icon = icon;
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary-50 text-primary-700 grid place-items-center flex-shrink-0">
          {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
        </div>
        {trend != null && (
          <div className="text-green-600 text-xs sm:text-sm font-medium">{trend}</div>
        )}
      </div>
      <div className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">{value}</div>
      <div className="text-xs sm:text-sm text-gray-600 leading-tight">{title}</div>
    </div>
  );
}