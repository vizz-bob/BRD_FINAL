import React from 'react';
import { 
  Phone, Mail, MessageCircle, Bell, Video, Users, 
  Clock, CheckCircle, AlertCircle, MapPin, Calendar,
  ExternalLink
} from 'lucide-react';

// Task icons
const TASK_ICONS = {
  call: Phone,
  email: Mail,
  whatsapp: MessageCircle,
  reminder: Bell
};

// Meeting icons
const MEETING_ICONS = {
  'in-person': Users,
  'video-call': Video,
  'phone-call': Phone
};

// Map backend meeting types to frontend
const MEETING_TYPE_MAP = {
  IN_PERSON: 'in-person',
  VIDEO_CALL: 'video-call',
  PHONE_CALL: 'phone-call'
};

// Map backend statuses to frontend-friendly labels
const STATUS_MAP = {
  SCHEDULED: 'pending',
  COMPLETED: 'completed',
  NO_SHOW: 'no-show',
  CANCELLED: 'cancelled'
};

const ActivityList = ({ activities, selectedActivity, onSelectActivity, onUpdateActivity }) => {

  const getStatusConfig = (status) => {
    const configs = {
      pending: { bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', label: 'Pending' },
      completed: { bgColor: 'bg-green-100', textColor: 'text-green-700', label: 'Completed' },
      missed: { bgColor: 'bg-red-100', textColor: 'text-red-600', label: 'Missed' },
      cancelled: { bgColor: 'bg-gray-100', textColor: 'text-gray-600', label: 'Cancelled' },
      'no-show': { bgColor: 'bg-orange-100', textColor: 'text-orange-600', label: 'No-show' }
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { bgColor: 'bg-red-100', textColor: 'text-red-700', label: 'High' },
      medium: { bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', label: 'Medium' },
      low: { bgColor: 'bg-gray-100', textColor: 'text-gray-700', label: 'Low' }
    };
    return configs[priority] || configs.medium;
  };

  const isOverdue = (activity) => {
    const status = STATUS_MAP[activity.status] || 'pending';
    if (status === 'completed' || status === 'cancelled') return false;
    return new Date(activity.scheduled_datetime) < new Date();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const handleQuickAction = (activity, action, e) => {
    e.stopPropagation();
    if (action === 'complete') {
      onUpdateActivity(activity.id, { status: 'COMPLETED', completedAt: new Date().toISOString() });
    } else if (action === 'call') {
      console.log('Calling:', activity.related_lead_type, activity.related_lead_id);
    } else if (action === 'reschedule') {
      console.log('Reschedule:', activity.id);
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities found</h3>
        <p className="text-gray-500">Create a new task or meeting to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const status = STATUS_MAP[activity.status] || 'pending';
        const statusConfig = getStatusConfig(status);
        const priorityConfig = getPriorityConfig(activity.priority);
        const overdue = isOverdue(activity);

        let Icon;
        if (activity.type === 'task') {
          Icon = TASK_ICONS[activity.taskType] || Phone;
        } else {
          const meetingType = MEETING_TYPE_MAP[activity.meeting_type] || 'video-call';
          Icon = MEETING_ICONS[meetingType] || Users;
          activity.meetingType = meetingType; // normalize for frontend
        }

        return (
          <div
            key={activity.id}
            onClick={() => onSelectActivity(activity)}
            className={`bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer hover:shadow-md ${
              selectedActivity?.id === activity.id ? 'border-indigo-600 shadow-md' : 'border-gray-200'
            } ${overdue ? 'bg-red-50' : ''}`}
          >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`p-2 ${activity.type === 'task' ? 'bg-blue-100' : 'bg-purple-100'} rounded-xl flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${activity.type === 'task' ? 'text-blue-600' : 'text-purple-600'}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} font-medium`}>
                      {statusConfig.label}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${priorityConfig.bgColor} ${priorityConfig.textColor} font-medium`}>
                      {priorityConfig.label}
                    </span>
                    {overdue && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-medium">
                        Overdue
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Lead: {activity.related_lead_type} ({activity.related_lead_id})
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(activity.scheduled_datetime)}
                    </div>
                    {activity.type === 'meeting' && activity.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {activity.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              {status === 'pending' && (
                <button
                  onClick={(e) => handleQuickAction(activity, 'complete', e)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                >
                  <CheckCircle className="w-3 h-3" />
                  Mark Complete
                </button>
              )}

              <button
                onClick={(e) => handleQuickAction(activity, 'call', e)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                <Phone className="w-3 h-3" />
                Call
              </button>

              {activity.type === 'meeting' && activity.meetingLink && (
                <a
                  href={activity.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                >
                  <ExternalLink className="w-3 h-3" />
                  Join
                </a>
              )}

              <button
                onClick={(e) => handleQuickAction(activity, 'reschedule', e)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition ml-auto"
              >
                <Calendar className="w-3 h-3" />
                Reschedule
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityList;


// import React from 'react';
// import { 
//   Phone, Mail, MessageCircle, Bell, Video, Users, 
//   Clock, CheckCircle, AlertCircle, MapPin, Calendar,
//   ExternalLink
// } from 'lucide-react';

// const TASK_ICONS = {
//   call: Phone,
//   email: Mail,
//   whatsapp: MessageCircle,
//   reminder: Bell
// };

// const MEETING_ICONS = {
//   'in-person': Users,
//   'video-call': Video,
//   'phone-call': Phone
// };

// const ActivityList = ({ activities, selectedActivity, onSelectActivity, onUpdateActivity }) => {
//   const getStatusConfig = (status) => {
//     const configs = {
//       pending: { bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', label: 'Pending' },
//       completed: { bgColor: 'bg-green-100', textColor: 'text-green-700', label: 'Completed' },
//       missed: { bgColor: 'bg-red-100', textColor: 'text-red-600', label: 'Missed' },
//       cancelled: { bgColor: 'bg-gray-100', textColor: 'text-gray-600', label: 'Cancelled' },
//       'no-show': { bgColor: 'bg-orange-100', textColor: 'text-orange-600', label: 'No-show' }
//     };
//     return configs[status] || configs.pending;
//   };

//   const getPriorityConfig = (priority) => {
//     const configs = {
//       high: { bgColor: 'bg-red-100', textColor: 'text-red-700', label: 'High' },
//       medium: { bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', label: 'Medium' },
//       low: { bgColor: 'bg-gray-100', textColor: 'text-gray-700', label: 'Low' }
//     };
//     return configs[priority] || configs.medium;
//   };

//   const isOverdue = (activity) => {
//     if (activity.status === 'completed' || activity.status === 'cancelled') return false;
//     return new Date(activity.dueDate) < new Date();
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     if (date.toDateString() === today.toDateString()) {
//       return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
//     } else if (date.toDateString() === tomorrow.toDateString()) {
//       return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
//     } else {
//       return date.toLocaleDateString('en-US', { 
//         month: 'short', 
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     }
//   };

//   const handleQuickAction = (activity, action, e) => {
//     e.stopPropagation();
//     if (action === 'complete') {
//       onUpdateActivity(activity.id, { 
//         status: 'completed', 
//         completedAt: new Date().toISOString() 
//       });
//     } else if (action === 'call') {
//       // Implement call functionality
//       console.log('Calling:', activity.leadName);
//     } else if (action === 'reschedule') {
//       // Open reschedule dialog
//       console.log('Reschedule:', activity.id);
//     }
//   };

//   if (activities.length === 0) {
//     return (
//       <div className="bg-white rounded-2xl p-8 text-center">
//         <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities found</h3>
//         <p className="text-gray-500">Create a new task or meeting to get started</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       {activities.map((activity) => {
//         const statusConfig = getStatusConfig(activity.status);
//         const priorityConfig = getPriorityConfig(activity.priority);
//         const overdue = isOverdue(activity);
        
//         let Icon;
//         if (activity.type === 'task') {
//           Icon = TASK_ICONS[activity.taskType] || Phone;
//         } else {
//           Icon = MEETING_ICONS[activity.meetingType] || Users;
//         }

//         return (
//           <div
//             key={activity.id}
//             onClick={() => onSelectActivity(activity)}
//             className={`bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer hover:shadow-md ${
//               selectedActivity?.id === activity.id
//                 ? 'border-indigo-600 shadow-md'
//                 : 'border-gray-200'
//             } ${overdue ? 'bg-red-50' : ''}`}
//           >
//             {/* Header Row */}
//             <div className="flex items-start justify-between mb-3">
//               <div className="flex items-start space-x-3 flex-1">
//                 <div className={`p-2 ${activity.type === 'task' ? 'bg-blue-100' : 'bg-purple-100'} rounded-xl flex-shrink-0`}>
//                   <Icon className={`w-5 h-5 ${activity.type === 'task' ? 'text-blue-600' : 'text-purple-600'}`} />
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className={`text-xs px-2 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} font-medium`}>
//                       {statusConfig.label}
//                     </span>
//                     <span className={`text-xs px-2 py-1 rounded-full ${priorityConfig.bgColor} ${priorityConfig.textColor} font-medium`}>
//                       {priorityConfig.label}
//                     </span>
//                     {overdue && (
//                       <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-medium">
//                         Overdue
//                       </span>
//                     )}
//                   </div>
                  
//                   <h3 className="font-semibold text-gray-900 mb-1 truncate">
//                     {activity.title}
//                   </h3>
                  
//                   <p className="text-sm text-gray-600 mb-2">
//                     Lead: {activity.leadName} ({activity.leadId})
//                   </p>

//                   <div className="flex items-center gap-4 text-xs text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       {formatDate(activity.dueDate)}
//                     </div>
//                     {activity.type === 'meeting' && activity.location && (
//                       <div className="flex items-center gap-1">
//                         <MapPin className="w-3 h-3" />
//                         {activity.location}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
//               {activity.status === 'pending' && (
//                 <button
//                   onClick={(e) => handleQuickAction(activity, 'complete', e)}
//                   className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
//                 >
//                   <CheckCircle className="w-3 h-3" />
//                   Mark Complete
//                 </button>
//               )}
              
//               <button
//                 onClick={(e) => handleQuickAction(activity, 'call', e)}
//                 className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
//               >
//                 <Phone className="w-3 h-3" />
//                 Call
//               </button>

//               {activity.type === 'meeting' && activity.meetingLink && (
//                 <a
//                   href={activity.meetingLink}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   onClick={(e) => e.stopPropagation()}
//                   className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
//                 >
//                   <ExternalLink className="w-3 h-3" />
//                   Join
//                 </a>
//               )}

//               <button
//                 onClick={(e) => handleQuickAction(activity, 'reschedule', e)}
//                 className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition ml-auto"
//               >
//                 <Calendar className="w-3 h-3" />
//                 Reschedule
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default ActivityList;