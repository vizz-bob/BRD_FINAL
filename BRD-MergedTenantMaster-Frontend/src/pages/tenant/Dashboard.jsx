import React, { useEffect, useState } from 'react';
import { 
  UserGroupIcon, 
  UserCircleIcon, 
  ClipboardDocumentListIcon, 
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

// Components
import KPICard from '../../components/tenant/KPICard.jsx';
import MonthlyDisbursementChart from '../../components/tenant/MonthlyDisbursementChart.jsx';
import LoanStatusPieChart from '../../components/tenant/LoanStatusPieChart.jsx';
import PredictiveForecastWidget from '../../components/tenant/PredictiveForecastWidget.jsx';

// Services & Hooks
import { dashboardApi } from "../../services/dashboardService";
import { usePermissions } from "../../hooks/usePermissions"; 

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [charts, setCharts] = useState(null);
  const [error, setError] = useState(null);
  
  // Get User Permissions
  const { roleType, loading } = usePermissions();

  const statusItems = [
    { label: 'Active', color: '#2563eb' },
    { label: 'Paid Off', color: '#22c55e' },
    { label: 'Default', color: '#f43f5e' },
    { label: 'Pending', color: '#f59e0b' }
  ];

  const getCount = (label) => {
    const found = charts?.loanStatusDistribution?.find(
      x => (x.status || "").toLowerCase() === label.toLowerCase()
    );
    return found?.count ?? 0;
  };

  const fetchAll = async () => {
    try {
      const res = await dashboardApi.fetchDashboard();
      setKpis(res.data.kpis);
      setCharts(res.data.charts);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setCharts({ monthlyDisbursement: [], loanStatusDistribution: [] }); 
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 60000); 
    return () => clearInterval(interval);
  }, []);

  const hasMonthlyData = charts?.monthlyDisbursement?.length > 0;
  const hasLoanStatusData = charts?.loanStatusDistribution?.length > 0;

  if (loading) return <div className="p-10 text-center text-gray-400">Loading Dashboard...</div>;

  return (
  <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">

    {/* HEADER */}
    <div className="flex flex-wrap justify-between items-center gap-3">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Executive Overview</h1>
        <p className="text-sm text-gray-500">Welcome back, here is your daily performance summary.</p>
      </div>
    </div>

    {error && (
      <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3">{error}</div>
    )}

    {/* KPI CARDS */}
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
      <KPICard icon={UserGroupIcon} title="Total Borrowers" value={kpis?.totalTenants ?? "-"} />
      <KPICard icon={UserCircleIcon} title="Active Users" value={kpis?.activeUsers ?? "-"} />
      <KPICard icon={ClipboardDocumentListIcon} title="Total Loans" value={kpis?.totalLoans ?? "-"} />
      <KPICard icon={CurrencyDollarIcon} title="Disbursed Amount" value={kpis?.disbursedAmount ?? "-"} />
    </div>

    {/* PREDICTIVE ANALYTICS */}
    {(roleType === 'admin' || roleType === 'manager') && (
      <div className="w-full">
        <PredictiveForecastWidget />
      </div>
    )}

    {/* CHARTS ROW */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-card p-4 border border-gray-100">
        {hasMonthlyData ? (
          <MonthlyDisbursementChart data={charts.monthlyDisbursement} />
        ) : (
          <div className="text-center text-gray-400 py-20">No monthly disbursement data available</div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-card p-4 border border-gray-100">
        <div className="text-sm font-medium mb-2 text-gray-700">Loan Portfolio Health</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="space-y-3">
            {statusItems.map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-sm shadow-sm shrink-0" style={{ backgroundColor: s.color }}></span>
                  <span className="text-sm text-gray-600 font-medium">{s.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{getCount(s.label)}</span>
              </div>
            ))}
          </div>
          {hasLoanStatusData ? (
            <LoanStatusPieChart data={charts.loanStatusDistribution} />
          ) : (
            <div className="text-center text-gray-400 text-sm">No active loan data</div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
