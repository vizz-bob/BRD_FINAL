// ContactDetails.jsx
import React, { useState } from 'react';
import { 
  X, Phone, Mail, MapPin, Calendar, User, 
  Building2, Tag, Clock, Edit, Trash2,
  MessageSquare, Video, TrendingUp
} from 'lucide-react';
import ContactTimeline from './ContactTimeline';
import NotesSection from './NotesSection';
import TasksSection from './TasksSection';
import MeetingsSection from './MeetingsSection';

const ContactDetails = ({ contact, onClose, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('timeline');

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'tasks', label: 'Tasks', icon: TrendingUp },
    { id: 'meetings', label: 'Meetings', icon: Calendar }
  ];

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-red-100 text-red-600';
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const name = contact.fullName || contact.full_name || '';
  const id = contact.id || contact.pk || '';
  const mobile = contact.mobile || contact.mobile_number || '';
  const email = contact.email || '';
  const accountName = contact.accountName || contact.account_name || '';
  const address = contact.address || '';
  const gender = contact.gender || '';
  const dob = contact.dob || contact.date_of_birth || null;
  const status = contact.status || 'Unknown';
  const tags = Array.isArray(contact.tags)
    ? contact.tags
    : (contact.tags ? String(contact.tags).split(',').map(t => t.trim()).filter(Boolean) : []);
  const source = contact.source || '';
  const assignedTo = contact.assignedTo || contact.assigned_to || '';
  const createdBy = contact.createdBy || contact.created_by || '';
  const lastActivity = contact.lastActivity || contact.last_activity || null;
  const createdAt = contact.createdAt || contact.created_at || null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">
                {name.charAt(0) || '-'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="text-indigo-100 text-sm">{id}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          <button className="flex flex-col items-center gap-1 p-3 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition">
            <Phone className="w-5 h-5" />
            <span className="text-xs">Call</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition">
            <Mail className="w-5 h-5" />
            <span className="text-xs">Email</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">Chat</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition">
            <Video className="w-5 h-5" />
            <span className="text-xs">Meet</span>
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 border-b border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{mobile}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{email}</span>
          </div>

          {accountName && (
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{accountName}</span>
            </div>
          )}

          {address && (
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <span className="text-gray-900">{address}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">
              {gender}
              {dob && ` • ${calculateAge(dob)} years`}
            </span>
          </div>

          {dob && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">
                {new Date(dob).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>

        {contact.notes && (
          <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            {contact.notes}
          </div>
        )}

        {/* Tags and Status */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
          {tags.map((tag, idx) => (
            <span key={idx} className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Source</p>
            <p className="text-sm font-medium text-gray-900">{source}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Assigned To</p>
            <p className="text-sm font-medium text-gray-900">{assignedTo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Created By</p>
            <p className="text-sm font-medium text-gray-900">{createdBy}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Last Activity</p>
            <p className="text-sm font-medium text-gray-900">
              {lastActivity ? new Date(lastActivity).toLocaleDateString() : '-'}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Created On</p>
            <p className="text-sm font-medium text-gray-900">
              {createdAt ? new Date(createdAt).toLocaleDateString() : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'timeline' && <ContactTimeline contactId={id} />}
        {activeTab === 'notes' && <NotesSection entityId={id} entityType="contact" />}
        {activeTab === 'tasks' && <TasksSection entityId={id} entityType="contact" />}
        {activeTab === 'meetings' && <MeetingsSection entityId={id} entityType="contact" />}
      </div>
    </div>
  );
};

export default ContactDetails;