import React, { useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { TargetHistoryService } from "../../../services/financeService";

const TargetHistory = () => {
  const [data, setData] = React.useState([]);
  const fetchData = async () => {
    try {
      const res = await TargetHistoryService.overView();
      setData(res.data);
    }
    catch (error) {
      console.error("Error fetching target history:", error);
    }
  }
  useEffect(()=>{
    fetchData();
  },[])

  const getTrend = (current, previous) => {
    if (!previous) return "neutral";
    if (current > previous) return "up";
    if (current < previous) return "down";
    return "neutral";
  };

  const trendMeta = {
    up: {
      icon: TrendingUp,
      color: "text-green-600"
    },
    down: {
      icon: TrendingDown,
      color: "text-red-600"
    },
    neutral: {
      icon: Minus,
      color: "text-gray-400"
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Target History
        </h2>
        <p className="text-sm text-gray-500">
          Review historical performance to identify trends and consistency.
        </p>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Period
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Target
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Achieved
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Achievement
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Trend
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((h, idx) => {
              const achievement = Math.round(
                (h.achieved / h.target) * 100
              );
              const previous = history[idx - 1]?.achieved;
              const trend = getTrend(h.achieved, previous);
              const TrendIcon = trendMeta[trend].icon;

              return (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {h.period}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    ₹{(h.target / 10000000).toFixed(1)}Cr
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    ₹{(h.achieved / 10000000).toFixed(1)}Cr
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium text-right ${
                      achievement >= 100
                        ? "text-green-600"
                        : achievement >= 85
                        ? "text-indigo-600"
                        : "text-red-600"
                    }`}
                  >
                    {achievement}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <TrendIcon
                      className={`w-5 h-5 mx-auto ${trendMeta[trend].color}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TargetHistory;
