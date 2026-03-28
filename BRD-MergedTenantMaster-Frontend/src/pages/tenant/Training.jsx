import {
  BookOpenIcon,
  PlayCircleIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function Training() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/training/modules/");
      setModules(Array.isArray(res.data) ? res.data : (res.data?.results || []));
      setError(null);
    } catch (err) {
      console.error("Failed to load modules", err);
      setError("Failed to load training modules. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const completedCount = (Array.isArray(modules) ? modules : []).filter(mod => mod.completed).length;
  const pendingCount = (Array.isArray(modules) ? modules : []).filter(mod => !mod.completed).length;
  const totalCount = (Array.isArray(modules) ? modules : []).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-slate-50">

      {/* Header */}
      <div className="mb-8 md:mb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2 md:gap-3 flex-wrap">
          <AcademicCapIcon className="h-8 w-8 md:h-10 md:w-10 text-blue-600 shrink-0" />
          LMS Academy
        </h1>
        <p className="text-slate-500 font-medium mt-2 text-sm md:text-base">
          Mandatory training modules for Sales and Operations teams.
        </p>
      </div>

      {/* Stats — 1 col mobile → 3 col sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 md:gap-4">
          <div className="p-2.5 md:p-3 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
            <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Completed</p>
            <p className="text-xl md:text-2xl font-bold text-slate-800">{completedCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 md:gap-4">
          <div className="p-2.5 md:p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0">
            <ClockIcon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Pending</p>
            <p className="text-xl md:text-2xl font-bold text-slate-800">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 md:gap-4">
          <div className="p-2.5 md:p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
            <BookOpenIcon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Library</p>
            <p className="text-xl md:text-2xl font-bold text-slate-800">{totalCount}</p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-500 text-sm">Loading training modules...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          <p>{error}</p>
          <button
            onClick={fetchModules}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded text-sm transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && (Array.isArray(modules) ? modules : []).length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="h-14 w-14 md:h-16 md:w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-medium text-slate-700 mb-2">No training modules available</h3>
          <p className="text-slate-500 text-sm">Check back later for new training materials.</p>
        </div>
      )}

      {/* Modules grid — 1 col mobile → 2 col md → 3 col lg */}
      {!loading && !error && (Array.isArray(modules) ? modules : []).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(Array.isArray(modules) ? modules : []).map((mod) => (
            <div
              key={mod.id}
              className={`bg-white p-5 md:p-6 rounded-2xl border ${mod.completed ? 'border-emerald-200' : 'border-slate-200'} hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap">
                  {mod.category}
                </span>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {mod.completed && <CheckCircleIcon className="w-5 h-5 text-emerald-500" />}
                  {mod.type === "VIDEO"
                    ? <PlayCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-rose-500" />
                    : <BookOpenIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                  }
                </div>
              </div>
              <h3 className="font-bold text-base md:text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition">
                {mod.title}
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-5 md:mb-6">
                {mod.duration} • {mod.type} Format
              </p>
              <button className={`w-full py-3 rounded-xl border font-bold text-xs transition flex items-center justify-center gap-2 ${mod.completed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                }`}>
                {mod.completed ? (
                  <>Completed</>
                ) : (
                  <><ArrowDownTrayIcon className="w-4 h-4" /> Download Material</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
