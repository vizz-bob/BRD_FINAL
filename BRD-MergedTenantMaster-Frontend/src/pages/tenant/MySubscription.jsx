import { useEffect, useState } from "react";
import { subscriptionAPI } from "../../services/subscriptionService";
import {
  CheckCircle,
  AlertCircle,
  CreditCard,
  Users,
  Briefcase,
  Calendar,
  ArrowUpCircle,
  PauseCircle,
  XCircle,
  PlayCircle,
  X,
} from "lucide-react";

// Simple Upgrade Modal Component
const UpgradeModal = ({ isOpen, onClose, onUpgrade, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Upgrade Your Plan</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-600 mb-4">Choose a new plan to upgrade your subscription:</p>
          
          <div className="space-y-3">
            <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="font-medium text-gray-900">Premium Plan</div>
              <div className="text-sm text-gray-500">₹299/month</div>
              <div className="text-xs text-gray-400">Unlimited borrowers & users</div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="font-medium text-gray-900">Enterprise Plan</div>
              <div className="text-sm text-gray-500">₹599/month</div>
              <div className="text-xs text-gray-400">Everything + priority support</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpgrade('premium-plan-id')}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-sm transition-all"
          >
            {loading ? "Upgrading..." : "Upgrade Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MySubscription() {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [usageData] = useState({ current_borrowers: 0, current_users: 1 });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.getMySubscription();
      setSub(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || "Unable to load subscription");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const doAction = async (action) => {
    if (!window.confirm(`Are you sure you want to ${action} this subscription?`)) return;
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await subscriptionAPI.takeAction(action);
      setMessage({ type: "success", text: res.data.message });
      await load();
    } catch (e) {
      setMessage({ type: "error", text: e.response?.data?.detail || "Something went wrong" });
    }
    setActionLoading(false);
  };

  const handleUpgrade = async () => {
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async (planId) => {
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await subscriptionAPI.upgradePlan(planId);
      setMessage({ type: "success", text: "Plan upgraded successfully!" });
      await load();
      setShowUpgradeModal(false);
    } catch (e) {
      setMessage({ type: "error", text: e.response?.data?.detail || "Failed to upgrade plan" });
    }
    setActionLoading(false);
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} />;
  if (!sub) return <EmptyState />;

  const borrowerPercent = Math.min((usageData.current_borrowers / sub.no_of_borrowers) * 100, 100);
  const userPercent = Math.min((usageData.current_users / sub.no_of_users) * 100, 100);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5 sm:space-y-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">My Subscription</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your plan, limits, and billing details.</p>
        </div>
        <StatusBadge status={sub.status} />
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`p-3 sm:p-4 rounded-lg flex items-center gap-2 text-sm ${
          message.type === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Main Plan Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

          {/* Col 1: Plan Info */}
          <div className="space-y-4 md:border-r md:border-slate-100 md:pr-6">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Plan</div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">{sub.subscription_name}</div>
            </div>
            <div>
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-xl sm:text-2xl font-bold text-slate-900">₹{Number(sub.subscription_amount).toLocaleString()}</span>
                <span className="text-slate-500 text-sm">/ {sub.type_of}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Excludes taxes</div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <button 
                onClick={handleUpgrade}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <ArrowUpCircle size={16} /> Upgrade Plan
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                Renew
              </button>
            </div>
          </div>

          {/* Col 2: Usage */}
          <div className="space-y-5 md:border-r md:border-slate-100 md:pr-6">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Usage Limits</div>
            <UsageMeter
              icon={<Briefcase size={15} />}
              label="Active Borrowers"
              current={usageData.current_borrowers}
              limit={sub.no_of_borrowers}
              percent={borrowerPercent}
              color="emerald"
            />
            <UsageMeter
              icon={<Users size={15} />}
              label="System Users"
              current={usageData.current_users}
              limit={sub.no_of_users}
              percent={userPercent}
              color="blue"
            />
          </div>

          {/* Col 3: Dates + Actions */}
          <div className="space-y-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Validity</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500 shrink-0"><Calendar size={16} /></div>
                  <div>
                    <div className="text-xs text-slate-500">Started On</div>
                    <div className="font-medium text-slate-900 text-sm">{new Date(sub.subscription_from).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500 shrink-0"><CreditCard size={16} /></div>
                  <div>
                    <div className="text-xs text-slate-500">Renews On</div>
                    <div className="font-medium text-slate-900 text-sm">{new Date(sub.subscription_to).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 mb-2">Manage Status</p>
              <div className="flex flex-wrap gap-2">
                {sub.status === "Active" && (
                  <>
                    <SmallActionBtn label="Pause" icon={<PauseCircle size={14} />} onClick={() => doAction("pause")} loading={actionLoading} />
                    <SmallActionBtn label="Cancel" icon={<XCircle size={14} />} onClick={() => doAction("cancel")} loading={actionLoading} danger />
                  </>
                )}
                {sub.status === "Pause" && (
                  <SmallActionBtn label="Resume" icon={<PlayCircle size={14} />} onClick={() => doAction("resume")} loading={actionLoading} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Trial: "bg-purple-100 text-purple-700 border-purple-200",
    Pause: "bg-amber-100 text-amber-700 border-amber-200",
    Cancel: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return (
    <span className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status === "Active" && "● "}{status}
    </span>
  );
};

const UsageMeter = ({ icon, label, current, limit, percent, color }) => {
  const colorClasses = { emerald: "bg-emerald-500", blue: "bg-blue-500" };
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">{icon} {label}</div>
        <div className="text-xs font-bold text-slate-900">{current} <span className="text-slate-400 font-normal">/ {limit}</span></div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-2.5 rounded-full transition-all duration-500 ${colorClasses[color]}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

const SmallActionBtn = ({ label, icon, onClick, loading, danger }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors
      ${danger ? "border-rose-200 text-rose-600 hover:bg-rose-50" : "border-slate-200 text-slate-600 hover:bg-slate-50"}
      disabled:opacity-50`}
  >
    {icon} {loading ? "..." : label}
  </button>
);

const LoadingSkeleton = () => (
  <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5 animate-pulse">
    <div className="h-7 bg-slate-200 rounded w-1/3"></div>
    <div className="h-52 sm:h-64 bg-slate-100 rounded-2xl"></div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="p-4 sm:p-6 max-w-5xl mx-auto text-center py-12">
    <div className="inline-flex p-4 rounded-full bg-red-100 text-red-600 mb-4"><AlertCircle size={28} /></div>
    <h3 className="text-base sm:text-lg font-bold text-slate-900">Unable to load Subscription</h3>
    <p className="text-slate-500 text-sm mt-1">{message}</p>
  </div>
);

const EmptyState = () => (
  <div className="p-4 sm:p-6 max-w-5xl mx-auto text-center py-16 sm:py-20">
    <CreditCard size={40} className="mx-auto text-slate-300 mb-4" />
    <h3 className="text-base sm:text-lg font-bold text-slate-900">No Active Subscription</h3>
    <p className="text-slate-500 text-sm mt-1">Please choose a plan to get started.</p>
    <button className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition">
      View Plans
    </button>
  </div>
);
