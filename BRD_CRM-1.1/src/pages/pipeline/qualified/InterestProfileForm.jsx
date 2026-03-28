// InterestProfileForm.jsx
import React from 'react';
import {
  Target, Calendar, User, Phone, Mail,
  MapPin, DollarSign, MessageSquare
} from 'lucide-react';
import { INTEREST_AREAS, NEXT_ACTIONS } from '../../../utils/constants';

const InterestProfileForm = ({ lead, isEditing, onChange }) => {
  const formFields = [
    {
      id: 'interestArea',
      label: 'Interest Area / Product',
      icon: Target,
      type: 'select',
      options: INTEREST_AREAS,
      required: true
    },
    {
      id: 'loanAmount',
      label: 'Expected Loan Amount',
      icon: DollarSign,
      type: 'number',
      placeholder: 'Enter amount in INR',
      required: false
    },
    {
      id: 'nextFollowUp',
      label: 'Next Follow-up Date',
      icon: Calendar,
      type: 'date',
      required: true
    },
    {
      id: 'nextAction',
      label: 'Next Action',
      icon: MessageSquare,
      type: 'select',
      options: NEXT_ACTIONS,
      required: true
    }
  ];

  const contactFields = [
    {
      id: 'name',
      label: 'Lead Name',
      icon: User,
      type: 'text',
      disabled: !isEditing
    },
    {
      id: 'phone',
      label: 'Phone Number',
      icon: Phone,
      type: 'tel',
      disabled: !isEditing
    },
    {
      id: 'email',
      label: 'Email Address',
      icon: Mail,
      type: 'email',
      disabled: !isEditing
    },
    {
      id: 'city',
      label: 'City',
      icon: MapPin,
      type: 'text',
      disabled: !isEditing
    }
  ];

  const renderField = (field) => {
    const Icon = field.icon;
    const value = lead[field.id] || '';

    return (
      <div key={field.id} className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Icon className="w-4 h-4 text-gray-500" />
          {field.label}
          {field.required && <span className="text-red-600">*</span>}
        </label>

        {field.type === 'select' ? (
          <select
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            disabled={field.disabled || !isEditing}
            className={`w-full px-4 py-3 rounded-xl border transition ${field.disabled || !isEditing
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-gray-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              }`}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            disabled={field.disabled || !isEditing}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border transition resize-none ${field.disabled || !isEditing
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-gray-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              }`}
          />
        ) : (
          <input
            type={field.type}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            disabled={field.disabled || !isEditing}
            placeholder={field.placeholder}
            className={`w-full px-4 py-3 rounded-xl border transition ${field.disabled || !isEditing
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-gray-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              }`}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
        <div className="space-y-4">
          {contactFields.map(renderField)}
        </div>
      </div>

      {/* Interest & Requirements */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Interest & Requirements</h4>
        <div className="space-y-4">
          {formFields.map(renderField)}
        </div>
      </div>

      {/* Qualification Notes */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <MessageSquare className="w-4 h-4 text-gray-500" />
          Qualification Notes
        </label>
        <textarea
          value={lead.qualificationNotes || ''}
          onChange={(e) => onChange('qualificationNotes', e.target.value)}
          disabled={!isEditing}
          placeholder="Add detailed assessment notes, eligibility remarks, or any important observations..."
          rows={6}
          className={`w-full px-4 py-3 rounded-xl border transition resize-none ${!isEditing
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-gray-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            }`}
        />
        <p className="text-xs text-gray-500 mt-2">
          Document your assessment, eligibility check results, and conversation summary
        </p>
      </div>

      {/* Lead Timeline */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h5 className="font-medium text-gray-900 mb-3">Recent Activity</h5>
        <div className="space-y-3">
          {lead.contacts && lead.contacts.length > 0 ? (
            lead.contacts.slice(0, 5).map((contact, idx) => (
              <div key={idx} className="flex gap-3">
                <div className={`w-2 h-2 ${idx === 0 ? 'bg-indigo-600' : 'bg-gray-400'} rounded-full mt-2`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="capitalize">{contact.status.toLowerCase().replace(/_/g, ' ')}</span> • {contact.interestArea?.replace(/-/g, ' ').toUpperCase() || 'General Inquiry'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(contact.created_at).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  {contact.qualificationNotes && (
                    <p className="text-[11px] text-gray-600 mt-1 bg-white p-2 rounded border border-gray-100 italic">
                      "{contact.qualificationNotes}"
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-gray-400 italic">No recorded activity history</p>
            </div>
          )}
        </div>
      </div>

      {/* Agent Assignment */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Assigned Agent</p>
            <p className="font-semibold text-gray-900 mt-1">{lead.assignedAgent}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
            {lead.assignedAgent?.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestProfileForm;