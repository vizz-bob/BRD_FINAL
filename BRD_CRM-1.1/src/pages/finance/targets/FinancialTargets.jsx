import React from "react";
import {
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { FinancialTargetService } from "../../../services/financeService";

const FinancialTargets = () => {
  const today = 20;
  const daysInMonth = 30;
  
  const [financialsData, setFinancialsData] = React.useState([]);
  const fetchData = async () => {
    try {
      const response = await FinancialTargetService.overView();

      const mapped = response.data.map(item => ({
        label: item.label,
        target: item.target,
        achieved: item.achieved,
        achievement: item.achievement
      }));

      setFinancialsData(mapped);

    } catch (error) {
      console.error("Error fetching financial targets:", error);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  const getStatus = (achieved, target) => {
    const percent = (achieved / target) * 100;
    const expectedPacing = (today / daysInMonth) * 100;

    if (percent >= 110) return "Exceeded";
    if (percent >= 100) return "Achieved";
    if (percent >= expectedPacing) return "On Track";
    if (today >= 20 && percent < 60) return "Forecast Gap";
    if (today >= 20 && percent < 80) return "Behind Target";
    return "At Risk";
  };

  const statusMeta = {
    Exceeded: {
      icon: TrendingUp,
      color: "text-green-700",
      bg: "bg-green-100"
    },
    Achieved: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    "On Track": {
      icon: CheckCircle,
      color: "text-indigo-600",
      bg: "bg-indigo-100"
    },
    "At Risk": {
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-100"
    },
    "Behind Target": {
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100"
    },
    "Forecast Gap": {
      icon: AlertTriangle,
      color: "text-red-700",
      bg: "bg-red-200"
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Financial Targets
        </h2>
        <p className="text-sm text-gray-500">
          Track revenue and disbursement performance against defined goals.
        </p>
      </div>

      {/* Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {financialsData.map((f, idx) => {
          const percent = Math.round((f.achieved / f.target) * 100);
          const variance = f.target - f.achieved;
          const status = getStatus(f.achieved, f.target);
          const MetaIcon = statusMeta[status].icon;

          return (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <IndianRupee className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{f.label}</p>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{(f.achieved / 10000000).toFixed(2)}Cr / ₹
                      {(f.target / 10000000).toFixed(2)}Cr
                    </p>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${statusMeta[status].bg} ${statusMeta[status].color}`}
                >
                  <MetaIcon className="w-4 h-4" />
                  <span>{status}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Achievement</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600"
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Variance */}
              <p className="text-sm text-gray-600">
                Variance:{" "}
                <span className="font-medium text-red-600">
                  ₹{(variance / 10000000).toFixed(2)}Cr
                </span>
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Expected pacing by day {today}:{" "}
                {Math.round((today / daysInMonth) * 100)}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinancialTargets;
