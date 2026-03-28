import { useEffect, useState } from "react";
import { getFraudDashboard } from "../api/fraudDashboardApi";

import StatCard from "../components/dashboard/StatCard";
import {
  ShieldExclamationIcon,
  UserGroupIcon,
  CreditCardIcon,
  DocumentTextIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getFraudDashboard()
      .then(setData)
      .catch(() => setError("Failed to load dashboard data"));
  }, []);

  if (error) return <p className="text-red-600 p-4">{error}</p>;
  if (!data) return <p className="p-4">Loading...</p>;

  const stats = {
    fraudScore: data.avg_fraud_score ? `${data.avg_fraud_score}%` : "0%",
    fraudTrend: "+2.5%",
    syntheticAlerts: data.synthetic_weekly ? data.synthetic_weekly.reduce((acc, curr) => acc + curr.count, 0) : 0,
    syntheticTrend: "+12%",
    amlHits: data.aml_weekly ? data.aml_weekly.reduce((acc, curr) => acc + curr.count, 0) : 0,
    amlTrend: "-5%",
    behavioralFlags: data.behavioral_flags || 0,
    behavioralTrend: "+3%",
    patternMatches: data.pattern_matches || 0,
    patternTrend: "0%",
  };

  const summary = {
    totalCases: data.risk_distribution ? data.risk_distribution.reduce((acc, curr) => acc + curr.count, 0) : 0,
    highRiskCases: data.risk_distribution ? (data.risk_distribution.find(r => r.risk_level === "HIGH")?.count || 0) : 0,
    amlHitsToday: stats.amlHits,
  };

  const highRiskApplicants = data.highRiskApplicants || [];
  const alerts = data.alerts || [];

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Top Stats — 2 cols mobile, 3 sm, 5 xl */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
        <StatCard
          title="Fraud Score"
          value={stats.fraudScore}
          subtext="Updated 2 mins ago"
          icon={ShieldExclamationIcon}
          trend={stats.fraudTrend}
        />
        <StatCard
          title="Synthetic ID Alerts"
          value={stats.syntheticAlerts}
          subtext="3 new today"
          icon={UserGroupIcon}
          trend={stats.syntheticTrend}
        />
        <StatCard
          title="AML Hits"
          value={stats.amlHits}
          subtext="1 unresolved"
          icon={CreditCardIcon}
          trend={stats.amlTrend}
        />
        <StatCard
          title="Behavioral Flags"
          value={stats.behavioralFlags}
          subtext="Detected this week"
          icon={DocumentTextIcon}
          trend={stats.behavioralTrend}
        />
        <StatCard
          title="Pattern Matches"
          value={stats.patternMatches}
          subtext="High-risk patterns found"
          icon={BanknotesIcon}
          trend={stats.patternTrend}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Cases Today</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-gray-800">{summary.totalCases}</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500 font-medium">High Risk Cases</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-red-600">{summary.highRiskCases}</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500 font-medium">AML Hits</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-yellow-600">{summary.amlHitsToday}</p>
        </div>
      </div>

      {/* High Risk Applicants Table */}
      {highRiskApplicants.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Recent Applicants</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[480px]">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-gray-600">Case ID</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-gray-600">Name</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-gray-600">Fraud Score</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-gray-600">AML</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {highRiskApplicants.map((a) => (
                  <tr key={a.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">{a.id}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-800 font-medium">{a.name}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-red-600">{a.score}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        a.aml === "HIT" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}>
                        {a.aml}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Recent Alerts</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-1 xs:gap-0 pb-3 sm:pb-4 border-b border-gray-100 last:border-0"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">{alert.type}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{alert.detail}</p>
                </div>
                <span className="text-gray-400 text-xs whitespace-nowrap xs:ml-4 shrink-0">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}