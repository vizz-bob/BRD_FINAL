import React, { useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { ConversionTargetService } from "../../../services/financeService";

const ConversionTargets = () => {
  
  const [conversionsData, setConversionsData] = React.useState([]);
  const fetchData = async () => {
    try {
      const response = await ConversionTargetService.overView();

      const mapped = response.data.map(item => ({
        label: item.label === "DEALS" ? "Deal Closure" : "Lead Qualification",
        stage: item.stage,
        targetRate: item.target_rate,
        actualRate: item.actual_rate,
        achievement: item.achievement,
      }));

      setConversionsData(mapped);

    } catch (error) {
      console.error("Error fetching conversion targets:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getStatus = (achievement) => {

    if (achievement >= 100) return "Achieved";
    if (achievement >= 85) return "On Track";
    if (achievement >= 70) return "At Risk";
    return "Behind Target";
  };

  const statusMeta = {
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
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Conversion Targets
        </h2>
        <p className="text-sm text-gray-500">
          Measure efficiency of lead progression through the sales funnel.
        </p>
      </div>

      {/* Conversion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {conversionsData.map((c, idx) => {
          const status = getStatus(c.achievement);
          const MetaIcon = statusMeta[status].icon;

          return (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">{c.label}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {c.stage}
                  </p>
                </div>

                <div
                  className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${statusMeta[status].bg} ${statusMeta[status].color}`}
                >
                  <MetaIcon className="w-4 h-4" />
                  <span>{status}</span>
                </div>
              </div>

              {/* Rates */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Target Rate
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {c.targetRate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Actual Rate
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {c.actualRate?.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Achievement</span>
                  <span>{c.achievement}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600"
                    style={{
                      width: `${Math.min(c.achievement, 100)}%`
                    }}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500">
                {c.achieved} of {c.total} converted successfully.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversionTargets;
