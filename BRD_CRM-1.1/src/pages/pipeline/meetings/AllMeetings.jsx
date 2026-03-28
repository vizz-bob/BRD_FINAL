// AllMeetings.jsx
import React, { useState } from 'react';
import { Search, Download, Filter, Calendar } from 'lucide-react';
import MeetingsTable from './MeetingsTable';
import MeetingDetailsPanel from './MeetingDetailsPanel';

const AllMeetings = ({ meetings, setMeetings }) => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: 'all',
    agent: 'all'
  });

  // Apply all filters
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = 
      meeting.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.phone.includes(searchTerm);
    
    const matchesStatus = filters.status === 'all' || meeting.status === filters.status;
    const matchesType = filters.type === 'all' || meeting.meetingType === filters.type;
    const matchesAgent = filters.agent === 'all' || meeting.agentName === filters.agent;

    // Date range filter
    let matchesDate = true;
    if (filters.dateRange !== 'all') {
      const meetingDate = new Date(meeting.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch(filters.dateRange) {
        case 'today':
          matchesDate = meetingDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = meetingDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchesDate = meetingDate >= monthAgo;
          break;
        case 'upcoming':
          matchesDate = meetingDate >= today;
          break;
        case 'past':
          matchesDate = meetingDate < today;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesAgent && matchesDate;
  });

  // Get unique agents for filter
  const uniqueAgents = [...new Set(meetings.map(m => m.agentName))];

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Meeting ID', 'Lead Name', 'Lead ID', 'Phone', 'Type', 'Mode', 'Date', 'Time', 'Agent', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredMeetings.map(m => [
        m.id,
        m.leadName,
        m.leadId,
        m.phone,
        m.meetingType,
        m.meetingMode,
        m.scheduledDate,
        m.scheduledTime,
        m.agentName,
        m.status
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meetings_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Search and Export Bar */}
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

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-show">No-show</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="Virtual">Virtual</option>
              <option value="In-person">In-person</option>
              <option value="Telephonic">Telephonic</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          {/* Agent Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent
            </label>
            <select
              value={filters.agent}
              onChange={(e) => handleFilterChange('agent', e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Agents</option>
              {uniqueAgents.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filters.status !== 'all' || filters.type !== 'all' || filters.dateRange !== 'all' || filters.agent !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredMeetings.length}</span> of {meetings.length} meetings
              </p>
              <button
                onClick={() => setFilters({ status: 'all', type: 'all', dateRange: 'all', agent: 'all' })}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{filteredMeetings.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Scheduled</p>
          <p className="text-2xl font-bold text-indigo-600">
            {filteredMeetings.filter(m => m.status === 'Scheduled').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredMeetings.filter(m => m.status === 'Completed').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">No-show</p>
          <p className="text-2xl font-bold text-red-600">
            {filteredMeetings.filter(m => m.status === 'No-show').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-gray-600">
            {filteredMeetings.filter(m => m.status === 'Cancelled').length}
          </p>
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
            emptyMessage="No meetings found with the selected filters"
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

export default AllMeetings;