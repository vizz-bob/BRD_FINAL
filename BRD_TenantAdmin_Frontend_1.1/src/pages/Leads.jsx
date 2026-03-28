import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import CampaignManager from "../components/CampaignManager.jsx";
import PipelineManager from "../components/PipelineManager.jsx";
import leadService from "../services/leadService";

import {
  MegaphoneIcon,
  FunnelIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function Leads() {
  const [activeModule, setActiveModule] = useState("PIPELINE");
  const [leadCount, setLeadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await leadService.getAll();
        const leads = data.results ?? data;
        setLeadCount(leads.length);
      } catch (error) {
        console.error("Failed to load leads count", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">

      {/* Sidebar — desktop always visible, mobile overlay */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">

        {/* HEADER */}
        <header className="h-14 sm:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 shrink-0 gap-2">

          {/* Left: hamburger (mobile) + title + switcher */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">

            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition shrink-0"
              aria-label="Open sidebar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight whitespace-nowrap hidden xs:block sm:block">
              Growth & Sales Engine
            </h1>

            {/* Module Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
              <button
                onClick={() => setActiveModule("CAMPAIGNS")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 rounded-md text-[11px] sm:text-xs font-bold uppercase tracking-wide transition-all ${
                  activeModule === "CAMPAIGNS"
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <MegaphoneIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="hidden sm:inline">Acquisition</span>
                <span className="sm:hidden">Acq</span>
              </button>

              <button
                onClick={() => setActiveModule("PIPELINE")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 rounded-md text-[11px] sm:text-xs font-bold uppercase tracking-wide transition-all ${
                  activeModule === "PIPELINE"
                    ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <FunnelIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                Pipeline
              </button>
            </div>
          </div>

          {/* Right: contextual info — hidden on small screens */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400 shrink-0">
            {loading ? (
              <span className="animate-pulse">Loading metrics...</span>
            ) : activeModule === "CAMPAIGNS" ? (
              <>
                <span>Campaigns generating leads</span>
                <ArrowRightIcon className="h-3 w-3" />
                <span>Feeding pipeline</span>
              </>
            ) : (
              <>
                <span>Processing {leadCount} Leads</span>
                <ArrowRightIcon className="h-3 w-3" />
                <span>Closing deals</span>
              </>
            )}
          </div>

          {/* Mobile: compact metric badge */}
          <div className="md:hidden shrink-0">
            {!loading && activeModule === "PIPELINE" && (
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-1 rounded-full">
                {leadCount} leads
              </span>
            )}
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <div className="flex-1 overflow-hidden relative">
          {activeModule === "CAMPAIGNS" ? (
            <CampaignManager />
          ) : (
            <PipelineManager />
          )}
        </div>
      </div>
    </div>
  );
}