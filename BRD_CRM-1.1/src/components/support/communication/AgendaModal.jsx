// components/support/communication/AgendaModal.jsx
import React, { useState } from 'react';
import { X, ExternalLink, MessageSquare, Phone, Mail, Video } from 'lucide-react';

const CHANNEL_CONFIG = {
  whatsapp: {
    label: 'WhatsApp',
    icon: MessageSquare,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    btnClass: 'bg-green-600 hover:bg-green-700',
    placeholder: 'e.g. Follow up on home loan documents, discuss EMI options...',
  },
  email: {
    label: 'Email',
    icon: Mail,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    btnClass: 'bg-indigo-600 hover:bg-indigo-700',
    placeholder: 'e.g. Sending loan eligibility report, requesting KYC documents...',
  },
  call: {
    label: 'Phone Call',
    icon: Phone,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    btnClass: 'bg-blue-600 hover:bg-blue-700',
    placeholder: 'e.g. Follow-up call on pending application, clarify interest rates...',
  },
  video: {
    label: 'Video Meet',
    icon: Video,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    btnClass: 'bg-purple-600 hover:bg-purple-700',
    placeholder: 'e.g. Product demo, loan consultation, document walkthrough...',
  },
};

/**
 * AgendaModal
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onConfirm: (agenda: string) => void   — triggers redirect + logs entry
 *  - channel: 'whatsapp' | 'email' | 'call' | 'video'
 *  - contact: { name, phone, email }
 */
const AgendaModal = ({ isOpen, onClose, onConfirm, channel, contact }) => {
  const [agenda, setAgenda] = useState('');

  if (!isOpen || !channel) return null;

  const cfg = CHANNEL_CONFIG[channel];
  const Icon = cfg.icon;

  const handleConfirm = () => {
    if (!agenda.trim()) return;
    onConfirm(agenda.trim());
    setAgenda('');
  };

  const handleClose = () => {
    setAgenda('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className={`${cfg.bg} ${cfg.border} border-b px-5 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-white rounded-xl shadow-sm ${cfg.border} border`}>
              <Icon className={`w-5 h-5 ${cfg.color}`} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">
                {cfg.label} — Log Purpose
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                To: <span className="font-medium text-gray-700">{contact?.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-white/70 rounded-lg transition"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agenda / Purpose <span className="text-red-500">*</span>
          </label>
          <textarea
            autoFocus
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleConfirm();
            }}
            placeholder={cfg.placeholder}
            rows={4}
            className={`w-full px-4 py-3 bg-gray-50 rounded-xl border ${
              agenda.trim() ? 'border-gray-300 focus:ring-2 focus:ring-offset-0' : 'border-gray-200'
            } focus:outline-none text-sm resize-none text-gray-700 placeholder:text-gray-400`}
          />
          <p className="text-xs text-gray-400 mt-1.5">
            This will be recorded in the communication timeline. Press Ctrl+Enter to confirm.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!agenda.trim()}
            className={`px-5 py-2 text-sm text-white rounded-xl transition flex items-center gap-2 ${
              agenda.trim()
                ? `${cfg.btnClass}`
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            Continue to {cfg.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgendaModal;