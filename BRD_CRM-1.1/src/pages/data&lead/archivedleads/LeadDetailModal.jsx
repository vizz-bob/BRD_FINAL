import React, { useState, useEffect } from 'react';
import {
  X, User, Phone, Mail, Calendar, MapPin,
  Briefcase, Archive, AlertCircle, Clock,
  FileText, Activity, Loader2,
} from 'lucide-react';
import { ArchivedLeadService } from "../../../services/dataAndLeads.service";

const LeadDetailModal = ({ lead, onClose }) => {
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setTimelineLoading(true);
      try {
        const res = await ArchivedLeadService.retrieve(lead._rawId || lead.id);
        const data = res.data;
        if (data.assignment_history && data.assignment_history.length > 0) {
          setTimeline(
            data.assignment_history.map((h) => ({
              date: h.changed_at ? h.changed_at.split('T')[0] : '—',
              action: 'Reassigned',
              user: h.changed_by_name || `User ${h.changed_by}`,
              details: h.reason || h.note || '—',
              type: 'status',
            }))
          );
        } else {
          setTimeline(buildMockTimeline(lead));
        }
      } catch {
        setTimeline(buildMockTimeline(lead));
      } finally {
        setTimelineLoading(false);
      }
    };
    fetchHistory();
  }, [lead]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Archive className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Archived Lead Details</h2>
              <p className="text-sm text-gray-300">ID: {lead.id} | Read-Only View</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow icon={User}     label="Full Name"       value={lead.name} />
              <InfoRow icon={Phone}    label="Phone Number"    value={lead.phone} />
              <InfoRow icon={Mail}     label="Email Address"   value={lead.email} />
              <InfoRow icon={Briefcase} label="Product Interest" value={lead.product} />
              <InfoRow icon={MapPin}   label="Lead Source"     value={lead.source} />
              <InfoRow icon={Activity} label="Last Activity"   value={lead.lastActivity} />
            </div>
          </div>

          {/* Archive Info */}
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Archive className="w-5 h-5 mr-2 text-red-600" /> Archive Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow icon={Calendar}     label="Date Archived"          value={lead.archivedDate}      iconColor="text-red-600" />
              <InfoRow icon={User}         label="Archived By"            value={lead.archivedBy}        iconColor="text-red-600" />
              <InfoRow icon={AlertCircle}  label="Reason for Archiving"   value={lead.reason}            iconColor="text-red-600" />
              <InfoRow icon={FileText}     label="Final Disposition"      value={lead.finalDisposition}  iconColor="text-red-600" />
              <InfoRow icon={Clock}        label="Lead Age (Days Active)"  value={`${lead.leadAge} days`} iconColor="text-red-600" />
              <InfoRow icon={AlertCircle}  label="Compliance Status"      value={lead.complianceFlag}    iconColor="text-red-600" />
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" /> Activity Timeline
            </h3>
            {timelineLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-4">
                {timeline.map((item, i) => <TimelineItem key={i} item={item} />)}
              </div>
            )}
          </div>

          {/* Compliance Notice */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-indigo-900 mb-1">
                  Compliance &amp; Data Retention Notice
                </p>
                <p className="text-xs text-indigo-700">
                  This record is maintained for regulatory compliance and audit purposes. All data
                  is read-only and cannot be modified. Reactivation requires manager authorization.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value, iconColor = 'text-gray-400' }) => (
  <div className="flex items-start space-x-3">
    <Icon className={`w-5 h-5 ${iconColor} mt-0.5`} />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || '—'}</p>
    </div>
  </div>
);

const typeConfig = {
  archive: { bg: 'bg-red-100',    Icon: Archive,   color: 'text-red-600' },
  call:    { bg: 'bg-indigo-100', Icon: Phone,     color: 'text-indigo-600' },
  email:   { bg: 'bg-purple-100', Icon: Mail,      color: 'text-purple-600' },
  meeting: { bg: 'bg-yellow-100', Icon: Calendar,  color: 'text-yellow-600' },
  status:  { bg: 'bg-green-100',  Icon: Activity,  color: 'text-green-600' },
  created: { bg: 'bg-gray-100',   Icon: User,      color: 'text-gray-600' },
};

const TimelineItem = ({ item }) => {
  const cfg = typeConfig[item.type] || typeConfig.created;
  const { Icon } = cfg;
  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cfg.bg}`}>
          <Icon className={`w-4 h-4 ${cfg.color}`} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">{item.action}</p>
          <p className="text-xs text-gray-500">{item.date}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">By {item.user}</p>
        <p className="text-sm text-gray-600 mt-1">{item.details}</p>
      </div>
    </div>
  );
};

const buildMockTimeline = (lead) => [
  { date: lead.archivedDate, action: 'Lead Archived',  user: lead.archivedBy, details: `Reason: ${lead.reason}`,   type: 'archive' },
  { date: '—',               action: 'Last Activity',  user: '—',             details: lead.lastActivity,          type: 'call'    },
  { date: '—',               action: 'Lead Created',   user: 'System',        details: `Source: ${lead.source}`,   type: 'created' },
];

export default LeadDetailModal;
