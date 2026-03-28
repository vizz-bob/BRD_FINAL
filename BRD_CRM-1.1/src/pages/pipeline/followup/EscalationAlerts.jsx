import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  UserX,
  ShieldAlert,
  ArrowRight,
  Clock,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { escalationsService } from '../../../services/pipelineService';

const EscalationAlerts = () => {
  const getOverdueDetails = (lastFollowup) => {
    if (!lastFollowup) return "No follow-up recorded";

    const last = new Date(lastFollowup);
    const now = new Date();

    const diffMs = now - last;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    return `Overdue by ${diffHours} hours`;
  };
  const mapEscalation = (item) => {
    return {
      id: item.id,
      leadName: item.lead_name,
      agentName: item.assigned_agent,
      reason: item.escalation_type
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      details: getOverdueDetails(item.last_followup),
      risk: item.risk,
      missedCount: item.followup_missed_count,
    };
  };

  const [escalatedLeads, setEscalatedLeads] = useState([])
  const [statsData, setStatsData] = useState()

  const fetchDash = async () => {
    try{
      const res = await escalationsService.dashboard()
      setStatsData(res.data)
    }
    catch{
      console.log("failed to load dashboard")
    }
  }

  const fetchData = async () => {
    try {
      const res = await escalationsService.list()
      setEscalatedLeads(res.data.map(mapEscalation))
    }
    catch {
      console.log("failed to fetch")
    }
  }

  useEffect(() => {
    fetchData()
    fetchDash()
  }, [])

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
      {/* Escalation Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <ShieldAlert className="text-red-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-red-800 uppercase tracking-wider">Critical SLA Breaches</p>
            <p className="text-xl sm:text-2xl font-bold text-red-900">{statsData?.critical_sla}</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <UserX className="text-amber-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider">Double-Missed Leads</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-900">{statsData?.dormancy}</p>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <AlertCircle className="text-indigo-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-indigo-800 uppercase tracking-wider">Dormancy Risk</p>
            <p className="text-xl sm:text-2xl font-bold text-indigo-900">{statsData?.double_missed}</p>
          </div>
        </div>
      </div>

      {/* Main Escalation List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} />
            Management Intervention Queue
          </h3>
          <span className="text-[10px] sm:text-xs font-medium text-gray-400">Showing {escalatedLeads.length} prioritized alerts</span>
        </div>

        <div className="grid gap-4">
          {escalatedLeads.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              {/* Risk Level indicator */}
              <div className={`h-1.5 w-12 md:h-12 md:w-1.5 rounded-full flex-shrink-0 ${item.risk === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}`} />

              {/* Lead & Agent Info */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">{item.leadName}</h4>
                  <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${item.risk === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.risk}
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <UserCheck size={12} className="flex-shrink-0" /> Assigned: <span className="font-semibold text-gray-700">{item.agentName}</span>
                </p>
              </div>

              {/* Breach Details */}
              <div className="flex-1 space-y-1 md:border-l md:border-gray-100 md:pl-6">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
                  <Clock size={14} className="text-gray-400 flex-shrink-0" />
                  {item.reason}
                </div>
                <p className="text-xs text-red-600 font-medium italic">{item.details}</p>
              </div>

              {/* Management Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                <button className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                  Notify Agent
                </button>
                <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm flex items-center justify-center gap-2">
                  Reassign <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SLA Policy Note */}
      <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
        <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
          <AlertCircle className="text-white" size={20} />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest">SLA Notification Policy</h4>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-1 leading-relaxed">
            Automatic escalations are triggered at T+48 hours of inactivity. Continued delinquency will flag the lead for QA review and possible reallocation into the "Hot Pool" for round-robin assignment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EscalationAlerts;