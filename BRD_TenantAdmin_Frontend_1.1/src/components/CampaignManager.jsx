import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import leadService from "../services/leadService";
import CampaignNavigation from "./CampaignNavigation";
import CampaignWorkspace from "./CampaignWorkspace";
import CreateCampaignModal from "./CreateCampaignModal";

export default function CampaignManager() {
  const [activeChannel, setActiveChannel] = useState("OVERVIEW");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

  const [campaignData, setCampaignData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const data = await leadService.getAll({ type: 'campaign' });
        setCampaignData(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Close sidebar when a channel is selected on mobile
  const handleChannelChange = (channel) => {
    setActiveChannel(channel);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-full relative">

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT: Channel Navigation Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-72 lg:w-64
          bg-slate-50 border-r border-slate-200
          flex-shrink-0 flex flex-col h-full
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header (mobile close button) */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-200">
          <span className="font-bold text-slate-700 text-sm uppercase tracking-wider">Campaigns</span>
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-lg transition">
            <XMarkIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-4 flex-1 overflow-y-auto">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="w-full mb-4 bg-primary-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary-700 shadow-lg shadow-primary-200 border border-transparent transition-all active:scale-95"
          >
            + New Campaign
          </button>
          <CampaignNavigation
            activeChannel={activeChannel}
            onChange={handleChannelChange}
            campaigns={campaignData}
          />
        </div>
      </div>

      {/* RIGHT: Workspace */}
      <div className="flex-1 overflow-y-auto bg-white flex flex-col min-w-0">

        {/* Mobile top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white lg:hidden sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg transition flex-shrink-0"
          >
            <Bars3Icon className="w-5 h-5 text-slate-600" />
          </button>
          <span className="font-bold text-slate-700 text-sm truncate">{activeChannel}</span>
        </div>

        {/* Main content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <CampaignWorkspace channel={activeChannel} data={campaignData} />
        </div>
      </div>

      {/* MODAL */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultChannel={activeChannel}
      />
    </div>
  );
}