import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Video, FileText, Award, Clock, 
  TrendingUp, AlertCircle, CheckCircle, Users,
  Plus, Search, Filter, Download
} from 'lucide-react';
import MyTrainings from './MyTrainings';
import AssignTrainings from './AssignTrainings';
import CompletedTrainings from './CompletedTrainings';
import OverdueTrainings from './OverdueTrainings';
import { getStats } from '../../../services/trainingService';

const TrainingDashboard = () => {
  const [activeTab, setActiveTab] = useState('my-trainings');
  const [userRole, setUserRole] = useState('agent'); // 'agent' or 'admin'
  const [stats, setStats] = useState({
    totalTrainings: 48,
    avgCompletionRate: 82,
    overdueCount: 12,
    avgFeedback: 4.2,
    myPending: 3,
    myCompleted: 15
  });

  async function fetchStats() {
    const res = await getStats()
    setStats(res.data)
  }

  useEffect(() => {
    fetchStats()
  },[])

  const tabs = [
    { id: 'my-trainings', label: 'My Trainings', icon: BookOpen, roles: ['agent', 'admin'] },
    { id: 'assign-trainings', label: 'Assign Trainings', icon: Plus, roles: ['admin'] },
    { id: 'completed', label: 'Completed', icon: CheckCircle, roles: ['agent', 'admin'] },
    { id: 'overdue', label: 'Overdue', icon: AlertCircle, roles: ['agent', 'admin'] }
  ];

  const adminStats = [
    {
      label: 'Total Trainings',
      value: stats.totalTrainings.toString(),
      icon: BookOpen,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      label: 'Avg Completion',
      value: `${stats.avgCompletionRate}%`,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      label: 'Overdue Items',
      value: stats.overdueCount.toString(),
      icon: Clock,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    },
    {
      label: 'Avg Feedback',
      value: `${stats.avgFeedback} ⭐`,
      icon: Award,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    }
  ];

  const agentStats = [
    {
      label: 'Pending Trainings',
      value: stats.myPending.toString(),
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Completed',
      value: stats.myCompleted.toString(),
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      label: 'Completion Rate',
      value: '83%',
      icon: TrendingUp,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      label: 'Badges Earned',
      value: '5',
      icon: Award,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  const displayStats = userRole === 'admin' ? adminStats : agentStats;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-2xl">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                  Training & Knowledge Base
                </h1>
                <p className="text-sm text-gray-500">
                  Learn, grow, and master your skills
                </p>
              </div>
            </div>

            {/* Role Toggle for Demo */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setUserRole('agent')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  userRole === 'agent'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Agent View
              </button>
              <button
                onClick={() => setUserRole('admin')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  userRole === 'admin'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Admin View
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
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

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs
              .filter(tab => tab.roles.includes(userRole))
              .map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
                      isActive
                        ? 'border-indigo-600 text-indigo-600 font-medium'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {activeTab === 'my-trainings' && <MyTrainings userRole={userRole} />}
        {activeTab === 'assign-trainings' && <AssignTrainings />}
        {activeTab === 'completed' && <CompletedTrainings userRole={userRole} />}
        {activeTab === 'overdue' && <OverdueTrainings userRole={userRole} />}
      </div>
    </div>
  );
};

export default TrainingDashboard;