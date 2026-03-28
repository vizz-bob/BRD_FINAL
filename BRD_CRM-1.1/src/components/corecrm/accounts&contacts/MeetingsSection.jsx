// MeetingsSection.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Users, Clock, Video, Trash2 } from 'lucide-react';

const MeetingsSection = ({ entityId, entityType }) => {
  const [meetings, setMeetings] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '30',
    location: '',
    meetingType: 'In-Person',
    participants: ''
  });

  useEffect(() => {
    // Mock data - replace with API call
    const mockMeetings = [
      {
        id: 'MEET-001',
        title: 'Loan Documentation Review',
        description: 'Review and verify all submitted documents for home loan application',
        date: '2025-02-05',
        time: '14:00',
        duration: '45',
        location: 'Branch Office - Conference Room A',
        meetingType: 'In-Person',
        status: 'Scheduled',
        participants: ['Agent A', 'Customer', 'Manager'],
        createdBy: 'Agent A',
        createdAt: '2025-01-27T10:00:00'
      },
      {
        id: 'MEET-002',
        title: 'Property Discussion Call',
        description: 'Discuss property options and eligibility criteria',
        date: '2025-01-29',
        time: '10:30',
        duration: '30',
        location: 'Video Call',
        meetingType: 'Virtual',
        status: 'Scheduled',
        participants: ['Agent A', 'Customer'],
        createdBy: 'Agent A',
        createdAt: '2025-01-26T15:00:00'
      },
      {
        id: 'MEET-003',
        title: 'Initial Consultation',
        description: 'First meeting to understand customer requirements',
        date: '2025-01-25',
        time: '11:00',
        duration: '60',
        location: 'Branch Office',
        meetingType: 'In-Person',
        status: 'Completed',
        participants: ['Agent A', 'Customer'],
        createdBy: 'Agent A',
        createdAt: '2025-01-24T09:00:00'
      }
    ];
    setMeetings(mockMeetings);
  }, [entityId]);

  const handleAddMeeting = () => {
    if (!newMeeting.title.trim() || !newMeeting.date || !newMeeting.time) return;

    const meeting = {
      id: `MEET-${String(meetings.length + 1).padStart(3, '0')}`,
      ...newMeeting,
      status: 'Scheduled',
      participants: newMeeting.participants.split(',').map(p => p.trim()).filter(Boolean),
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    };

    setMeetings([meeting, ...meetings]);
    setNewMeeting({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '30',
      location: '',
      meetingType: 'In-Person',
      participants: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteMeeting = (meetingId) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(meetings.filter(meeting => meeting.id !== meetingId));
    }
  };

  const handleMarkComplete = (meetingId) => {
    setMeetings(meetings.map(meeting =>
      meeting.id === meetingId
        ? { ...meeting, status: 'Completed' }
        : meeting
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isMeetingPast = (date, time) => {
    const meetingDateTime = new Date(`${date}T${time}`);
    return meetingDateTime < new Date();
  };

  const getMeetingIcon = (type) => {
    return type === 'Virtual' ? Video : MapPin;
  };

  const scheduledMeetings = meetings.filter(m => m.status === 'Scheduled');
  const completedMeetings = meetings.filter(m => m.status === 'Completed');

  return (
    <div className="p-6">
      {/* Add Meeting Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition mb-4"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Meeting</span>
        </button>
      )}

      {/* Add Meeting Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="space-y-3">
            <input
              type="text"
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              placeholder="Meeting title"
              className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <textarea
              value={newMeeting.description}
              onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
              placeholder="Meeting description (optional)"
              rows="2"
              className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                className="px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                className="px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={newMeeting.duration}
                onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                className="px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
              <select
                value={newMeeting.meetingType}
                onChange={(e) => setNewMeeting({ ...newMeeting, meetingType: e.target.value })}
                className="px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="In-Person">In-Person</option>
                <option value="Virtual">Virtual</option>
                <option value="Phone">Phone Call</option>
              </select>
            </div>
            <input
              type="text"
              value={newMeeting.location}
              onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
              placeholder="Location / Meeting link"
              className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={newMeeting.participants}
              onChange={(e) => setNewMeeting({ ...newMeeting, participants: e.target.value })}
              placeholder="Participants (comma separated)"
              className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddMeeting}
              disabled={!newMeeting.title.trim() || !newMeeting.date || !newMeeting.time}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Schedule
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewMeeting({
                  title: '',
                  description: '',
                  date: '',
                  time: '',
                  duration: '30',
                  location: '',
                  meetingType: 'In-Person',
                  participants: ''
                });
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Scheduled Meetings */}
      {scheduledMeetings.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Upcoming ({scheduledMeetings.length})
          </h4>
          <div className="space-y-3">
            {scheduledMeetings.map((meeting) => {
              const MeetingIcon = getMeetingIcon(meeting.meetingType);
              const isPast = isMeetingPast(meeting.date, meeting.time);

              return (
                <div
                  key={meeting.id}
                  className={`p-4 rounded-xl border ${
                    isPast
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{meeting.title}</h5>
                        {meeting.description && (
                          <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="p-1.5 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(meeting.date)} at {formatTime(meeting.time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4" />
                      <span>{meeting.duration} minutes</span>
                    </div>
                    {meeting.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MeetingIcon className="w-4 h-4" />
                        <span>{meeting.location}</span>
                      </div>
                    )}
                    {meeting.participants && meeting.participants.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="w-4 h-4" />
                        <span>{meeting.participants.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <span className={`text-xs px-3 py-1 rounded-lg ${
                      meeting.meetingType === 'Virtual'
                        ? 'bg-blue-100 text-blue-700'
                        : meeting.meetingType === 'Phone'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {meeting.meetingType}
                    </span>
                    {isPast && (
                      <button
                        onClick={() => handleMarkComplete(meeting.id)}
                        className="text-xs px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Meetings */}
      {completedMeetings.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Completed ({completedMeetings.length})
          </h4>
          <div className="space-y-3">
            {completedMeetings.map((meeting) => {
              const MeetingIcon = getMeetingIcon(meeting.meetingType);

              return (
                <div
                  key={meeting.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-75"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{meeting.title}</h5>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(meeting.date)} at {formatTime(meeting.time)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="p-1.5 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>

                  <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg">
                    Completed
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {meetings.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500">No meetings scheduled</p>
          <p className="text-sm text-gray-400 mt-1">Schedule your first meeting to get started</p>
        </div>
      )}
    </div>
  );
};

export default MeetingsSection;