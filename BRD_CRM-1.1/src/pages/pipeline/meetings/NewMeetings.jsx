// NewMeetings.jsx
import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar } from 'lucide-react';
import MeetingsTable from './MeetingsTable';
import MeetingDetailsPanel from './MeetingDetailsPanel';
import ScheduleMeetingModal from './ScheduleMeetingModal';

const NewMeetings = ({ onSubmit, fetchMeetings, meetings, setMeetings }) => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Filter only new/upcoming meetings (not rescheduled, status = Scheduled)
  const newMeetings = meetings.filter(m =>
    !m.isRescheduled &&
    m.status === 'Scheduled' &&
    new Date(m.scheduledDate) >= new Date()
  );

  // Apply search and filters
  const filteredMeetings = newMeetings.filter(meeting => {
    const matchesSearch =
      meeting.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.phone.includes(searchTerm);

    const matchesFilter = filterType === 'all' || meeting.meetingType === filterType;

    return matchesSearch && matchesFilter;
  });

  const buildMeetingPayload = (data) => ({
    date: data.scheduledDate,
    time: data.scheduledTime,
    duration: data.duration,          // must match backend choices
    lead_id: data.leadId,
    lead_name: data.leadName,
    meeting_agenda: data.agenda,
    meeting_mode: data.meetingMode,
    meeting_type: data.meetingType,
    phone_number: data.phone,
    email: data.email,
    location: data.location,
    notes: data.notes,
  });
  const handleScheduleMeeting = (meetingData) => {
    const newMeeting = {
      id: `MTG-${String(meetings.length + 1).padStart(3, '0')}`,
      ...meetingData,
      status: 'Scheduled',
      isRescheduled: false,
      rescheduleCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      outcome: null
    };

    setShowScheduleModal(false);
    onSubmit(buildMeetingPayload(newMeeting));
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 md:flex-initial px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="Virtual">Virtual</option>
            <option value="In-person">In-person</option>
            <option value="Telephonic">Telephonic</option>
          </select>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-indigo-900 mb-1">New Meetings</h3>
            <p className="text-sm text-indigo-700">
              Shows only upcoming meetings that haven't been rescheduled.
              Total: <span className="font-bold">{filteredMeetings.length}</span> scheduled meetings.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meetings Table */}
        <div className={selectedMeeting ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <MeetingsTable
            meetings={filteredMeetings}
            selectedMeeting={selectedMeeting}
            onSelectMeeting={setSelectedMeeting}
            emptyMessage="No new meetings scheduled"
          />
        </div>

        {/* Details Panel */}
        {selectedMeeting && (
          <div className="lg:col-span-1">
            <MeetingDetailsPanel
              meeting={selectedMeeting}
              onClose={() => setSelectedMeeting(null)}
              refreshMeetings={fetchMeetings}
              onUpdate={(updatedMeeting) => {
                setMeetings(meetings.map(m =>
                  m.id === updatedMeeting.id ? updatedMeeting : m
                ));
                setSelectedMeeting(updatedMeeting);
              }}
            />
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <ScheduleMeetingModal

          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleMeeting}
        />
      )}
    </div>
  );
};

export default NewMeetings;