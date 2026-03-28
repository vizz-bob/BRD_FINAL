import React from 'react'
import { IoWarningOutline } from "react-icons/io5";
import { HiExclamationTriangle } from "react-icons/hi2";

const AlertsPage = () => {
  return (
    <div><div className="bg-white rounded-xl p-5 shadow-sm  flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-800">Alerts</h2>
      <span className="text-xs text-blue-600 cursor-pointer hover:underline">
        View all
      </span>
    </div>

    <div className="space-y-3 overflow-y-auto pr-1 custom-scroll h-[300px]">

      {/* Critical */}
      <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg hover:shadow-sm transition cursor-pointer">
        <div className="w-11 h-11 flex items-center justify-center bg-red-100 rounded-full">
          <HiExclamationTriangle className="text-red-600 text-2xl" />
        </div>
        <div>
          <p className="text-red-700 font-semibold">API latency increased</p>
          <p className="text-xs text-red-500 mt-1">Critical • 5 minutes ago</p>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:shadow-sm transition cursor-pointer">
        <div className="w-11 h-11 flex items-center justify-center bg-yellow-100 rounded-full">
          <IoWarningOutline className="text-yellow-600 text-2xl" />
        </div>
        <div>
          <p className="text-yellow-700 font-semibold">Loan approval queue pending</p>
          <p className="text-xs text-yellow-500 mt-1">Warning • 20 minutes ago</p>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-sm transition cursor-pointer">
        <div className="w-11 h-11 flex items-center justify-center bg-blue-100 rounded-full">
          <IoWarningOutline className="text-blue-600 text-2xl" />
        </div>
        <div>
          <p className="text-blue-700 font-semibold">System running normally</p>
          <p className="text-xs text-blue-500 mt-1">Info • 1 hour ago</p>
        </div>
      </div>

    </div>
  </div></div>
  )
}

export default AlertsPage