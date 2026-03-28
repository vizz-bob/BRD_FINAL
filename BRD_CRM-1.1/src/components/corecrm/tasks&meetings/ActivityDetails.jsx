import React, { useState } from 'react';
import { 
  X, Calendar, User, Phone, Mail, MessageCircle, 
  Clock, MapPin, ExternalLink, FileText, Edit2,
  CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';

const ActivityDetails = ({ activity, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(activity.notes || '');
  const [status, setStatus] = useState(activity.status);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { icon: Clock, color: 'yellow', label: 'Pending' },
      completed: { icon: CheckCircle, color: 'green', label: 'Completed' },
      missed: { icon: XCircle, color: 'red', label: 'Missed' },
      cancelled: { icon: XCircle, color: 'gray', label: 'Cancelled' },
      'no-show': { icon: AlertTriangle, color: 'orange', label: 'No-show' }
    };
    return configs[status] || configs.pending;
  };

  const handleSave = () => {
    onUpdate({ notes, status });
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus) => {
    const updates = { status: newStatus };
    if (newStatus === 'completed') {
      updates.completedAt = new Date().toISOString();
    }
    onUpdate(updates);
    setStatus(newStatus);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium opacity-90">
            {activity.type === 'task' ? 'Task Details' : 'Meeting Details'}
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-lg font-bold">{activity.title}</h2>
        <p className="text-sm opacity-90 mt-1">ID: {activity.id}</p>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Status Section */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-2">Status</label>
          <div className="flex flex-wrap gap-2">
            {['pending', 'completed', 'missed', 'cancelled', 'no-show'].map((s) => {
              const config = getStatusConfig(s);
              const Icon = config.icon;
              return (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    status === s
                      ? `bg-${config.color}-100 text-${config.color}-700 ring-2 ring-${config.color}-300`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lead Information */}
        <div className="bg-blue-50 rounded-xl p-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Lead Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{activity.leadName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FileText className="w-4 h-4" />
              <span>Lead ID: {activity.leadId}</span>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-2">
            {activity.type === 'task' ? 'Due Date & Time' : 'Scheduled Date & Time'}
          </label>
          <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-xl p-3">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span className="font-medium">{formatDateTime(activity.dueDate)}</span>
          </div>
        </div>

        {/* Meeting Specific Details */}
        {activity.type === 'meeting' && (
          <>
            {activity.meetingMode && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-2">Meeting Mode</label>
                <div className="text-sm bg-purple-50 rounded-xl p-3">
                  <span className="font-medium capitalize">{activity.meetingMode}</span>
                </div>
              </div>
            )}

            {activity.location && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-2">Location</label>
                <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-xl p-3">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>{activity.location}</span>
                </div>
              </div>
            )}

            {activity.meetingLink && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-2">Meeting Link</label>
                <a
                  href={activity.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 bg-indigo-50 rounded-xl p-3"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="truncate">{activity.meetingLink}</span>
                </a>
              </div>
            )}

            {activity.agenda && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-2">Agenda</label>
                <div className="text-sm bg-gray-50 rounded-xl p-3">
                  {activity.agenda}
                </div>
              </div>
            )}
          </>
        )}

        {/* Task Specific Details */}
        {activity.type === 'task' && activity.taskType && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-2">Task Type</label>
            <div className="text-sm bg-blue-50 rounded-xl p-3">
              <span className="font-medium capitalize">{activity.taskType}</span>
            </div>
          </div>
        )}

        {/* Priority */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-2">Priority</label>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
            activity.priority === 'high' ? 'bg-red-100 text-red-700' :
            activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {activity.priority.toUpperCase()}
          </div>
        </div>

        {/* Assigned To */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-2">Assigned To</label>
          <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-xl p-3">
            <User className="w-4 h-4 text-gray-600" />
            <span className="font-medium">{activity.assignedTo}</span>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-gray-500">Notes</label>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-indigo-600 hover:text-indigo-700 text-xs flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {isEditing ? (
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Add notes about this activity..."
              />
              <button
                onClick={handleSave}
                className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium"
              >
                Save Notes
              </button>
            </div>
          ) : (
            <div className="text-sm bg-gray-50 rounded-xl p-3">
              {notes || 'No notes added yet'}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-xs font-medium text-gray-500 mb-3">Activity Timeline</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-600 mt-1.5"></div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-900">Created</p>
                <p className="text-xs text-gray-500">{formatDateTime(activity.createdAt)}</p>
              </div>
            </div>
            
            {activity.completedAt && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-600 mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">Completed</p>
                  <p className="text-xs text-gray-500">{formatDateTime(activity.completedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-xs font-medium text-gray-500 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition text-sm">
              <Phone className="w-4 h-4" />
              Call
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition text-sm">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition text-sm">
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition text-sm">
              <Calendar className="w-4 h-4" />
              Reschedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;