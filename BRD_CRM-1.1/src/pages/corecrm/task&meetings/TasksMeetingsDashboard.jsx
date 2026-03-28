// src/pages/core-crm/tasks-meetings/TasksMeetingsDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus, Calendar, List, Clock, CheckCircle,
  AlertCircle, Users, TrendingUp
} from 'lucide-react';
import ActivityCalendar from '../../../components/corecrm/tasks&meetings/ActivityCalendar';
import ActivityList from '../../../components/corecrm/tasks&meetings/ActivityList';
import ActivityForm from '../../../components/corecrm/tasks&meetings/ActivityForm';
import ActivityDetails from '../../../components/corecrm/tasks&meetings/ActivityDetails';
import ActivityStats from '../../../components/corecrm/tasks&meetings/ActivityStats';
import ActivityFilters from '../../../components/corecrm/tasks&meetings/ActivityFilters';
import { getTasks, getMeetings, createTask, createMeeting } from '../../../services/coreCRMService';


const VIEW_MODES = [
  { value: 'list', label: 'List View' },
  { value: 'calendar', label: 'Calendar View' }
];

const TasksMeetingsDashboard = () => {
  const [viewMode, setViewMode] = useState('list');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    type: 'all',
    dateRange: 'all'
  });

  // Fetch activities from API
  useEffect(() => {
    fetchActivities();
  }, []);

  // Fetch all activities (tasks + meetings)
  const fetchActivities = async () => {
    try {
      const tasksRes = await getTasks();
      const meetingsRes = await getMeetings();

      const mappedActivities = [
        ...tasksRes.data.map(t => ({
          id: t.id,
          type: 'task',
          title: t.title,
          leadId: t.related_lead_id,
          leadName: t.related_lead_name,
          priority: t.priority,
          status: t.status?.toLowerCase(),
          dueDate: t.dueDate,
          assignedTo: t.agent_name,
          notes: t.notes,
          createdAt: t.created_at,
          completedAt: t.completed_at
        })),
        ...meetingsRes.data.map(m => ({
          id: m.meeting_id,
          type: 'meeting',
          meetingType: m.meeting_type.toLowerCase().replace('_', '-'),
          meetingMode: m.meeting_mode.toLowerCase().replace('_', '-'),
          title: m.title || `Meeting with ${m.related_lead_name}`,
          leadId: m.related_lead_id,
          leadName: m.related_lead_name,
          priority: m.priority || 'medium',
          status: m.status?.toLowerCase(),
          dueDate: m.scheduled_datetime,
          meetingLink: m.location?.startsWith('http') ? m.location : '',
          location: m.location?.startsWith('http') ? '' : m.location,
          agenda: m.notes,
          assignedTo: m.agent_name,
          createdAt: m.created_at
        }))
      ];

      setActivities(mappedActivities);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };


  const stats = [
    {
      label: 'Total Activities',
      value: activities.length.toString(),
      icon: List,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      label: 'Pending Today',
      value: activities.filter(a => {
        const today = new Date().toDateString();
        const activityDate = new Date(a.dueDate).toDateString();
        return a.status === 'pending' && activityDate === today;
      }).length.toString(),
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Completed',
      value: activities.filter(a => a.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      label: 'Overdue',
      value: activities.filter(a => {
        if (a.status === 'completed' || a.status === 'cancelled') return false;
        return new Date(a.dueDate) < new Date();
      }).length.toString(),
      icon: AlertCircle,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    }
  ];

  const filteredActivities = activities.filter(activity => {
    if (filters.status !== 'all' && activity.status !== filters.status) return false;
    if (filters.priority !== 'all' && activity.priority !== filters.priority) return false;
    if (filters.type !== 'all' && activity.type !== filters.type) return false;
    return true;
  });

  // Handle create activity (task or meeting)
  const handleCreateActivity = async (activityData) => {
    try {
      const isTask = activityData.type === 'task';

      const payload = {
        activity_type: isTask ? 'TASK' : 'MEETING',
        title_task: activityData.title,
        lead: activityData.leadId,
        assigned_to: activityData.assignedTo || 'AGENT_A',
        due_datetime: activityData.dueDate,
        task_type: activityData.taskType?.toUpperCase() || 'CALL',
        priority: activityData.priority?.toUpperCase() || 'MEDIUM',
        notes: activityData.notes
      };

      const res = await createTask(payload);
    } catch (err) {
      console.error('Validation Errors:', err.response?.data);
    }
  };


  const handleUpdateActivity = (activityId, updates) => {
    setActivities(activities.map(a =>
      a.id === activityId ? { ...a, ...updates } : a
    ));
    if (selectedActivity?.id === activityId) {
      setSelectedActivity({ ...selectedActivity, ...updates });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-2xl">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tasks & Meetings</h1>
                <p className="text-sm text-gray-500">
                  Manage your daily activities and interactions
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowActivityForm(true)}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition w-full md:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Add Activity
            </button>
          </div>

          {/* Stats Grid */}
          <ActivityStats stats={stats} />
        </div>
      </div>

      {/* View Controls & Filters */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-full md:w-auto">
            {VIEW_MODES.map(mode => (
              <button
                key={mode.value}
                onClick={() => setViewMode(mode.value)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition ${viewMode === mode.value
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <ActivityFilters filters={filters} onFilterChange={setFilters} />
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main View */}
          <div className={selectedActivity ? 'lg:col-span-2' : 'lg:col-span-3'}>
            {viewMode === 'calendar' ? (
              <ActivityCalendar
                activities={filteredActivities}
                onSelectActivity={setSelectedActivity}
              />
            ) : (
              <ActivityList
                activities={filteredActivities}
                selectedActivity={selectedActivity}
                onSelectActivity={setSelectedActivity}
                onUpdateActivity={handleUpdateActivity}
              />
            )}
          </div>

          {/* Activity Details Panel */}
          {selectedActivity && (
            <div className="lg:col-span-1">
              <ActivityDetails
                activity={selectedActivity}
                onClose={() => setSelectedActivity(null)}
                onUpdate={(updates) => handleUpdateActivity(selectedActivity.id, updates)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Activity Form Modal */}
      {showActivityForm && (
        <ActivityForm
          onClose={() => setShowActivityForm(false)}
          onSubmit={handleCreateActivity}
        />
      )}
    </div>
  );
};

export default TasksMeetingsDashboard;




// // src/pages/core-crm/tasks-meetings/TasksMeetingsDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Plus, Calendar, List, Clock, CheckCircle,
//   AlertCircle, Users, TrendingUp, Filter
// } from 'lucide-react';
// import ActivityCalendar from '../../../components/corecrm/tasks&meetings/ActivityCalendar';
// import ActivityList from '../../../components/corecrm/tasks&meetings/ActivityList';
// import ActivityForm from '../../../components/corecrm/tasks&meetings/ActivityForm';
// import ActivityDetails from '../../../components/corecrm/tasks&meetings/ActivityDetails';
// import ActivityStats from '../../../components/corecrm/tasks&meetings/ActivityStats';
// import ActivityFilters from '../../../components/corecrm/tasks&meetings/ActivityFilters';

// const VIEW_MODES = [
//   { value: 'list', label: 'List View' },
//   { value: 'calendar', label: 'Calendar View' }
// ];

// const TasksMeetingsDashboard = () => {
//   const [viewMode, setViewMode] = useState('list');
//   const [showActivityForm, setShowActivityForm] = useState(false);
//   const [selectedActivity, setSelectedActivity] = useState(null);
//   const [activities, setActivities] = useState([]);
//   const [filters, setFilters] = useState({
//     status: 'all',
//     priority: 'all',
//     type: 'all',
//     dateRange: 'all'
//   });

//   // Mock data - Replace with actual API call
//   useEffect(() => {
//     const mockActivities = [
//       {
//         id: 'ACT-001',
//         type: 'task',
//         taskType: 'call',
//         title: 'Follow-up call with Rajesh Kumar',
//         leadId: 'QL-001',
//         leadName: 'Rajesh Kumar',
//         priority: 'high',
//         status: 'pending',
//         dueDate: '2025-01-15T10:00:00',
//         assignedTo: 'Agent A',
//         notes: 'Discuss home loan eligibility',
//         createdAt: '2025-01-10T09:00:00'
//       },
//       {
//         id: 'ACT-002',
//         type: 'meeting',
//         meetingType: 'video-call',
//         meetingMode: 'zoom',
//         title: 'Product demo with Priya Sharma',
//         leadId: 'QL-002',
//         leadName: 'Priya Sharma',
//         priority: 'medium',
//         status: 'pending',
//         dueDate: '2025-01-16T14:00:00',
//         meetingLink: 'https://zoom.us/j/123456789',
//         assignedTo: 'Agent B',
//         agenda: 'Present personal loan options',
//         createdAt: '2025-01-11T10:30:00'
//       },
//       {
//         id: 'ACT-003',
//         type: 'task',
//         taskType: 'email',
//         title: 'Send documentation list to Amit Patel',
//         leadId: 'QL-003',
//         leadName: 'Amit Patel',
//         priority: 'high',
//         status: 'completed',
//         dueDate: '2025-01-14T16:00:00',
//         completedAt: '2025-01-14T15:30:00',
//         assignedTo: 'Agent A',
//         notes: 'KYC documents list sent via email',
//         createdAt: '2025-01-12T11:00:00'
//       },
//       {
//         id: 'ACT-004',
//         type: 'meeting',
//         meetingType: 'in-person',
//         meetingMode: 'physical',
//         title: 'Branch visit - Sunita Verma',
//         leadId: 'QL-004',
//         leadName: 'Sunita Verma',
//         priority: 'high',
//         status: 'missed',
//         dueDate: '2025-01-12T11:00:00',
//         location: 'Delhi Branch Office',
//         assignedTo: 'Agent C',
//         notes: 'Customer did not show up',
//         createdAt: '2025-01-09T14:00:00'
//       }
//     ];
//     setActivities(mockActivities);
//   }, []);

//   const stats = [
//     {
//       label: 'Total Activities',
//       value: activities.length.toString(),
//       icon: List,
//       color: 'indigo',
//       bgColor: 'bg-indigo-100',
//       textColor: 'text-indigo-600'
//     },
//     {
//       label: 'Pending Today',
//       value: activities.filter(a => {
//         const today = new Date().toDateString();
//         const activityDate = new Date(a.dueDate).toDateString();
//         return a.status === 'pending' && activityDate === today;
//       }).length.toString(),
//       icon: Clock,
//       color: 'yellow',
//       bgColor: 'bg-yellow-100',
//       textColor: 'text-yellow-600'
//     },
//     {
//       label: 'Completed',
//       value: activities.filter(a => a.status === 'completed').length.toString(),
//       icon: CheckCircle,
//       color: 'green',
//       bgColor: 'bg-green-100',
//       textColor: 'text-green-700'
//     },
//     {
//       label: 'Overdue',
//       value: activities.filter(a => {
//         if (a.status === 'completed' || a.status === 'cancelled') return false;
//         return new Date(a.dueDate) < new Date();
//       }).length.toString(),
//       icon: AlertCircle,
//       color: 'red',
//       bgColor: 'bg-red-100',
//       textColor: 'text-red-600'
//     }
//   ];

//   const filteredActivities = activities.filter(activity => {
//     if (filters.status !== 'all' && activity.status !== filters.status) return false;
//     if (filters.priority !== 'all' && activity.priority !== filters.priority) return false;
//     if (filters.type !== 'all' && activity.type !== filters.type) return false;
//     return true;
//   });

//   const handleCreateActivity = (activityData) => {
//     const newActivity = {
//       ...activityData,
//       id: `ACT-${String(activities.length + 1).padStart(3, '0')}`,
//       createdAt: new Date().toISOString()
//     };
//     setActivities([...activities, newActivity]);
//     setShowActivityForm(false);
//   };

//   const handleUpdateActivity = (activityId, updates) => {
//     setActivities(activities.map(a =>
//       a.id === activityId ? { ...a, ...updates } : a
//     ));
//     if (selectedActivity?.id === activityId) {
//       setSelectedActivity({ ...selectedActivity, ...updates });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header Section */}
//       <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-indigo-100 rounded-2xl">
//                 <Calendar className="w-6 h-6 text-indigo-600" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Tasks & Meetings</h1>
//                 <p className="text-sm text-gray-500">
//                   Manage your daily activities and interactions
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={() => setShowActivityForm(true)}
//               className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition w-full md:w-auto justify-center"
//             >
//               <Plus className="w-5 h-5" />
//               Add Activity
//             </button>
//           </div>

//           {/* Stats Grid */}
//           <ActivityStats stats={stats} />
//         </div>
//       </div>

//       {/* View Controls & Filters */}
//       <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
//           {/* View Mode Toggle */}
//           <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-full md:w-auto">
//             {VIEW_MODES.map(mode => (
//               <button
//                 key={mode.value}
//                 onClick={() => setViewMode(mode.value)}
//                 className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition ${
//                   viewMode === mode.value
//                     ? 'bg-white text-indigo-600 shadow-sm'
//                     : 'text-gray-600 hover:text-gray-900'
//                 }`}
//               >
//                 {mode.label}
//               </button>
//             ))}
//           </div>

//           {/* Filters */}
//           <ActivityFilters filters={filters} onFilterChange={setFilters} />
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main View */}
//           <div className={selectedActivity ? 'lg:col-span-2' : 'lg:col-span-3'}>
//             {viewMode === 'calendar' ? (
//               <ActivityCalendar
//                 activities={filteredActivities}
//                 onSelectActivity={setSelectedActivity}
//               />
//             ) : (
//               <ActivityList
//                 activities={filteredActivities}
//                 selectedActivity={selectedActivity}
//                 onSelectActivity={setSelectedActivity}
//                 onUpdateActivity={handleUpdateActivity}
//               />
//             )}
//           </div>

//           {/* Activity Details Panel */}
//           {selectedActivity && (
//             <div className="lg:col-span-1">
//               <ActivityDetails
//                 activity={selectedActivity}
//                 onClose={() => setSelectedActivity(null)}
//                 onUpdate={(updates) => handleUpdateActivity(selectedActivity.id, updates)}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Activity Form Modal */}
//       {showActivityForm && (
//         <ActivityForm
//           onClose={() => setShowActivityForm(false)}
//           onSubmit={handleCreateActivity}
//         />
//       )}
//     </div>
//   );
// };

// export default TasksMeetingsDashboard;