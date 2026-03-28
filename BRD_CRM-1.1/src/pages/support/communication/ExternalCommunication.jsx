// ExternalCommunication.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, MessageSquare, Phone, Mail, Video,
  User, Clock, ChevronRight, Loader2, AlertCircle,
  RefreshCw
} from 'lucide-react';
import AgendaModal from '../../../components/support/communication/AgendaModal';
import {
  getLeads,
  ThirdPartyLeadService,
  CampaignLeadService,
  InternalLeadService,
  OnlineLeadService,
} from '../../../services/dataAndLeads.service';
import {
  createCommunication,
  getExternalCommunications,
} from '../../../services/communicationService';

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const getLeadStatus = (lead) => {
  // Map lead_status from backend to display status
  const s = (lead.lead_status || lead.status || '').toLowerCase();
  if (s === 'hot') return 'hot';
  if (s === 'qualified') return 'warm';
  return 'cold';
};

const STATUS_STYLE = {
  hot: 'bg-red-100 text-red-700',
  warm: 'bg-yellow-100 text-yellow-700',
  cold: 'bg-indigo-100 text-indigo-700',
};

const MODE_MAP = {
  whatsapp: 'whatsapp',
  email: 'email',
  call: 'call',
  video: 'meet',
};

const normalizeLeadId = (value) => String(value ?? '').trim();

const responseToList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const buildRedirectUrl = (channel, lead) => {
  switch (channel) {
    case 'whatsapp':
      return `https://wa.me/${(lead.phone || lead.contact_phone || '').replace(/\D/g, '')}`;
    case 'email':
      return `mailto:${lead.email || lead.contact_email || ''}`;
    case 'call':
      return `tel:${(lead.phone || lead.contact_phone || '').replace(/\s/g, '')}`;
    case 'video': {
      const code = Math.random().toString(36).substring(2, 9);
      return `https://meet.google.com/${code}`;
    }
    default:
      return '#';
  }
};

// Normalise a backend Lead object to the shape used in the UI
const normaliseLead = (lead, source = 'leads') => ({
  uiKey: `${source}-${String(lead.id)}`,
  id: String(lead.id),
  name: lead.name || lead.contact_name || 'â€”',
  phone: lead.phone || lead.contact_phone || 'â€”',
  email: lead.email || lead.contact_email || 'â€”',
  status: getLeadStatus(lead),
  lastContact: lead.updated_at
    ? new Date(lead.updated_at).toLocaleString('en-IN')
    : 'N/A',
  dealValue: lead.deal_value ? `â‚¹${Number(lead.deal_value).toLocaleString('en-IN')}` : 'â€”',
  unreadCount: 0,
  recentActivity: lead.product || lead.notes || 'No recent activity',
  leadStage: lead.lead_status || lead.status || 'Raw',
  assignedTo: lead.assigned_to || 'â€”',
  source,
  _raw: lead,
});

// â”€â”€â”€ Communication Action Buttons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ACTION_BUTTONS = [
  {
    channel: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageSquare,
    style: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
  },
  {
    channel: 'email',
    label: 'Email',
    icon: Mail,
    style: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
  },
  {
    channel: 'call',
    label: 'Call',
    icon: Phone,
    style: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  },
  {
    channel: 'video',
    label: 'Video Meet',
    icon: Video,
    style: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  },
];

const STATUS_BADGE = {
  sent: 'bg-indigo-100 text-indigo-700',
  read: 'bg-green-100 text-green-700',
  replied: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
  not_read: 'bg-yellow-100 text-yellow-700',
};

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ExternalCommunication = ({ onLogEntry }) => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Agenda modal state
  const [modal, setModal] = useState({ open: false, channel: null });
  const [saving, setSaving] = useState(false);

  // Leads list
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState(null);

  // Recent comms for selected lead
  const [allExternalComms, setAllExternalComms] = useState([]);
  const [commsLoading, setCommsLoading] = useState(false);

  const fetchExternalComms = useCallback(async () => {
    setCommsLoading(true);
    try {
      const res = await getExternalCommunications();
      const raw = Array.isArray(res.data)
        ? res.data
        : res.data.results ?? [];
      setAllExternalComms(raw);
    } catch {
      setAllExternalComms([]);
    } finally {
      setCommsLoading(false);
    }
  }, []);

  // â”€â”€ Fetch leads â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      const [coreLeads, thirdPartyLeads, campaignLeads, internalLeads, onlineLeads] =
        await Promise.allSettled([
          getLeads(),
          ThirdPartyLeadService.list(),
          CampaignLeadService.list(),
          InternalLeadService.list(),
          OnlineLeadService.list(),
        ]);

      const merged = [];

      if (coreLeads.status === 'fulfilled') {
        merged.push(...responseToList(coreLeads.value.data).map((row) => normaliseLead(row, 'leads')));
      }
      if (thirdPartyLeads.status === 'fulfilled') {
        merged.push(...responseToList(thirdPartyLeads.value.data).map((row) => normaliseLead(row, 'third-party')));
      }
      if (campaignLeads.status === 'fulfilled') {
        merged.push(...responseToList(campaignLeads.value.data).map((row) => normaliseLead(row, 'campaign')));
      }
      if (internalLeads.status === 'fulfilled') {
        merged.push(...responseToList(internalLeads.value.data).map((row) => normaliseLead(row, 'internal')));
      }
      if (onlineLeads.status === 'fulfilled') {
        merged.push(...responseToList(onlineLeads.value.data).map((row) => normaliseLead(row, 'online')));
      }

      // Keep one card per lead id + phone combination to avoid obvious duplicates.
      const seen = new Set();
      const deduped = merged.filter((lead) => {
        const key = `${normalizeLeadId(lead.id)}|${lead.phone}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setLeads(deduped);
    } catch (err) {
      setLeadsError('Failed to load leads. Please try again.');
    } finally {
      setLeadsLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // â”€â”€ Fetch all external communications on initial load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    fetchExternalComms();
  }, [fetchExternalComms]);

  const selectedLeadComms = selectedLead
    ? allExternalComms.filter(
        (row) => normalizeLeadId(row.lead_id) === normalizeLeadId(selectedLead.id)
      )
    : [];

  const usingFallbackForSelectedLead =
    !!selectedLead && selectedLeadComms.length === 0 && allExternalComms.length > 0;

  const recentComms = (selectedLead
    ? (selectedLeadComms.length > 0 ? selectedLeadComms : allExternalComms)
    : allExternalComms).slice(0, 10);

  // â”€â”€ Filter leads in UI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(q) ||
      lead.id.toLowerCase().includes(q);
    const matchesFilter =
      filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const openAgenda = (channel) => setModal({ open: true, channel });

  // Called when user confirms agenda â†’ save to backend + redirect
  const handleAgendaConfirm = async (agenda) => {
    const { channel } = modal;
    setSaving(true);
    setModal({ open: false, channel: null });

    const payload = {
      conversation_type: 'external',
      mode: MODE_MAP[channel] || channel,
      lead_id: selectedLead.id,
      subject: `${channel.charAt(0).toUpperCase() + channel.slice(1)} - ${selectedLead.name}`,
      message_content: agenda,
      direction: 'outbound',
      status: 'sent',
    };

    let savedId = `EXT-${Date.now()}`;
    try {
      const res = await createCommunication(payload);
      savedId = `EXT-${res.data.id}`;
    } catch {
      // proceed even if save fails â€” communication still happens
    } finally {
      setSaving(false);
    }

    // Build timeline log entry and bubble up to parent
    const logEntry = {
      id: savedId,
      type: channel,
      direction: 'outbound',
      leadId: selectedLead.id,
      leadName: selectedLead.name,
      message: agenda,
      timestamp: new Date().toLocaleString('en-IN'),
      status: 'initiated',
      agent: 'Current User',
    };
    if (onLogEntry) onLogEntry(logEntry);

    // Refresh recent comms
    fetchExternalComms();

    // Redirect
    const url = buildRedirectUrl(channel, selectedLead);
    if (channel === 'video') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* â”€â”€ Left: Leads List â”€â”€ */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 h-[calc(100vh-300px)] flex flex-col">
        {/* Search & Filter */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'hot', 'warm', 'cold'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition ${
                  filterStatus === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Leads */}
        <div className="flex-1 overflow-y-auto p-2">
          {leadsLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">Loading leadsâ€¦</p>
            </div>
          ) : leadsError ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12 px-4 text-center">
              <AlertCircle className="w-8 h-8 mb-2 text-red-400" />
              <p className="text-sm text-red-500 mb-3">{leadsError}</p>
              <button
                onClick={fetchLeads}
                className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
              <User className="w-12 h-12 mb-2" />
              <p className="text-sm">No leads found</p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <button
                key={lead.uiKey}
                onClick={() => setSelectedLead(lead)}
                className={`w-full p-3 rounded-xl transition mb-2 text-left ${
                  selectedLead?.id === lead.id
                    ? 'bg-indigo-50 border border-indigo-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 truncate">
                        {lead.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[lead.status]}`}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      ID: {lead.id} Â· {lead.leadStage}
                    </p>
                  </div>
                  {lead.unreadCount > 0 && (
                    <span className="bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {lead.unreadCount}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone className="w-3 h-3" />
                    <span className="truncate">{lead.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 truncate">{lead.recentActivity}</span>
                    <span className="text-gray-400 ml-2 whitespace-nowrap">
                      {lead.lastContact}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* â”€â”€ Right: Lead Detail + Actions â”€â”€ */}
      <div className="lg:col-span-2">
        {!selectedLead ? (
          <div className="bg-white rounded-2xl border border-gray-200 h-[calc(100vh-300px)] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a lead</h3>
              <p className="text-sm text-gray-500">Choose a lead to view contact options</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Lead Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-lg flex-shrink-0">
                  {selectedLead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-lg">{selectedLead.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[selectedLead.status]}`}
                    >
                      {selectedLead.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    ID: {selectedLead.id} Â· {selectedLead.leadStage} Â· Assigned to{' '}
                    {selectedLead.assignedTo}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedLead.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedLead.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Last contact: {selectedLead.lastContact}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-semibold text-gray-900">
                    {selectedLead.dealValue}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">Deal Value</div>
                </div>
              </div>
            </div>

            {/* Contact Action Buttons */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Reach Out</h4>
              <p className="text-xs text-gray-400 mb-4">
                Select a channel â€” you'll be asked to log the purpose before being redirected.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACTION_BUTTONS.map(({ channel, label, icon: Icon, style }) => (
                  <button
                    key={channel}
                    onClick={() => openAgenda(channel)}
                    disabled={saving}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition group ${style} disabled:opacity-60`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <div className="text-left">
                        <div className="text-sm font-medium">{label}</div>
                        <div className="text-xs opacity-70">
                          {channel === 'whatsapp' && selectedLead.phone}
                          {channel === 'email' && selectedLead.email}
                          {channel === 'call' && selectedLead.phone}
                          {channel === 'video' && 'Generate & share link'}
                        </div>
                      </div>
                    </div>
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Communications from Backend */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Recent Communications
              </h4>
              <p className="text-xs text-gray-400 mb-3">
                {selectedLead
                  ? (usingFallbackForSelectedLead
                    ? `No exact lead_id match for ${selectedLead.name}; showing latest external records`
                    : `Showing external records for ${selectedLead.name}`)
                  : 'Showing latest external records from backend'}
              </p>
              {commsLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loadingâ€¦
                </div>
              ) : recentComms.length === 0 ? (
                <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>
                    {selectedLead
                      ? 'No external communications recorded for this lead.'
                      : 'No external communications found in backend yet.'}
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentComms.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-start gap-3 text-sm bg-gray-50 rounded-xl px-4 py-3"
                    >
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-700 capitalize">{c.mode}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[c.status] || 'bg-gray-100 text-gray-600'}`}
                          >
                            {c.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {c.subject || c.message_content}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {c.timestamp
                          ? new Date(c.timestamp).toLocaleString('en-IN', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })
                          : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Agenda Modal */}
      <AgendaModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, channel: null })}
        onConfirm={handleAgendaConfirm}
        channel={modal.channel}
        contact={selectedLead}
      />
    </div>
  );
};

export default ExternalCommunication;

