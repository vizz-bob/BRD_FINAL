import React from "react";
import { UsersIcon, ClipboardDocumentCheckIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const primary = {
  50: "#eff6ff",
  600: "#2563eb",
};

export const StatCard = ({ icon: Icon, title, value, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-4 border border-gray-100 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-700 grid place-items-center">
          {Icon && <Icon className="h-5 w-5" style={{ color: primary[600] }} />}
        </div>
        {trend != null && (
          <div className={`text-sm font-semibold ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
};




export const DocumentValidationStatCard = ({ title, mainValue, subText, trendValue, trendType, icon: Icon }) => {
  const trendColor =
    trendType === "up" ? "text-green-600" : trendType === "down" ? "text-red-600" : "";

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-700 grid place-items-center">
          {Icon && <Icon className="h-5 w-5 text-blue-600" />} {/* ✅ use capitalized Icon */}
        </div>
        {trendValue != null && (
          <div className={`text-sm font-semibold ${trendColor}`}>
            {trendType === "up" ? "↑" : trendType === "down" ? "↓" : ""} {Math.abs(trendValue)}%
          </div>
        )}
      </div>
      <div className="mt-3 text-2xl font-semibold">{mainValue}</div>
      <div className="text-sm text-gray-600">{title}</div>
      {subText && <div className="text-xs text-gray-500 mt-1">{subText}</div>}
    </div>
  );
};



export const SimpleTable = ({ headers, data, onRowSelect = () => {}, selectedRows = [] }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {onRowSelect && (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                onChange={() => {
                  if (onRowSelect) {
                    if (selectedRows.length === data.length) {
                      onRowSelect([]);
                    } else {
                      onRowSelect(data.map((_, index) => index));
                    }
                  }
                }}
                checked={selectedRows.length === data.length && data.length > 0}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
            </th>
          )}
          {headers.map((header, idx) => (
            <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, idx) => (
          <tr key={idx}>
            {onRowSelect && (
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(idx)}
                  onChange={() => onRowSelect(idx)}
                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
              </td>
            )}
            {headers.map((header, cellIdx) => (
              <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const DashboardMetrics = ({ items, onClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {items.map((item, idx) => (
      <StatCard key={idx} {...item} onClick={onClick} />
    ))}
  </div>
);

export const DocumentVerificationMetrics = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <DocumentValidationStatCard key={idx} {...item} />
      ))}
    </div>
  );
};

