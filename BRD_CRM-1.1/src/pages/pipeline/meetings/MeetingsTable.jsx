// MeetingsTable.jsx
import React from 'react';
import { Video, Phone, MapPin, Calendar, Clock, User } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

const MeetingsTable = ({ meetings, selectedMeeting, onSelectMeeting, emptyMessage }) => {
  const getMeetingIcon = (mode) => {
    switch(mode) {
      case 'Google Meet':
      case 'Zoom':
      case 'WhatsApp':
        return <Video className="w-4 h-4" />;
      case 'Phone':
        return <Phone className="w-4 h-4" />;
      case 'Physical':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  if (meetings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">{emptyMessage || 'No meetings found'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Table Header (hidden on small screens) */}
      <div className="hidden sm:block bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <div className="col-span-3">Lead Info</div>
          <div className="col-span-2">Meeting Type</div>
          <div className="col-span-2">Scheduled</div>
          <div className="col-span-2">Agent</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Action</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => onSelectMeeting(meeting)}
            className={`grid grid-cols-1 sm:grid-cols-12 gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition cursor-pointer ${
              selectedMeeting?.id === meeting.id ? 'bg-indigo-50' : ''
            }`}
          >
            {/* Lead Info */}
            <div className="col-span-3">
              <p className="font-semibold text-gray-900">{meeting.leadName}</p>
              <p className="text-xs text-gray-500">{meeting.leadId}</p>
              <p className="text-xs text-gray-500 mt-1">{meeting.phone}</p>
            </div>

            {/* Meeting Type */}
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  {getMeetingIcon(meeting.meetingMode)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{meeting.meetingType}</p>
                  <p className="text-xs text-gray-500">{meeting.meetingMode}</p>
                </div>
              </div>
            </div>

            {/* Scheduled */}
            <div className="col-span-2">
              <div className="flex items-center gap-1 text-sm text-gray-900">
                <Calendar className="w-3 h-3" />
                {meeting.scheduledDate}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <Clock className="w-3 h-3" />
                {meeting.scheduledTime} • {meeting.duration}
              </div>
            </div>

            {/* Agent */}
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{meeting.agentName}</p>
                  <p className="text-xs text-gray-500">{meeting.agentId}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <StatusBadge status={meeting.status} />
              {meeting.isRescheduled && (
                <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-lg">
                  Rescheduled ({meeting.rescheduleCount}x)
                </span>
              )}
            </div>

            {/* Action */}
            <div className="col-span-1 flex items-center justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMeeting(meeting);
                }}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingsTable;