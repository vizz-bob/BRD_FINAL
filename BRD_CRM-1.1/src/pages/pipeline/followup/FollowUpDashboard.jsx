import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  PhoneCall,
  Mail,
  MessageSquare,
  AlertCircle,
  Zap,
  TrendingUp,
  History
} from 'lucide-react';

// Sub-components (to be built next)
import TasksEngine from './TasksEngine';
import CalendarSchedule from './CalendarSchedule';
import EscalationAlerts from './EscalationAlerts';
import CampaignEngagement from './CampaignEngagement';
import { escalationsService, followUpService } from '../../../services/pipelineService';

const FollowUpDashboard = () => {
  const [activeTab, setActiveTab] = useState('tasks');

  const tabs = [
    { id: 'tasks', label: 'Follow-Up Queue', icon: Clock },
    { id: 'calendar', label: 'Schedule View', icon: Calendar },
    { id: 'alerts', label: 'Escalations & SLA', icon: AlertCircle },
    { id: 'campaigns', label: 'Automated Nurturing', icon: Zap }
  ];

  const data = [
    { label: 'Active Tasks', value: '142', icon: Clock, color: 'indigo', change: '84 calls today' },
    { label: 'SLA Breaches', value: '12', icon: AlertCircle, color: 'red', change: 'Overdue > 48h' },
    { label: 'WhatsApp Leads', value: '56', icon: MessageSquare, color: 'green', change: 'Real-time replies' },
    { label: 'Meeting Conversion', value: '18.4%', icon: TrendingUp, color: 'purple', change: '+2.5% vs last week' }
  ];

  const [stats, setStats] = useState(data);

  const fetchStats = async () => {
    const res = await followUpService.stats();
    const backendData = res.data;

    const iconMap = {
      "Active Tasks": Clock,
      "SLA Breaches": AlertCircle,
      "WhatsApp Leads": MessageSquare,
      "Meeting Conversion": TrendingUp
    };

    const colorMap = {
      "Active Tasks": "indigo",
      "SLA Breaches": "red",
      "WhatsApp Leads": "green",
      "Meeting Conversion": "purple"
    };

    const formattedStats = backendData.map(stat => ({
      ...stat,
      icon: iconMap[stat.label],
      color: colorMap[stat.label]
    }));

    setStats(formattedStats);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  function mapFollowUpToTask(item) {
    const now = new Date();
    const dueDate = new Date(item.due);

    const capitalize = (str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

    let dueLabel = "";
    const diffMs = dueDate - now;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 0) {
      dueLabel = `Overdue (${Math.abs(diffHours)}h)`;
    } else if (diffMinutes < 60) {
      dueLabel = `Due in ${diffMinutes}m`;
    } else if (diffHours < 24) {
      dueLabel = `Due in ${diffHours}h`;
    } else {
      dueLabel = "Tomorrow";
    }

    return {
      id: item.id,
      lead: item.lead_name,
      type: capitalize(item.type),
      priority: capitalize(item.priority),

      due: item.due,
      dueLabel: dueLabel,
      status: item.status,
      lastInteraction: item.call_summary || item.disposition || "No interaction"
    };
  }

  const [tasksData, setTasksData] = useState([]);
  const fetchTasks = async () => {
    try {
      const res = await followUpService.list();
      setTasksData(res.data.map(mapFollowUpToTask));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg shadow-lg shadow-indigo-200">
              <PhoneCall className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stage 5: Follow-Up & Nurturing</h1>
              <p className="text-sm text-gray-500">
                Bridge the gap between qualification and deals with consistent multi-channel engagement.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-tighter">{stat.change}</p>
                  </div>
                  <div className={`p-4 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-all text-sm font-medium whitespace-nowrap ${activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[500px]">
          {activeTab === 'tasks' && <TasksEngine tasksData={tasksData} />}
          {activeTab === 'calendar' && <CalendarSchedule tasksData={tasksData} />}
          {activeTab === 'alerts' && <EscalationAlerts />}
          {activeTab === 'campaigns' && <CampaignEngagement />}
        </div>
      </div>
    </div>
  );
};

export default FollowUpDashboard;