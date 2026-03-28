import React, { useEffect } from "react";
import {
  Target,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { TargetService } from "../../../services/financeService";

const TargetOverview = () => {
  const [data,setData] = React.useState({});
  const fetchData = async () => {
    try {
      const response = await TargetService.overView();
      setData(response.data);
    } catch (error) {
      console.error("Error fetching financial target data:", error);
    }  };
  useEffect(() => {
    fetchData();
  },[]);

  const achievementPercent = Math.round(
    (data.achieved / data.target) * 100
  );

  const variance = data.target - data.achieved;

  const status =
    achievementPercent >= 100
      ? "Exceeded"
      : achievementPercent >= 90
      ? "Achieved"
      : achievementPercent >= 80
      ? "On Track"
      : "Behind Target";

  const statusMeta = {
    Exceeded: {
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    Achieved: {
      icon: CheckCircle,
      color: "text-indigo-600",
      bg: "bg-indigo-100"
    },
    "On Track": {
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-100"
    },
    "Behind Target": {
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100"
    }
  };

  const StatusIcon = statusMeta[status].icon;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase">Target</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{(data.target / 10000000).toFixed(1)}Cr
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase">Achieved</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{(data.achieved / 10000000).toFixed(1)}Cr
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase">Achievement</p>
          <p className="text-2xl font-bold text-gray-900">
            {achievementPercent}%
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase">Variance</p>
          <p className="text-2xl font-bold text-red-600">
            ₹{(variance / 10000000).toFixed(1)}Cr
          </p>
        </div>
      </div>

      {/* Status & Prediction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${statusMeta[status].bg}`}>
              <StatusIcon
                className={`w-5 h-5 ${statusMeta[status].color}`}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <p className="text-lg font-bold text-gray-900">{status}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Performance is tracked automatically based on achieved revenue
            against defined targets. Status updates dynamically as progress
            changes.
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Forecast Insight</p>
              <p className="text-lg font-bold text-gray-900">
                Predictive Closing
              </p>
            </div>
          </div>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>
              Hot Leads in pipeline:{" "}
              <span className="font-medium">{data.hotLeads}</span>
            </li>
            <li>
              Team closing ratio:{" "}
              <span className="font-medium">
                {(data.closingRatio * 100).toFixed(1)}%
              </span>
            </li>
            <li>
              Estimated future revenue is being calculated by the Forecasts
              engine.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TargetOverview;
