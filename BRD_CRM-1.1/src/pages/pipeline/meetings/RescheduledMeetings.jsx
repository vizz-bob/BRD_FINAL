// RescheduledMeetings.jsx
import React, { useState } from 'react';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';
import MeetingsTable from './MeetingsTable';
import MeetingDetailsPanel from './MeetingDetailsPanel';

const RescheduledMeetings = ({ meetings, setMeetings }) => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter only rescheduled meetings
  const rescheduledMeetings = meetings.filter(m => m.status == "Rescheduled");

  // Apply search and status filters
  const filteredMeetings = rescheduledMeetings.filter(meeting => {
    const matchesSearch = 
      meeting.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.id === searchTerm ||
      meeting.phone.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || meeting.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Count meetings rescheduled multiple times (warning threshold)
  const multipleReschedules = filteredMeetings.filter(m => m.rescheduleCount >= 2);

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

        {/* Status Filter */}
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 md:flex-initial px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No-show">No-show</option>
          </select>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <RefreshCw className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 mb-1">Rescheduled Meetings</h3>
            <p className="text-sm text-yellow-700">
              Shows meetings that have been moved from their original date/time. 
              Total: <span className="font-bold">{filteredMeetings.length}</span> rescheduled meetings.
            </p>
          </div>
        </div>
      </div>

      {/* Warning Alert for Multiple Reschedules */}
      {multipleReschedules.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">
                Attention Required
              </h3>
              <p className="text-sm text-red-700">
                <span className="font-bold">{multipleReschedules.length}</span> meeting(s) have been 
                rescheduled 2+ times. Consider supervisor notification or alternative approach.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <RefreshCw className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Rescheduled</p>
              <p className="text-2xl font-bold text-gray-900">{filteredMeetings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Multiple Reschedules</p>
              <p className="text-2xl font-bold text-gray-900">{multipleReschedules.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <RefreshCw className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Reschedules</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredMeetings.length > 0 
                  ? (filteredMeetings.reduce((sum, m) => sum + m.rescheduleCount, 0) / filteredMeetings.length).toFixed(1)
                  : '0'
                }
              </p>
            </div>
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
            emptyMessage="No rescheduled meetings found"
          />
        </div>

        {/* Details Panel */}
        {selectedMeeting && (
          <div className="lg:col-span-1">
            <MeetingDetailsPanel 
              meeting={selectedMeeting}
              onClose={() => setSelectedMeeting(null)}
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
    </div>
  );
};

export default RescheduledMeetings;