import React, { useEffect } from "react";
import {
  PhoneCall,
  Users,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { ActivityTargetService } from "../../../services/financeService";

const ActivityTargets = () => {
  const today = 20;
  const daysInMonth = 30;

  const activities = [];
  const [activitiesData, setActivitiesData] = React.useState(activities);
  const fetchData = async () => {
    try {
      const response = await ActivityTargetService.overView();

      const mapped = response.data.map(item => ({
        label: item.activity === "calls" ? "Calls" : "Meetings",
        achieved: item.achieved,
        target: item.target,
        icon: Users
      }));

      setActivitiesData(mapped);

    } catch (error) {
      console.error("Error fetching activity targets:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getStatus = (achieved, target) => {
    if (!target) return "At Risk";

    const percent = (achieved / target) * 100;
    const expectedPacing = (today / daysInMonth) * 100;

    if (percent >= 100) return "Achieved";
    if (percent >= expectedPacing) return "On Track";
    if (today >= 20 && percent < 80) return "Behind Target";
    return "At Risk";
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
          Activity Targets
        </h2>
        <p className="text-sm text-gray-500">
          Monitor daily activity pacing to keep the sales pipeline healthy.
        </p>
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activitiesData.map((a, idx) => {
          const percent =
            a.target > 0
              ? Math.round((a.achieved / a.target) * 100)
              : 0;
          const status = getStatus(a.achieved, a.target);
          const MetaIcon = statusMeta[status].icon;
          const Icon = a.icon;

          return (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{a.label}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {a.achieved} / {a.target}
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
                  <span>Progress</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500">
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

export default ActivityTargets;
