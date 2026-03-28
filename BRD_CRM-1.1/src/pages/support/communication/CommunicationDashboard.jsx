// CommunicationDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Send, Mail, Clock,
  Users, PhoneCall
} from 'lucide-react';
import InternalCommunication from './InternalCommunication';
import ExternalCommunication from './ExternalCommunication';
import CommunicationTimeline from './CommunicationTimeline';
import { getCommunicationStats } from '../../../services/communicationService';

const CommunicationDashboard = () => {
  const [activeTab, setActiveTab] = useState('internal');

  // Live log entries pushed up from Internal & External components
  const [liveEntries, setLiveEntries] = useState([]);

  const addLogEntry = (entry) =>
    setLiveEntries((prev) => [entry, ...prev]);

  // ── Stats (replace useEffect with real API call) ──────────────────────────
  const [stats, setStats] = useState({
    totalMessages: 0,
    activeChats: 0,
    pendingCalls: 0,
    emailsSent: 0,
  });

  const refreshStats = async () => {
    try {
      const next = await getCommunicationStats();
      setStats(next);
    } catch {
      // Keep previous stats if fetch fails.
    }
  };

  useEffect(() => {
    refreshStats();

    const id = window.setInterval(() => {
      refreshStats();
    }, 30000);

    return () => window.clearInterval(id);
  }, []);

  const handleLogEntry = (entry) => {
    addLogEntry(entry);
    refreshStats();
  };

  // ── Tabs (Logs removed) ───────────────────────────────────────────────────
  const tabs = [
    { id: 'internal', label: 'Internal', icon: Users },
    { id: 'external', label: 'External', icon: Send },
    { id: 'timeline', label: 'Timeline', icon: Clock },
  ];

  const statsCards = [
    {
      label: 'Total Messages',
      value: stats.totalMessages.toLocaleString(),
      icon: MessageSquare,
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      change: '+12% this week',
    },
    {
      label: 'Active Chats',
      value: stats.activeChats.toString(),
      icon: Users,
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      change: 'Right now',
    },
    {
      label: 'Pending Calls',
      value: stats.pendingCalls.toString(),
      icon: PhoneCall,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      change: 'Requires attention',
    },
    {
      label: 'Emails Sent',
      value: stats.emailsSent.toLocaleString(),
      icon: Mail,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      change: 'Last 7 days',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-2xl">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                Internal &amp; External Communication
              </h1>
              <p className="text-sm text-gray-500">
                Manage all team and customer interactions in one place
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-600">{stat.change}</p>
                    </div>
                    <div className={`p-4 ${stat.bgColor} rounded-xl`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Nav ── */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {/* Badge for live timeline entries */}
                  {tab.id === 'timeline' && liveEntries.length > 0 && (
                    <span className="bg-indigo-600 text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
                      {liveEntries.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {activeTab === 'internal' && (
          <InternalCommunication onLogEntry={handleLogEntry} />
        )}
        {activeTab === 'external' && (
          <ExternalCommunication onLogEntry={handleLogEntry} />
        )}
        {activeTab === 'timeline' && (
          <CommunicationTimeline liveEntries={liveEntries} />
        )}
      </div>
    </div>
  );
};

export default CommunicationDashboard;
