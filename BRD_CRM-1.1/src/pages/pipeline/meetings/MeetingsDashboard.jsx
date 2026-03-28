// MeetingsDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, Clock, CheckCircle,
  XCircle, RefreshCw, Video, Phone, MapPin,
  TrendingUp, AlertCircle
} from 'lucide-react';
import NewMeetings from './NewMeetings';
import RescheduledMeetings from './RescheduledMeetings';
import AllMeetings from './AllMeetings';
import MeetingsCalendarView from './MeetingsCalendarView';
import { meetingsService } from '../../../services/pipelineService';

const MeetingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [meetings, setMeetings] = useState([]);

  const handleScheduleMeeting = async (meetingData) => {
    try {
      const res = await meetingsService.create(meetingData);
      fetchMeetings()
      return res.data;
    } catch (error) {
      console.error("Failed to schedule meeting:", error);
    }
  };


  const mapMeeting = (item) => ({
    id: item.id, 

    leadName: item.lead_name,
    leadId: item.lead_id,

    phone: item.phone_number,
    email: item.email,

    meetingType: item.meeting_type,
    meetingMode: item.meeting_mode,

    scheduledDate: item.date,

    scheduledTime: item.time,   
    duration: item.duration,

    agenda: item.meeting_agenda,
    location: item.location_or_link,

    status: item.status,   // not provided in response, so default
    agentName: null,       // not provided in response
    agentId: null,         // not provided in response

    createdDate: item.date,

    isRescheduled: false,  // not provided → default
    rescheduleCount: 0,    // not provided → default

    attachments: [],       // not provided → default
    notes: item.notes,
    outcome: null,         // not provided
  });

  const fetchMeetings = async () => {
    try {
      const res = await meetingsService.list();
      const mapped = res.data.map(mapMeeting);
      setMeetings(mapped);
    }
    catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };


  useEffect(() => {
    fetchMeetings();
  }, []);
  // Mock data - replace with API call
  // useEffect(() => {

  //   const mockMeetings = [
  //     {
  //       id: 'MTG-001',
  //       leadName: 'Rajesh Kumar',
  //       leadId: 'QL-001',
  //       phone: '+91 98765 43210',
  //       email: 'rajesh.k@email.com',
  //       meetingType: 'Virtual',
  //       meetingMode: 'Google Meet',
  //       scheduledDate: '2026-03-15',
  //       scheduledTime: '10:00 AM',
  //       duration: '30 mins',
  //       agenda: 'Discuss home loan eligibility and documentation',
  //       location: 'https://meet.google.com/abc-defg-hij',
  //       status: 'Scheduled',
  //       agentName: 'Agent A',
  //       agentId: 'AGT-001',
  //       createdDate: '2026-03-15',
  //       isRescheduled: false,
  //       rescheduleCount: 0,
  //       attachments: ['loan_brochure.pdf'],
  //       notes: '',
  //       outcome: null
  //     },
  //     {
  //       id: 'MTG-002',
  //       leadName: 'Priya Sharma',
  //       leadId: 'QL-002',
  //       phone: '+91 98765 43211',
  //       email: 'priya.s@email.com',
  //       meetingType: 'In-person',
  //       meetingMode: 'Physical',
  //       scheduledDate: '2025-01-22',
  //       scheduledTime: '2:00 PM',
  //       duration: '45 mins',
  //       agenda: 'Personal loan application review and KYC',
  //       location: 'Branch Office - Mumbai',
  //       status: 'Scheduled',
  //       agentName: 'Agent B',
  //       agentId: 'AGT-002',
  //       createdDate: '2025-01-16',
  //       isRescheduled: true,
  //       rescheduleCount: 1,
  //       previousDate: '2025-01-18',
  //       attachments: [],
  //       notes: 'Customer requested later time',
  //       outcome: null
  //     },
  //     {
  //       id: 'MTG-003',
  //       leadName: 'Amit Patel',
  //       leadId: 'QL-003',
  //       phone: '+91 98765 43212',
  //       email: 'amit.p@email.com',
  //       meetingType: 'Telephonic',
  //       meetingMode: 'Phone',
  //       scheduledDate: '2025-01-18',
  //       scheduledTime: '11:30 AM',
  //       duration: '20 mins',
  //       agenda: 'Car loan eligibility discussion',
  //       location: 'N/A',
  //       status: 'Completed',
  //       agentName: 'Agent A',
  //       agentId: 'AGT-001',
  //       createdDate: '2025-01-10',
  //       isRescheduled: false,
  //       rescheduleCount: 0,
  //       attachments: [],
  //       notes: 'Lead is interested, needs time to arrange documents',
  //       outcome: 'Positive'
  //     }
  //   ];
  //   setMeetings(mockMeetings);
  // }, []);

  // Calculate statistics
  const stats = [
    {
      label: 'Total Meetings',
      value: meetings.length.toString(),
      icon: Calendar,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      change: '+8 this week'
    },
    {
      label: 'Scheduled',
      value: meetings.filter(m => m.status === 'Scheduled').length.toString(),
      icon: Clock,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      change: 'Upcoming'
    },
    {
      label: 'Completed',
      value: meetings.filter(m => m.status === 'Completed').length.toString(),
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      change: '85% success rate'
    },
    {
      label: 'Rescheduled',
      value: meetings.filter(m => m.isRescheduled).length.toString(),
      icon: RefreshCw,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      change: 'Needs attention'
    }
  ];

  const tabs = [
    { id: 'new', label: 'New Meetings', icon: Calendar },
    { id: 'rescheduled', label: 'Rescheduled', icon: RefreshCw },
    { id: 'all', label: 'All Meetings', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-2xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">Meetings (Interaction)</h1>
              <p className="text-sm text-gray-500">
                Schedule and manage customer meetings • Stage 6 Pipeline
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-600">{stat.change}</p>
                    </div>
                    <div className={`p-4 ${stat.bgColor} rounded-xl`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <nav className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${isActive
                      ? 'border-indigo-600 text-indigo-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${viewMode === 'calendar'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Calendar View
                </button>
              </div>

              {/* Mobile select fallback */}
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="sm:hidden px-3 py-2 rounded-xl bg-gray-100 text-gray-700"
              >
                <option value="list">List View</option>
                <option value="calendar">Calendar View</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {viewMode === 'calendar' ? (
          <MeetingsCalendarView meetings={meetings} />
        ) : (
          <>
            {activeTab === 'new' && <NewMeetings onSubmit={handleScheduleMeeting} fetchMeetings={fetchMeetings} meetings={meetings} setMeetings={setMeetings} />}
            {activeTab === 'rescheduled' && <RescheduledMeetings meetings={meetings} setMeetings={setMeetings} />}
            {activeTab === 'all' && <AllMeetings meetings={meetings} setMeetings={setMeetings} />}
          </>
        )}
      </div>
    </div>
  );
};

export default MeetingsDashboard;