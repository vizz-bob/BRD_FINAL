import React, { useState, useEffect } from "react";
import { CircleDollarSign, Download, TrendingUp, Activity } from "lucide-react";
import { incentiveService } from "../services/home"; // Using the consolidated service in home.js
import { useAuth } from "../context/AuthContext";

export default function IncentivesPage() {
  const { user } = useAuth();
  const [incentives, setIncentives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncentives = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await incentiveService.getAll({ team_member: user?.id });
      console.log("Incentives loaded from backend:", data);

      const results = Array.isArray(data) ? data : (data.results || []);
      setIncentives(results);
    } catch (err) {
      console.error("Failed to fetch incentives:", err);
      setError("Failed to load earnings data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchIncentives();
  }, [user]);

  // Derive display data from backend results
  const latestIncentive = incentives[0] || null;
  const totalIncentiveAmount = incentives.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const monthlyHistory = incentives.map(item => ({
    month: item.month_display,
    amount: `₹ ${new Intl.NumberFormat('en-IN').format(item.amount)}`,
    status: new Date(item.month) > new Date() ? "Pending" : "Paid"
  }));

  // Create a dynamic breakup based on the latest incentive or mocks
  const incentiveBreakup = latestIncentive ? [
    {
      title: "Disbursed Volume",
      value: `${latestIncentive.disbursed_leads} leads`,
      incentive: `₹ ${new Intl.NumberFormat('en-IN').format(parseFloat(latestIncentive.amount) * 0.7)}`,
      progress: Math.min(100, latestIncentive.disbursed_leads * 5),
    },
    {
      title: "Conversion Accelerator",
      value: "48% ratio",
      incentive: `₹ ${new Intl.NumberFormat('en-IN').format(parseFloat(latestIncentive.amount) * 0.15)}`,
      progress: 48,
    },
    {
      title: "Speed To Submit",
      value: "32 hrs avg",
      incentive: `₹ ${new Intl.NumberFormat('en-IN').format(parseFloat(latestIncentive.amount) * 0.1)}`,
      progress: 85,
    },
    {
      title: "Team Bonus",
      value: "Qualified",
      incentive: `₹ ${new Intl.NumberFormat('en-IN').format(parseFloat(latestIncentive.amount) * 0.05)}`,
      progress: 100,
    },
  ] : [];

  const handleDownloadStatement = () => {
    if (incentives.length === 0) return;

    const statementContent = [
      ["Month", "Amount", "Leads", "Status"],
      ...incentives.map((item) => [
        item.month_display,
        item.amount,
        item.disbursed_leads,
        new Date(item.month) > new Date() ? "Pending" : "Processed"
      ]),
      ["", "", "", ""],
      ["Total Incentive", totalIncentiveAmount, "", ""],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([statementContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `incentive_statement_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 animate-pulse">
        <CircleDollarSign className="h-10 w-10 mx-auto mb-4 text-brand-emerald/30" />
        <p className="text-lg">Calculating your commissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Earnings & Incentives</h1>
          <p className="text-sm text-slate-500 mt-1">Track your performance-based payouts</p>
        </div>
        <button
          onClick={handleDownloadStatement}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:border-brand-blue hover:text-brand-blue transition-all shadow-sm"
        >
          <Download className="h-4 w-4" />
          Download Statement
        </button>
      </div>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-1">Total Earnings</p>
                <h2 className="text-4xl font-black text-brand-navy">
                  ₹ {new Intl.NumberFormat('en-IN').format(totalIncentiveAmount)}
                </h2>
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
                  Last sync: Today
                </p>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center group-hover:bg-brand-emerald/20 transition-colors">
                <CircleDollarSign className="h-8 w-8 text-brand-emerald" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-brand-emerald bg-brand-emerald/5 w-fit px-3 py-1 rounded-full">
              <TrendingUp className="h-4 w-4" />
              <span>+12.5% vs previous cycle</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-brand-emerald/5 rounded-full blur-3xl group-hover:bg-brand-emerald/10 transition-colors"></div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Payment History</h2>
            <button onClick={fetchIncentives} className="text-xs font-bold text-brand-blue hover:underline">Refresh</button>
          </div>
          <div className="space-y-4">
            {monthlyHistory.length > 0 ? monthlyHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-4 last:pb-0"
              >
                <div>
                  <p className="font-bold text-sm text-slate-800">{item.month}</p>
                  <p className={`text-[10px] font-black uppercase tracking-tighter ${item.status === 'Paid' ? 'text-brand-emerald' : 'text-amber-500'}`}>
                    {item.status}
                  </p>
                </div>
                <p className="font-black text-brand-blue text-lg">{item.amount}</p>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-4">No payment history found.</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Commission Breakup</h2>
            <p className="text-sm text-slate-500 mt-1">Detailed calculation for current period</p>
          </div>
          <Activity className="h-6 w-6 text-brand-blue/30" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {incentiveBreakup.length > 0 ? incentiveBreakup.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-50/50 border border-slate-100 p-5 hover:bg-white hover:shadow-md transition-all group"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.title}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{item.value}</p>
                </div>

                <div className="mt-auto">
                  <p className="text-xl font-black text-brand-blue mb-3 group-hover:scale-105 transition-transform origin-left">
                    {item.incentive}
                  </p>

                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-emerald transition-all duration-1000"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-10 text-center text-slate-400 italic">
              No active leads calculated in this cycle yet.
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl bg-brand-navy p-6 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <p className="font-bold text-brand-sky text-sm">Dashboard Status: <span className="text-white">Active</span></p>
            <p className="text-xs text-white/60 mt-2 max-w-md">
              Payouts are auto-calculated based on disbursed volume and data quality. Field incentives refresh every 4 hours to reflect site visits and documentation updates.
            </p>
          </div>
          <Activity className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 rotate-12" />
        </div>
      </section>
    </div>
  );
}