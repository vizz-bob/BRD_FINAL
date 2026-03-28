// meetingsHelpers.js

/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
};

/**
 * Format time to 12-hour format
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date < today;
};

/**
 * Check if a date is today
 */
export const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  
  return date.toDateString() === today.toDateString();
};

/**
 * Get days until meeting
 */
export const getDaysUntil = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Smart time suggestions based on agent availability
 * Returns array of suggested time slots
 */
export const getSmartTimeSuggestions = (date, agentSchedule = []) => {
  const suggestions = [];
  const workingHours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];
  
  // Filter out times that are already booked
  const bookedTimes = agentSchedule
    .filter(m => m.scheduledDate === date)
    .map(m => m.scheduledTime);
  
  workingHours.forEach(time => {
    if (!bookedTimes.includes(time)) {
      suggestions.push({
        time: time,
        label: formatTime(time),
        available: true
      });
    }
  });
  
  return suggestions.slice(0, 6); // Return top 6 suggestions
};

/**
 * Validate meeting date and time
 */
export const validateMeetingDateTime = (date, time) => {
  const errors = {};
  
  if (!date) {
    errors.date = 'Date is required';
    return errors;
  }
  
  if (!time) {
    errors.time = 'Time is required';
    return errors;
  }
  
  // Check if date is in the past
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    errors.date = 'Date cannot be in the past';
  }
  
  // Check if time is in the past (if date is today)
  if (isToday(date)) {
    const [hours, minutes] = time.split(':');
    const selectedDateTime = new Date();
    selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    if (selectedDateTime < new Date()) {
      errors.time = 'Time cannot be in the past';
    }
  }
  
  // Check if time is within working hours
  const [hours] = time.split(':');
  const hour = parseInt(hours);
  
  if (hour < 9 || hour >= 18) {
    errors.time = 'Please select time between 9:00 AM and 6:00 PM';
  }
  
  return errors;
};

/**
 * Generate calendar invite content
 */
export const generateCalendarInvite = (meeting) => {
  const startDateTime = new Date(`${meeting.scheduledDate}T${meeting.scheduledTime}`);
  
  // Calculate end time (add duration)
  const durationMinutes = parseInt(meeting.duration) || 30;
  const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
  
  const formatDateTimeForCalendar = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const calendarEvent = {
    title: `Meeting: ${meeting.leadName}`,
    start: formatDateTimeForCalendar(startDateTime),
    end: formatDateTimeForCalendar(endDateTime),
    description: meeting.agenda,
    location: meeting.location
  };
  
  return calendarEvent;
};

/**
 * Generate Google Meet link (placeholder - would integrate with Google Calendar API)
 */
export const generateMeetLink = async (meeting) => {
  // This is a placeholder. In production, you'd integrate with Google Calendar API
  // or another video conferencing service
  
  const meetingId = Math.random().toString(36).substring(7);
  return `https://meet.google.com/${meetingId}`;
};

/**
 * Send calendar invite via email (placeholder)
 */
export const sendCalendarInvite = async (meeting, recipientEmail) => {
  // This is a placeholder. In production, you'd integrate with an email service
  
  const calendarEvent = generateCalendarInvite(meeting);
  
  console.log('Sending calendar invite to:', recipientEmail);
  console.log('Event details:', calendarEvent);
  
  // Would send email with .ics attachment or calendar invite
  return { success: true, message: 'Calendar invite sent' };
};

/**
 * Calculate meeting statistics
 */
export const calculateMeetingStats = (meetings) => {
  const stats = {
    total: meetings.length,
    scheduled: 0,
    completed: 0,
    noShow: 0,
    cancelled: 0,
    rescheduled: 0,
    positiveOutcomes: 0,
    completionRate: 0,
    noShowRate: 0
  };
  
  meetings.forEach(meeting => {
    if (meeting.status === 'Scheduled') stats.scheduled++;
    if (meeting.status === 'Completed') stats.completed++;
    if (meeting.status === 'No-show') stats.noShow++;
    if (meeting.status === 'Cancelled') stats.cancelled++;
    if (meeting.isRescheduled) stats.rescheduled++;
    if (meeting.outcome === 'Positive') stats.positiveOutcomes++;
  });
  
  const totalConducted = stats.completed + stats.noShow;
  if (totalConducted > 0) {
    stats.completionRate = ((stats.completed / totalConducted) * 100).toFixed(1);
    stats.noShowRate = ((stats.noShow / totalConducted) * 100).toFixed(1);
  }
  
  return stats;
};

/**
 * Sort meetings by date and time
 */
export const sortMeetings = (meetings, order = 'asc') => {
  return [...meetings].sort((a, b) => {
    const dateTimeA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
    const dateTimeB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
    
    return order === 'asc' ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
  });
};

/**
 * Filter meetings by date range
 */
export const filterByDateRange = (meetings, startDate, endDate) => {
  return meetings.filter(meeting => {
    const meetingDate = new Date(meeting.scheduledDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return meetingDate >= start && meetingDate <= end;
  });
};

/**
 * Get upcoming meetings (next 7 days)
 */
export const getUpcomingMeetings = (meetings) => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return meetings.filter(meeting => {
    const meetingDate = new Date(meeting.scheduledDate);
    return meetingDate >= today && meetingDate <= nextWeek && meeting.status === 'Scheduled';
  });
};

/**
 * Check for scheduling conflicts
 */
export const checkSchedulingConflicts = (newMeeting, existingMeetings) => {
  const conflicts = existingMeetings.filter(existing => {
    // Same date and agent
    if (existing.scheduledDate === newMeeting.scheduledDate && 
        existing.agentId === newMeeting.agentId &&
        existing.status === 'Scheduled') {
      
      // Check time overlap
      const existingTime = existing.scheduledTime;
      const newTime = newMeeting.scheduledTime;
      
      // Simple time check (would need more sophisticated logic for duration overlap)
      if (existingTime === newTime) {
        return true;
      }
    }
    return false;
  });
  
  return conflicts;
};

export default {
  formatDate,
  formatTime,
  isPastDate,
  isToday,
  getDaysUntil,
  getSmartTimeSuggestions,
  validateMeetingDateTime,
  generateCalendarInvite,
  generateMeetLink,
  sendCalendarInvite,
  calculateMeetingStats,
  sortMeetings,
  filterByDateRange,
  getUpcomingMeetings,
  checkSchedulingConflicts
};