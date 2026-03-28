// CommunicationTimeline.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Filter, Download, Phone, Mail, MessageSquare,
  Video, ArrowUpCircle, ArrowDownCircle, Calendar,
  Loader2, AlertCircle,
  Users
} from 'lucide-react';
import { getTimelineCommunications } from '../../../services/communicationService';

const modeToType = (mode) => (mode === 'meet' ? 'video' : mode || 'chat');

const toUiActivity = (row) => ({
  id: `API-${row.id}`,
  type: modeToType(row.mode),
  direction: row.direction || row.conversation_type || 'outbound',
  leadId: row.lead_id || row.deal_id || null,
  leadName: row.subject || (row.lead_id ? `Lead ${row.lead_id}` : 'Internal Communication'),
  message: row.message_content || 'No message content',
  timestamp: row.timestamp
    ? new Date(row.timestamp).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'N/A',
  status: row.status || 'pending',
  agent: row.created_by || 'System',
  sortAt: row.timestamp ? new Date(row.timestamp).getTime() : 0,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
const TYPE_ICON = {
  whatsapp: <MessageSquare className="w-5 h-5 text-green-600" />,
  call: <Phone className="w-5 h-5 text-blue-600" />,
  email: <Mail className="w-5 h-5 text-indigo-600" />,
  video: <Video className="w-5 h-5 text-purple-600" />,
  chat: <MessageSquare className="w-5 h-5 text-gray-600" />,
};

const STATUS_BADGE = {
  delivered: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-yellow-100 text-yellow-700',
  read: 'bg-purple-100 text-purple-700',
  failed: 'bg-red-100 text-red-700',
  initiated: 'bg-indigo-100 text-indigo-700',
  pending: 'bg-gray-100 text-gray-700',
};

const DirectionIcon = ({ direction }) => {
  if (direction === 'outbound')
    return <ArrowUpCircle className="w-4 h-4 text-indigo-500" />;
  if (direction === 'inbound')
    return <ArrowDownCircle className="w-4 h-4 text-green-500" />;
  if (direction === 'internal')
    return <Users className="w-4 h-4 text-gray-400" />;
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * CommunicationTimeline
 * Props:
 *  - liveEntries: array of log objects pushed from External/Internal components
 *    (these are prepended so newest is always first)
 */
const CommunicationTimeline = ({ liveEntries = [] }) => {
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [filterDirection, setFilterDirection] = useState('all');
  const [backendActivities, setBackendActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getTimelineCommunications()
      .then((rows) => {
        if (!mounted) return;
        setBackendActivities(rows.map(toUiActivity));
      })
      .catch(() => {
        if (!mounted) return;
        setError('Failed to load communication timeline from backend.');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const liveUiActivities = useMemo(
    () =>
      liveEntries.map((row) => ({
        ...row,
        sortAt: Date.now(),
      })),
    [liveEntries]
  );

  // Merge backend + session entries and remove duplicates by id.
  const allActivities = useMemo(() => {
    const merged = [...liveUiActivities, ...backendActivities];
    const unique = [];
    const seen = new Set();

    for (const item of merged) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      unique.push(item);
    }

    unique.sort((a, b) => (b.sortAt || 0) - (a.sortAt || 0));
    return unique;
  }, [liveUiActivities, backendActivities]);

  const filtered = allActivities.filter((a) => {
    if (filterType !== 'all' && a.type !== filterType) return false;
    if (filterDirection !== 'all' && a.direction !== filterDirection) return false;
    return true;
  });

  const handleExport = () => {
    // TODO: wire to backend export endpoint
    const csv = [
      ['ID', 'Type', 'Direction', 'Lead/Contact', 'Message/Agenda', 'Timestamp', 'Status', 'Agent'],
      ...filtered.map((a) => [
        a.id, a.type, a.direction, a.leadName, `"${a.message}"`, a.timestamp, a.status, a.agent,
      ]),
    ]
      .map((r) => r.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `communication-timeline-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="call">Call</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Direction
            </label>
            <select
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Directions</option>
              <option value="outbound">Outbound</option>
              <option value="inbound">Inbound</option>
              <option value="internal">Internal</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Date Range
            </label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExport}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Activity Timeline</h3>
            <p className="text-sm text-gray-500">
              Chronological view of all communications &amp; their logged agendas
            </p>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
            {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-500 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading timeline from backend...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-red-500 gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No activities match the current filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((activity, index) => (
                <div key={activity.id} className="relative">
                  {/* Connector line */}
                  {index !== filtered.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-100" />
                  )}

                  <div className="flex gap-4 items-start">
                    {/* Icon bubble */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                      {TYPE_ICON[activity.type] ?? TYPE_ICON.chat}
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {activity.leadName}
                          </h4>
                          {activity.leadId && (
                            <span className="text-xs text-gray-400">
                              ({activity.leadId})
                            </span>
                          )}
                          <DirectionIcon direction={activity.direction} />
                          <span className="text-xs text-gray-400 capitalize">
                            {activity.type}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full capitalize ${
                            STATUS_BADGE[activity.status] ?? 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>

                      {/* Agenda / message */}
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        {activity.message}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-400 flex-wrap gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {activity.timestamp}
                        </span>
                        <span>By: {activity.agent}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationTimeline;
