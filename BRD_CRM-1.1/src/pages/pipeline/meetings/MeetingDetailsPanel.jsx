// MeetingDetailsPanel.jsx
import React, { useState } from 'react';
import {
  X, Calendar, Clock, MapPin, User, FileText,
  Video, Phone, CheckCircle, XCircle, RefreshCw,
  Edit, Trash2, ArrowRight
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import OutcomeModal from './OutcomeModal';
import { meetingsService } from '../../../services/pipelineService';

const MeetingDetailsPanel = ({ meeting, onClose, onUpdate, refreshMeetings }) => {
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: meeting.scheduledDate,
    time: meeting.scheduledTime,
    reason: ''
  });

  const getMeetingIcon = () => {
    switch (meeting.meetingMode) {
      case 'Google Meet':
      case 'Zoom':
      case 'WhatsApp':
        return <Video className="w-5 h-5 text-indigo-600" />;
      case 'Phone':
        return <Phone className="w-5 h-5 text-green-600" />;
      case 'Physical':
        return <MapPin className="w-5 h-5 text-indigo-600" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleData.date || !rescheduleData.time) {
      alert("Please select both date and time");
      return;
    }

    try {
      const payload = {
        date: rescheduleData.date,
        time: rescheduleData.time,
        reason: rescheduleData.reason
      };

      const res = await meetingsService.reschedule(meeting.id, payload);

      await refreshMeetings();
      onClose();

      setShowRescheduleForm(false);

    } catch (error) {
      console.error("Reschedule failed:", error);
      alert("Failed to reschedule meeting.");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this meeting?")) {
      return;
    }

    try {
      const res = await meetingsService.cancel(id);

      await refreshMeetings();
      onClose();

    } catch (error) {
      console.error("Cancel failed:", error);
      alert("Failed to cancel meeting.");
    }
  };

  const handleLogOutcome = async (outcomeData) => {
    const updatedMeeting = {
      meeting: outcomeData.meeting,
      next_action: outcomeData.next_action,
      meeting_status: outcomeData.status,
      meeting_outcome: outcomeData.outcome,
      meeting_summary_notes: meeting.notes + `\n[Outcome logged on ${new Date().toLocaleDateString()}]: ${outcomeData.notes}`
    };
    await meetingsService.saveOutcome(updatedMeeting)

    await refreshMeetings();
    onClose();
    setShowOutcomeModal(false);

    // If positive outcome, suggest moving to Deals
    if (outcomeData.outcome === 'Positive') {
      if (window.confirm('Meeting had a positive outcome! Would you like to move this lead to Deals stage?')) {
        // Here you would integrate with your lead pipeline update logic
        alert('Lead would be moved to Deals stage (integrate with your pipeline logic)');
      }
    }

    // If no-show, offer to reschedule
    if (outcomeData.status === 'No-show') {
      if (window.confirm('Lead did not show up. Would you like to reschedule?')) {
        setShowRescheduleForm(true);
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Meeting Details</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Lead Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Lead Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Lead Name</p>
                  <p className="font-semibold text-gray-900">{meeting.leadName}</p>
                  <p className="text-xs text-gray-500 mt-1">{meeting.leadId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium text-gray-900">{meeting.phone}</p>
                  {meeting.email && (
                    <p className="text-sm text-gray-600 mt-1">{meeting.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Meeting Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {getMeetingIcon()}
                <div>
                  <p className="text-sm text-gray-500">Type & Mode</p>
                  <p className="font-semibold text-gray-900">{meeting.meetingType}</p>
                  <p className="text-sm text-gray-600">{meeting.meetingMode}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Scheduled</p>
                  <p className="font-semibold text-gray-900">{meeting.scheduledDate}</p>
                  <p className="text-sm text-gray-600">{meeting.scheduledTime} • {meeting.duration}</p>
                </div>
              </div>

              {meeting.location && meeting.location !== 'N/A' && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Location</p>
                    {meeting.location.startsWith('http') ? (
                      <a
                        href={meeting.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm break-all"
                      >
                        Join Meeting Link
                      </a>
                    ) : (
                      <p className="font-medium text-gray-900">{meeting.location}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Assigned Agent</p>
                  <p className="font-semibold text-gray-900">{meeting.agentName}</p>
                  <p className="text-xs text-gray-500">{meeting.agentId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Status
            </h4>
            <StatusBadge status={meeting.status} />
            {meeting.isRescheduled && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800">
                  <RefreshCw className="w-4 h-4 inline mr-1" />
                  Rescheduled {meeting.rescheduleCount}x
                </p>
                {meeting.previousDate && (
                  <p className="text-xs text-yellow-600 mt-1">
                    Original date: {meeting.previousDate}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Agenda */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Agenda
            </h4>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
              {meeting.agenda}
            </p>
          </div>

          {/* Notes */}
          {meeting.notes && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Notes
              </h4>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">
                {meeting.notes}
              </div>
            </div>
          )}

          {/* Outcome (if completed) */}
          {meeting.outcome && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Outcome
              </h4>
              <div className={`p-3 rounded-xl border ${meeting.outcome === 'Positive'
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
                }`}>
                <p className="font-semibold text-gray-900">{meeting.outcome}</p>
              </div>
            </div>
          )}

          {/* Reschedule Form (if shown) */}
          {showRescheduleForm && meeting.status === 'Scheduled' && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Reschedule Meeting
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={rescheduleData.time}
                    onChange={(e) => setRescheduleData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    value={rescheduleData.reason}
                    onChange={(e) => setRescheduleData(prev => ({ ...prev, reason: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="Reason for rescheduling..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReschedule}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    Confirm Reschedule
                  </button>
                  <button
                    onClick={() => setShowRescheduleForm(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          {meeting.status === 'Scheduled' && (
            <>
              <button
                onClick={() => setShowOutcomeModal(true)}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Log Outcome
              </button>

              <button
                onClick={() => setShowRescheduleForm(!showRescheduleForm)}
                className="w-full px-4 py-3 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition font-medium flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reschedule
              </button>

              <button
                onClick={() => handleCancel(meeting.id)}
                className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition font-medium flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel Meeting
              </button>
            </>
          )}

          {meeting.status === 'Completed' && meeting.outcome === 'Positive' && (
            <button
              onClick={() => alert('Move to Deals pipeline (integrate with your logic)')}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Move to Deals
            </button>
          )}
        </div>
      </div>

      {/* Outcome Modal */}
      {showOutcomeModal && (
        <OutcomeModal
          meeting={meeting}
          onClose={() => setShowOutcomeModal(false)}
          onSubmit={handleLogOutcome}
        />
      )}
    </>
  );
};

export default MeetingDetailsPanel;