import React, { useEffect, useState } from 'react';
import { 
  AlertCircle, Clock, Send, Bell, 
  ChevronUp, TrendingUp, User, Search,
  Filter, PlayCircle
} from 'lucide-react';
import { getOverdueTrainings } from '../../../services/trainingService';

const OverdueTrainings = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('daysOverdue');

  const data = [
    {
      id: 'TRN-009',
      title: 'Data Privacy & Security',
      assignedTo: 'Agent John Doe',
      userId: 'USR-001',
      dueDate: '2025-04-28',
      daysOverdue: 7,
      progress: 25,
      category: 'Compliance',
      lastAccessed: '2025-04-20',
      remindersSent: 2,
      priority: 'High'
    },
    {
      id: 'TRN-010',
      title: 'Customer Escalation Handling',
      assignedTo: 'Agent Sarah Smith',
      userId: 'USR-002',
      dueDate: '2025-04-30',
      daysOverdue: 5,
      progress: 0,
      category: 'Process',
      lastAccessed: null,
      remindersSent: 1,
      priority: 'High'
    },
    {
      id: 'TRN-011',
      title: 'Product Update Q2 2025',
      assignedTo: 'Sales Team',
      userId: 'TEAM-001',
      dueDate: '2025-05-02',
      daysOverdue: 3,
      progress: 60,
      category: 'Product Knowledge',
      lastAccessed: '2025-05-01',
      remindersSent: 1,
      priority: 'Medium'
    },
    {
      id: 'TRN-013',
      title: 'Call Quality Standards',
      assignedTo: 'Telecaller Team',
      userId: 'TEAM-002',
      dueDate: '2025-05-03',
      daysOverdue: 2,
      progress: 10,
      category: 'Soft Skills',
      lastAccessed: '2025-04-28',
      remindersSent: 0,
      priority: 'Low'
    }
  ];

  const [overdueTrainings, setTrainings] = useState(data)
  
    const fetchTrainings = async () => {
      const res = await getOverdueTrainings()
      const trainings = res.data.map(t => ({
        id: t.training_code || `TRN-${String(t.training_id).padStart(3, '0')}`,
        title: t.training_title,
        description: t.description,
        format: t.training_format,
        duration: t.duration,
        progress: t.progress,
        status: t.completion_status,
        dueDate: t.due_date || t.end_date,
        score: t.score,
        feedback: t.feedback_rating,
        thumbnail: t.thumbnail || '🎥',
        category: t.category || 'General'
      }));
      setTrainings(trainings)
    }
  
    useEffect(() => {
      fetchTrainings()
    }, [])

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'bg-red-100 text-red-700 border-red-200',
      'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Low': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[priority] || colors['Low'];
  };

  const sendReminder = (training) => {
    alert(`Reminder sent to ${training.assignedTo} for training: ${training.title}`);
  };

  const escalateToManager = (training) => {
    alert(`Escalating ${training.title} to manager for ${training.assignedTo}`);
  };

  const filteredTrainings = overdueTrainings
    .filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'daysOverdue') return b.daysOverdue - a.daysOverdue;
      if (sortBy === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

  const totalOverdue = overdueTrainings.length;
  const highPriority = overdueTrainings.filter(t => t.priority === 'High').length;
  const avgDaysOverdue = (overdueTrainings.reduce((sum, t) => sum + t.daysOverdue, 0) / totalOverdue).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-1">Action Required: Overdue Trainings</h3>
            <p className="text-sm text-red-700">
              {totalOverdue} training{totalOverdue !== 1 ? 's are' : ' is'} overdue. 
              {highPriority > 0 && ` ${highPriority} marked as high priority.`} 
              Please complete or follow up immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">Total Overdue</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalOverdue}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-xl">
              <ChevronUp className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">High Priority</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{highPriority}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Avg Days Overdue</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgDaysOverdue}</p>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by training or assignee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="daysOverdue">Sort by Days Overdue</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      {/* Overdue List */}
      <div className="space-y-4">
        {filteredTrainings.map(training => (
          <div 
            key={training.id} 
            className="bg-white rounded-2xl border-2 border-red-200 hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{training.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(training.priority)}`}>
                      {training.priority} Priority
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {training.assignedTo}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                      {training.category}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {training.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-medium text-gray-700">{training.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${training.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Days Overdue Badge */}
                <div className="flex items-center gap-2 px-4 py-3 bg-red-100 rounded-xl border-2 border-red-300">
                  <Clock className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-xs text-red-600 font-medium">Overdue</p>
                    <p className="text-lg font-bold text-red-700">{training.daysOverdue} days</p>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Due Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(training.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Accessed</p>
                  <p className="text-sm font-medium text-gray-900">
                    {training.lastAccessed 
                      ? new Date(training.lastAccessed).toLocaleDateString() 
                      : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reminders Sent</p>
                  <p className="text-sm font-medium text-gray-900">{training.remindersSent}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Progress</p>
                  <p className="text-sm font-medium text-gray-900">{training.progress}%</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {userRole === 'agent' ? (
                  <button className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                    <PlayCircle className="w-5 h-5" />
                    Resume Training
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => sendReminder(training)}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors"
                    >
                      <Bell className="w-5 h-5" />
                      Send Reminder
                    </button>
                    <button
                      onClick={() => escalateToManager(training)}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                      <TrendingUp className="w-5 h-5" />
                      Escalate
                    </button>
                  </>
                )}
              </div>

              {/* Warning Message for High Priority */}
              {training.priority === 'High' && training.daysOverdue > 5 && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-700">
                    ⚠️ Critical: This high-priority training has been overdue for {training.daysOverdue} days
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTrainings.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No overdue trainings found</h3>
          <p className="text-gray-500">Great job staying on track!</p>
        </div>
      )}
    </div>
  );
};

export default OverdueTrainings;