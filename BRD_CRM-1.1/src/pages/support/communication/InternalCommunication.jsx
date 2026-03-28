// InternalCommunication.jsx
import React, { useState } from 'react';
import {
  Search, MessageSquare, Phone, Mail, Video,
  Users, Star, ChevronRight, Clock
} from 'lucide-react';
import AgendaModal from '../../../components/support/communication/AgendaModal';
import { createCommunication } from '../../../services/communicationService';

// ─── Dummy Data (replace with API call) ──────────────────────────────────────
const DUMMY_TEAM = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Team Lead',
    avatar: 'RK',
    email: 'rajesh.kumar@company.com',
    phone: '+919876501001',
    status: 'online',
    lastActivity: 'Reviewed loan applications',
    timestamp: '2 min ago',
    unread: 2,
    isPinned: true,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Sales Manager',
    avatar: 'PS',
    email: 'priya.sharma@company.com',
    phone: '+919876501002',
    status: 'away',
    lastActivity: 'Scheduled team meeting for 3 PM',
    timestamp: '15 min ago',
    unread: 0,
    isPinned: true,
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Agent',
    avatar: 'AP',
    email: 'amit.patel@company.com',
    phone: '+919876501003',
    status: 'online',
    lastActivity: 'Updated lead status',
    timestamp: '1 hour ago',
    unread: 0,
    isPinned: false,
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    role: 'Support Staff',
    avatar: 'SR',
    email: 'sneha.reddy@company.com',
    phone: '+919876501004',
    status: 'offline',
    lastActivity: 'Submitted daily report',
    timestamp: '3 hours ago',
    unread: 1,
    isPinned: false,
  },
  {
    id: 5,
    name: 'Karan Mehta',
    role: 'Agent',
    avatar: 'KM',
    email: 'karan.mehta@company.com',
    phone: '+919876501005',
    status: 'online',
    lastActivity: 'Closed 2 deals today',
    timestamp: '4 hours ago',
    unread: 0,
    isPinned: false,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_COLOR = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-400',
};

const STATUS_LABEL_STYLE = {
  online: 'text-green-600 bg-green-50',
  away: 'text-yellow-600 bg-yellow-50',
  offline: 'text-gray-500 bg-gray-100',
};

const buildRedirectUrl = (channel, member) => {
  switch (channel) {
    case 'whatsapp':
      return `https://wa.me/${member.phone.replace(/\D/g, '')}`;
    case 'email':
      return `mailto:${member.email}`;
    case 'call':
      return `tel:${member.phone.replace(/\s/g, '')}`;
    case 'video': {
      const code = Math.random().toString(36).substring(2, 9);
      return `https://meet.google.com/${code}`;
    }
    default:
      return '#';
  }
};

const ACTION_BUTTONS = [
  {
    channel: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageSquare,
    style: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    getDetail: (m) => m.phone,
    external: false,
  },
  {
    channel: 'email',
    label: 'Email',
    icon: Mail,
    style: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
    getDetail: (m) => m.email,
    external: false,
  },
  {
    channel: 'call',
    label: 'Call',
    icon: Phone,
    style: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    getDetail: (m) => m.phone,
    external: false,
  },
  {
    channel: 'video',
    label: 'Video Meet',
    icon: Video,
    style: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    getDetail: () => 'Open Google Meet',
    external: true,
  },
];

const MODE_MAP = {
  whatsapp: 'whatsapp',
  email: 'email',
  call: 'call',
  video: 'meet',
};

// ─── Main Component ───────────────────────────────────────────────────────────
const InternalCommunication = ({ onLogEntry }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState({ open: false, channel: null });

  const filtered = DUMMY_TEAM.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pinned = filtered.filter((m) => m.isPinned);
  const others = filtered.filter((m) => !m.isPinned);

  const openAgenda = (channel) => setModal({ open: true, channel });

  const handleAgendaConfirm = async (agenda) => {
    const { channel } = modal;
    const action = ACTION_BUTTONS.find((a) => a.channel === channel);
    const url = buildRedirectUrl(channel, selectedMember);

    let savedId = `INT-${Date.now()}`;
    try {
      const response = await createCommunication({
        conversation_type: 'internal',
        mode: MODE_MAP[channel] || channel,
        lead_id: String(selectedMember.id),
        subject: `${channel.charAt(0).toUpperCase() + channel.slice(1)} - ${selectedMember.name}`,
        message_content: agenda,
        direction: 'outbound',
        status: 'sent',
      });
      savedId = `INT-${response.data.id}`;
    } catch {
      // Keep UX flow smooth even if persistence fails.
    }

    const logEntry = {
      id: savedId,
      type: channel,
      direction: 'internal',
      leadId: null,
      leadName: selectedMember.name,
      message: agenda,
      timestamp: new Date().toLocaleString('en-IN'),
      status: 'initiated',
      agent: 'Current User', // Replace with auth context
    };

    if (onLogEntry) onLogEntry(logEntry);
    setModal({ open: false, channel: null });

    if (action?.external) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Left: Team List ── */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 h-[calc(100vh-300px)] flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {pinned.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-2 py-1 mb-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Pinned
                </span>
              </div>
              {pinned.map((m) => (
                <MemberItem
                  key={m.id}
                  member={m}
                  isSelected={selectedMember?.id === m.id}
                  onClick={() => setSelectedMember(m)}
                />
              ))}
            </div>
          )}

          <div className="p-2">
            {pinned.length > 0 && (
              <div className="px-2 py-1 mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  All Members
                </span>
              </div>
            )}
            {others.map((m) => (
              <MemberItem
                key={m.id}
                member={m}
                isSelected={selectedMember?.id === m.id}
                onClick={() => setSelectedMember(m)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
              <Users className="w-12 h-12 mb-2" />
              <p className="text-sm">No team members found</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Member Detail + Actions ── */}
      <div className="lg:col-span-2">
        {!selectedMember ? (
          <div className="bg-white rounded-2xl border border-gray-200 h-[calc(100vh-300px)] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a team member
              </h3>
              <p className="text-sm text-gray-500">
                Choose someone to view contact options
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Member Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-lg">
                    {selectedMember.avatar}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${STATUS_COLOR[selectedMember.status]}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {selectedMember.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_LABEL_STYLE[selectedMember.status]}`}
                    >
                      {selectedMember.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{selectedMember.role}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedMember.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedMember.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Reach Out</h4>
              <p className="text-xs text-gray-400 mb-4">
                Select a channel — you'll be asked to log the purpose before being redirected.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACTION_BUTTONS.map(({ channel, label, icon: Icon, style, getDetail }) => (
                  <button
                    key={channel}
                    onClick={() => openAgenda(channel)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition group ${style}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <div className="text-left">
                        <div className="text-sm font-medium">{label}</div>
                        <div className="text-xs opacity-70 truncate max-w-[160px]">
                          {getDetail(selectedMember)}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h4>
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{selectedMember.lastActivity}</span>
                <span className="ml-auto text-xs text-gray-400">{selectedMember.timestamp}</span>
              </div>
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
        contact={selectedMember}
      />
    </div>
  );
};

// ─── Member Item ──────────────────────────────────────────────────────────────
const MemberItem = ({ member, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-3 rounded-xl transition mb-1 text-left ${
      isSelected
        ? 'bg-indigo-50 border border-indigo-200'
        : 'hover:bg-gray-50 border border-transparent'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium text-sm">
          {member.avatar}
        </div>
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${STATUS_COLOR[member.status]}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-medium text-sm text-gray-900 truncate">{member.name}</span>
          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{member.timestamp}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 truncate">{member.role}</p>
          {member.unread > 0 && (
            <span className="ml-2 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
              {member.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  </button>
);

export default InternalCommunication;
