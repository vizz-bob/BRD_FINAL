// AssociatedContacts.jsx
import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Plus, ExternalLink, Search } from 'lucide-react';

const AssociatedContacts = ({ accountId }) => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    const mockContacts = [
      {
        id: 'CNT-001',
        fullName: 'Rajesh Kumar',
        mobile: '+91 98765 43210',
        email: 'rajesh.k@email.com',
        designation: 'Finance Manager',
        department: 'Finance',
        isPrimary: true,
        status: 'Active',
        lastActivity: '2025-01-27T10:30:00'
      },
      {
        id: 'CNT-004',
        fullName: 'Priya Sharma',
        mobile: '+91 98765 43213',
        email: 'priya.s@email.com',
        designation: 'HR Head',
        department: 'Human Resources',
        isPrimary: false,
        status: 'Active',
        lastActivity: '2025-01-25T14:20:00'
      },
      {
        id: 'CNT-005',
        fullName: 'Amit Patel',
        mobile: '+91 98765 43214',
        email: 'amit.p@email.com',
        designation: 'Purchase Manager',
        department: 'Operations',
        isPrimary: false,
        status: 'Active',
        lastActivity: '2025-01-20T09:15:00'
      },
      {
        id: 'CNT-006',
        fullName: 'Neha Gupta',
        mobile: '+91 98765 43215',
        email: 'neha.g@email.com',
        designation: 'Admin Executive',
        department: 'Administration',
        isPrimary: false,
        status: 'Active',
        lastActivity: '2025-01-18T11:00:00'
      },
      {
        id: 'CNT-007',
        fullName: 'Vikram Singh',
        mobile: '+91 98765 43216',
        email: 'vikram.s@email.com',
        designation: 'IT Manager',
        department: 'Information Technology',
        isPrimary: false,
        status: 'Dormant',
        lastActivity: '2024-12-10T16:30:00'
      }
    ];

    setTimeout(() => {
      setContacts(mockContacts);
      setLoading(false);
    }, 500);
  }, [accountId]);

  const filteredContacts = contacts.filter(contact =>
    contact.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.mobile.includes(searchQuery) ||
    contact.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCall = (mobile) => {
    console.log('Calling:', mobile);
    // Integration with dialer
  };

  const handleEmail = (email) => {
    console.log('Emailing:', email);
    // Open email composer
  };

  const handleViewContact = (contactId) => {
    console.log('Viewing contact:', contactId);
    // Navigate to contact details
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-700">
          Associated Contacts ({contacts.length})
        </h4>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs">
          <Plus className="w-3 h-3" />
          Link Contact
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">
            {searchQuery ? 'No contacts found' : 'No contacts associated'}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {searchQuery ? 'Try a different search' : 'Link contacts to this account'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-semibold text-sm">
                      {contact.fullName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-gray-900 text-sm">{contact.fullName}</h5>
                      {contact.isPrimary && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          Primary
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        contact.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {contact.designation} • {contact.department}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewContact(contact.id)}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                  title="View full contact"
                >
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-3 h-3" />
                  <span>{contact.mobile}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{contact.email}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleCall(contact.mobile)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-xs"
                >
                  <Phone className="w-3 h-3" />
                  Call
                </button>
                <button
                  onClick={() => handleEmail(contact.email)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-xs"
                >
                  <Mail className="w-3 h-3" />
                  Email
                </button>
              </div>

              {/* Last Activity */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last activity: {new Date(contact.lastActivity).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {contacts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">Active Contacts</p>
              <p className="text-lg font-bold text-green-700">
                {contacts.filter(c => c.status === 'Active').length}
              </p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">Dormant Contacts</p>
              <p className="text-lg font-bold text-red-700">
                {contacts.filter(c => c.status === 'Dormant').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssociatedContacts;