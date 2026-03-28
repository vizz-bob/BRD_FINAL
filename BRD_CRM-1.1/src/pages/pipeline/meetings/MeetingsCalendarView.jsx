// MeetingsCalendarView.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

const MeetingsCalendarView = ({ meetings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Get calendar days for current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Get meetings for a specific date
  const getMeetingsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return meetings.filter(m => m.scheduledDate === dateStr);
  };

  // Group meetings for mobile list view
  const meetingsByDate = meetings.reduce((acc, m) => {
    acc[m.scheduledDate] = acc[m.scheduledDate] || [];
    acc[m.scheduledDate].push(m);
    return acc;
  }, {});
  const sortedDates = Object.keys(meetingsByDate).sort((a, b) => new Date(a) - new Date(b));

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">{monthName}</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-white/20 rounded-xl transition"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition text-white text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-white/20 rounded-xl transition"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
              {/* Desktop Calendar (hidden on small screens) */}
        <div className="hidden sm:block">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              const dayMeetings = getMeetingsForDate(date);
              const hasScheduled = dayMeetings.some(m => m.status === 'Scheduled');
              const hasCompleted = dayMeetings.some(m => m.status === 'Completed');
              
              return (
                <div
                  key={index}
                  className={`min-h-[70px] sm:min-h-[100px] border rounded-xl p-2 transition ${
                    !date
                      ? 'bg-gray-50 border-gray-100'
                      : isToday(date)
                      ? 'bg-indigo-50 border-indigo-300 border-2'
                      : isPastDate(date)
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-200 hover:border-indigo-300 cursor-pointer'
                  }`}
                >
                  {date && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${
                          isToday(date)
                            ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full'
                            : isPastDate(date)
                            ? 'text-gray-400'
                            : 'text-gray-900'
                        }`}>
                          {date.getDate()}
                        </span>
                        {dayMeetings.length > 0 && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                            {dayMeetings.length}
                          </span>
                        )}
                      </div>

                      {/* Meeting Indicators */}
                      <div className="space-y-1">
                        {dayMeetings.slice(0, 2).map(meeting => (
                          <button
                            key={meeting.id}
                            onClick={() => setSelectedMeeting(meeting)}
                            className={`w-full text-left p-1.5 rounded-lg text-xs font-medium transition ${
                              meeting.status === 'Scheduled'
                                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                : meeting.status === 'Completed'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span className="truncate">{meeting.scheduledTime}</span>
                            </div>
                            <div className="truncate mt-0.5">{meeting.leadName}</div>
                          </button>
                        ))}
                        {dayMeetings.length > 2 && (
                          <div className="text-xs text-gray-500 text-center py-1">
                            +{dayMeetings.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile list fallback */}
        <div className="sm:hidden p-0">
          {sortedDates.length === 0 ? (
            <div className="text-sm text-gray-500">No meetings scheduled</div>
          ) : (
            sortedDates.map(date => (
              <div key={date} className="mb-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">{date}</div>
                <div className="space-y-2">
                  {meetingsByDate[date].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMeeting(m)}
                      className="w-full text-left p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">{m.scheduledTime} • {m.leadName}</div>
                        <div className="text-xs text-gray-500">{m.meetingType} • {m.meetingMode}</div>
                      </div>
                      <div className="text-xs text-gray-500">{m.status}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-sm font-medium text-gray-700">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-100 rounded"></div>
            <span className="text-sm text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-50 border-2 border-indigo-300 rounded"></div>
            <span className="text-sm text-gray-600">Today</span>
          </div>
        </div>
      </div>

      {/* Selected Meeting Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Meeting Details</h3>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-xl text-gray-500">×</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Lead</p>
                <p className="font-semibold text-gray-900">{selectedMeeting.leadName}</p>
                <p className="text-xs text-gray-500">{selectedMeeting.leadId}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {selectedMeeting.scheduledDate} at {selectedMeeting.scheduledTime}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium text-gray-900">
                  {selectedMeeting.meetingType} - {selectedMeeting.meetingMode}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <StatusBadge status={selectedMeeting.status} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Agenda</p>
                <p className="text-sm text-gray-700">{selectedMeeting.agenda}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedMeeting(null)}
              className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsCalendarView;