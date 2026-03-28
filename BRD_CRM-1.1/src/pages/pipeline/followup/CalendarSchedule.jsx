import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  MessageSquare,
  Mail,
  Video,
  MoreHorizontal
} from 'lucide-react';

// ─── Seeded Pseudo-Random Generator ────────────────────────────────────────
// Produces deterministic "random" values for a given seed so that each
// calendar date always shows the same appointments (no flickering on re-render).
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 17)) >>> 0) / 4294967296;
  };
}


const HOURS = [9, 10, 11, 13, 14, 15, 16, 17];
const MINUTES = [0, 15, 30, 45];

// ─── Helpers ────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// JS getDay(): 0=Sun … 6=Sat  →  convert to Mon=0 … Sun=6
function getFirstDayOffset(year, month) {
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7;
}

// ─── Icon Helper ────────────────────────────────────────────────────────────
const getTypeIcon = (type) => {
  switch (type) {
    case 'Call': return <Phone size={14} className="text-indigo-500" />;
    case 'WhatsApp': return <MessageSquare size={14} className="text-green-500" />;
    case 'Meeting': return <Video size={14} className="text-purple-500" />;
    default: return <Mail size={14} className="text-indigo-500" />;
  }
};

// ─── Main Component ─────────────────────────────────────────────────────────
const CalendarSchedule = ({ tasksData }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);

  // ── Navigate months ──
  const goToPrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const goToNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // ── Calendar grid data ──
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOffset = getFirstDayOffset(viewYear, viewMonth);

  // Pre-compute appointment counts for every day in the view (for the colored dots)
  const appointmentMap = useMemo(() => {
    const map = {};

    // Initialize all days
    for (let d = 1; d <= daysInMonth; d++) {
      map[d] = [];
    }

    if (!tasksData) return map;

    tasksData.forEach(task => {
      if (!task.due) return;

      const dateObj = new Date(task.due);

      if (
        dateObj.getFullYear() === viewYear &&
        dateObj.getMonth() === viewMonth
      ) {
        const day = dateObj.getDate();

        map[day].push({
          id: task.id,
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          lead: task.lead,
          type: task.type,
          status: task.status,
          priority: task.priority,
          sortKey: dateObj.getHours() * 60 + dateObj.getMinutes()
        });
      }
    });

    // Sort each day chronologically
    Object.keys(map).forEach(day => {
      map[day].sort((a, b) => a.sortKey - b.sortKey);
    });

    return map;
  }, [tasksData, viewYear, viewMonth, daysInMonth]);

  // ── Selected day's appointments ──
  const selectedAppointments = useMemo(() => {
    if (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth
    ) {
      return appointmentMap[selectedDate.getDate()] || [];
    }
    return [];
  }, [selectedDate, viewYear, viewMonth, appointmentMap]);

  // ── Helpers for rendering ──
  const isToday = (day) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSelected = (day) =>
    day === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear();

  const handleDayClick = (day) => {
    setSelectedDate(new Date(viewYear, viewMonth, day));
  };

  // Formatted label for the agenda panel
  const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const selLabel = `${DAY_NAMES_FULL[selectedDate.getDay()]}, ${MONTH_NAMES[selectedDate.getMonth()].slice(0, 3)} ${String(selectedDate.getDate()).padStart(2, '0')}, ${selectedDate.getFullYear()}`;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[600px] bg-white rounded-2xl overflow-hidden shadow-lg">

      {/* ── Left: Calendar Grid ── */}
      <div className="hidden lg:flex lg:flex-1 flex-col p-6 border-r border-gray-100 overflow-y-auto">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="text-indigo-600" size={20} />
            Follow-Up Calendar
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={goToPrev} className="p-2 hover:bg-gray-50 border-r border-gray-200 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={goToNext} className="p-2 hover:bg-gray-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
            <span className="text-sm font-bold text-gray-700 w-32 text-right">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
          </div>
        </div>

        {/* Day-of-week labels */}
        <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
          {DAY_LABELS.map(d => (
            <span key={d} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d}</span>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1.5 flex-1" style={{ alignContent: 'start' }}>
          {/* Empty spacer cells for offset */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`spacer-${i}`} className="h-[72px]" />
          ))}

          {/* Actual day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const appts = appointmentMap[day];
            const hasAppts = appts && appts.length > 0;
            const selected = isSelected(day);
            const todayCell = isToday(day);

            // Collect unique status colors for dots
            const statusColors = appts
              ? [...new Set(appts.map(a => a.status === 'Confirmed' ? 'bg-green-400' : a.status === 'Pending' ? 'bg-amber-400' : 'bg-indigo-400'))]
              : [];

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={[
                  'h-[72px] p-1.5 border rounded-xl cursor-pointer transition-all duration-150',
                  selected
                    ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                    : todayCell
                      ? 'border-indigo-300 bg-indigo-50/30'
                      : 'border-gray-100 bg-gray-50/30 hover:border-indigo-300 hover:bg-indigo-50/20',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <span className={[
                    'text-xs font-bold',
                    selected ? 'text-indigo-700' : todayCell ? 'text-indigo-600' : 'text-gray-500'
                  ].join(' ')}>
                    {day}
                  </span>
                  {todayCell && !selected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                </div>

                {/* Status dots */}
                {hasAppts && (
                  <div className="mt-1.5 flex gap-1">
                    {statusColors.map((color, idx) => (
                      <span key={idx} className={`h-1.5 flex-1 rounded-full ${color}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Confirmed
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Pending
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" /> Follow-up
          </span>
        </div>
      </div>

      {/* ── Right: Daily Agenda ── */}
      <div className="w-full lg:w-80 bg-gray-50/50 p-4 sm:p-6 flex flex-col" style={{ minHeight: 0 }}>

        {/* Mobile: mini month nav */}
        <div className="flex lg:hidden items-center justify-between mb-3">
          <button onClick={goToPrev} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"><ChevronLeft size={18} /></button>
          <span className="text-sm font-bold text-gray-700">{MONTH_NAMES[viewMonth]} {viewYear}</span>
          <button onClick={goToNext} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"><ChevronRight size={18} /></button>
        </div>

        {/* Mobile: horizontal scrolling day pills */}
        <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const sel = isSelected(day);
            const tod = isToday(day);
            const hasA = appointmentMap[day]?.length > 0;
            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={[
                  'flex-shrink-0 w-12 flex flex-col items-center py-1.5 rounded-xl transition-all',
                  sel ? 'bg-indigo-600 text-white shadow-md' : tod ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                ].join(' ')}
              >
                <span className="text-[9px] font-bold uppercase opacity-70">
                  {DAY_LABELS[new Date(viewYear, viewMonth, day).getDay() === 0 ? 6 : new Date(viewYear, viewMonth, day).getDay() - 1]}
                </span>
                <span className="text-sm font-bold">{day}</span>
                {hasA && <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${sel ? 'bg-white' : 'bg-indigo-400'}`} />}
              </button>
            );
          })}
        </div>

        {/* Label */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Schedule for</p>
          <h4 className="text-sm font-bold text-gray-900">{selLabel}</h4>
        </div>

        {/* Appointment list */}
        <div className="flex-1 space-y-3 overflow-y-auto" style={{ maxHeight: '340px' }}>
          {selectedAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <CalendarIcon size={28} className="mb-2 opacity-40" />
              <p className="text-xs font-semibold">No appointments</p>
            </div>
          ) : (
            selectedAppointments.map((appt) => (
              <div key={appt.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                    {appt.time}
                  </span>
                  <button className="text-gray-300 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-2">{appt.lead}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getTypeIcon(appt.type)}
                    <span className="text-[11px] font-medium text-gray-500">{appt.type}</span>
                  </div>
                  <span className={`text-[10px] font-bold ${appt.status === 'Confirmed' ? 'text-green-600' : appt.status === 'Pending' ? 'text-amber-600' : 'text-indigo-600'}`}>
                    ● {appt.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarSchedule;
