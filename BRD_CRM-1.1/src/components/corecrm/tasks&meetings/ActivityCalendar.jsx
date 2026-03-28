import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Phone, Users, Mail, MessageCircle } from 'lucide-react';

const ActivityCalendar = ({ activities, onSelectActivity }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { year, month, daysInMonth, startingDayOfWeek };
  };

  const { year, month, daysInMonth, startingDayOfWeek } = getMonthData();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getActivitiesForDate = (day) => {
    const dateStr = new Date(year, month, day).toDateString();
    return activities.filter(activity => {
      const activityDate = new Date(activity.dueDate).toDateString();
      return activityDate === dateStr;
    });
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2 bg-gray-50 border border-gray-100"></div>
      );
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayActivities = getActivitiesForDate(day);
      const isCurrentDay = isToday(day);

      days.push(
        <div
          key={day}
          className={`p-2 border border-gray-200 min-h-[100px] ${
            isCurrentDay ? 'bg-indigo-50 border-indigo-300' : 'bg-white hover:bg-gray-50'
          } transition cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-semibold ${
              isCurrentDay ? 'text-indigo-600' : 'text-gray-900'
            }`}>
              {day}
            </span>
            {dayActivities.length > 0 && (
              <span className="text-xs px-2 py-0.5 bg-indigo-600 text-white rounded-full">
                {dayActivities.length}
              </span>
            )}
          </div>

          <div className="space-y-1">
            {dayActivities.slice(0, 3).map((activity) => {
              const getIcon = () => {
                if (activity.type === 'task') {
                  switch(activity.taskType) {
                    case 'call': return Phone;
                    case 'email': return Mail;
                    case 'whatsapp': return MessageCircle;
                    default: return Phone;
                  }
                } else {
                  return Users;
                }
              };

              const Icon = getIcon();
              const statusColor = 
                activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-600';

              return (
                <button
                  key={activity.id}
                  onClick={() => onSelectActivity(activity)}
                  className={`w-full text-left px-2 py-1 rounded-lg text-xs ${statusColor} hover:opacity-80 transition flex items-center gap-1`}
                >
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate font-medium">
                    {new Date(activity.dueDate).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </button>
              );
            })}
            
            {dayActivities.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{dayActivities.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition"
            >
              Today
            </button>
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span>Missed</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0 border-t border-l border-gray-200">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {activities.filter(a => {
                const d = new Date(a.dueDate);
                return d.getMonth() === month && d.getFullYear() === year;
              }).length}
            </div>
            <div className="text-xs text-gray-500">Total Activities</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">
              {activities.filter(a => {
                const d = new Date(a.dueDate);
                return d.getMonth() === month && d.getFullYear() === year && a.status === 'completed';
              }).length}
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-700">
              {activities.filter(a => {
                const d = new Date(a.dueDate);
                return d.getMonth() === month && d.getFullYear() === year && a.status === 'pending';
              }).length}
            </div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;