// QualifiedLeadDetails.jsx
import React, { useState, useEffect } from 'react';
import {
  X, Phone, Mail, User, Calendar, TrendingUp,
  ArrowRight, AlertTriangle, CheckCircle2, Save
} from 'lucide-react';
import EligibilityMeter from './EligibilityMeter';
import DocumentChecklist from './DocumentChecklist';
import InterestProfileForm from './InterestProfileForm';

import leadService from '../../../services/leadService';

const QualifiedLeadDetails = ({ lead, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...lead });

  useEffect(() => {
    if (lead) {
      console.log('QualifiedLeadDetails: Syncing lead data', lead.id, lead.name);
      setFormData({ ...lead });
    }
  }, [lead]);

  const tabs = [
    { id: 'profile', label: 'Profile & Interest' },
    { id: 'documents', label: 'Documents' },
    { id: 'eligibility', label: 'Eligibility' }
  ];

  const handleSave = async () => {
    console.log('QualifiedLeadDetails: Initiating save', formData);
    try {
      const updated = await leadService.updateQualifiedLead(lead.pk || lead.id, formData);
      console.log('QualifiedLeadDetails: Save success', updated);
      onUpdate(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleMoveToHot = async () => {
    if (window.confirm('Move this lead to Hot Leads stage?')) {
      try {
        const updated = await leadService.moveToHot(lead.pk || lead.id);
        onUpdate(updated);
        onClose();
      } catch (error) {
        console.error("Error moving to hot:", error);
      }
    }
  };

  const handleMarkIneligible = async () => {
    if (window.confirm('Mark this lead as Ineligible?')) {
      try {
        const updated = await leadService.updateQualifiedLead(lead.pk || lead.id, {
          eligibilityStatus: 'ineligible'
        });
        onUpdate(updated);
      } catch (error) {
        console.error("Error marking ineligible:", error);
      }
    }
  };

  const handleScheduleFollowUp = async () => {
    const date = window.prompt('Enter follow-up date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (date) {
      try {
        const updated = await leadService.scheduleFollowUp(lead.pk || lead.id, {
          next_follow_up: date,
          next_action: 'follow_up'
        });
        alert(`Follow-up scheduled for ${date}`);
        onUpdate(updated);
      } catch (error) {
        console.error("Error scheduling follow-up:", error);
        alert('Failed to schedule follow-up');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Lead Details</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-white">{lead.name}</h4>
            <p className="text-xs text-indigo-100">{lead.id}</p>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{lead.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>Assigned to: <strong>{lead.assignedAgent}</strong></span>
        </div>
      </div>

      {/* Lead Score */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Lead Score</span>
          <span className="text-lg font-bold text-indigo-600">{lead.leadScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all"
            style={{ width: `${lead.leadScore}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Based on interest, documents, and eligibility
        </p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 border-b border-gray-200 flex gap-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${activeTab === tab.id
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-6 py-4 max-h-[calc(100vh-28rem)] overflow-y-auto">
        {activeTab === 'profile' && (
          <InterestProfileForm
            lead={formData}
            isEditing={isEditing}
            onChange={(field, value) => setFormData({ ...formData, [field]: value })}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentChecklist
            lead={formData}
            onChange={(docs) => setFormData({ ...formData, documentsCollected: docs })}
          />
        )}

        {activeTab === 'eligibility' && (
          <EligibilityMeter
            lead={formData}
            isEditing={isEditing}
            onChange={(status) => setFormData({ ...formData, eligibilityStatus: status })}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 border-t border-gray-200 space-y-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Edit Profile & Status
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({ ...lead });
              }}
              className="px-5 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        )}

        {(lead.eligibilityStatus === 'eligible' || lead.eligibilityStatus === 'under-review') && (
          <button
            onClick={handleMoveToHot}
            className="w-full px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Move to Hot Leads
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {lead.eligibilityStatus !== 'ineligible' && (
          <button
            onClick={handleMarkIneligible}
            className="w-full px-5 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Mark as Ineligible
          </button>
        )}

        <button
          onClick={handleScheduleFollowUp}
          className="w-full px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Schedule Follow-up
        </button>
      </div>
    </div>
  );
};

export default QualifiedLeadDetails;