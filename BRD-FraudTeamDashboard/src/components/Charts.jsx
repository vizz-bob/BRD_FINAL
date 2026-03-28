// ===== Chart.jsx =====
import React from "react";

export default function Chart() {
  const data = [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 35 },
    { month: "Mar", value: 28 },
    { month: "Apr", value: 45 },
    { month: "May", value: 30 },
    { month: "Jun", value: 50 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-2 sm:gap-4 h-36 sm:h-48 w-full overflow-x-auto pb-1">
      {data.map((d) => (
        <div key={d.month} className="flex flex-col items-center flex-1 min-w-[32px]">
          <div
            className="w-full bg-blue-500 rounded-t-md transition-all duration-300"
            style={{ height: `${(d.value / maxValue) * 100}%` }}
          />
          <span className="text-xs sm:text-sm mt-1 sm:mt-2 text-gray-700">{d.month}</span>
        </div>
      ))}
    </div>
  );
}