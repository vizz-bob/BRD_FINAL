import React, { useState, useEffect } from 'react';
import {
  Ticket, Clock, AlertCircle, CheckCircle,
  Filter, Plus, Search, TrendingUp, Users,
  XCircle, RefreshCw, Send
} from 'lucide-react';
import { createtickets, gettickets, updatetickets } from '../../../services/supportService';

// ==================== CONSTANTS ====================
const TICKET_PRIORITIES = {
  LOW: { label: 'Low', color: 'gray', slaHours: 48 },
  MEDIUM: { label: 'Medium', color: 'yellow', slaHours: 24 },
  HIGH: { label: 'High', color: 'orange', slaHours: 8 },
  CRITICAL: { label: 'Critical', color: 'red', slaHours: 2 }
};

const TICKET_CATEGORIES = [
  'Technical',
  'Document',
  'KYC',
  'Disbursement',
  'Portal Access',
  'Others'
];

const TICKET_STATUSES = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  ON_HOLD: "on_hold",
  ESCALATED: "escalated",
  CLOSED: "closed"
};


// ==================== SLA CALCULATIONS ====================
const calculateSLAExpiry = (createdAt, priorityHours) => {
  const created = new Date(createdAt);
  const expiry = new Date(created.getTime() + priorityHours * 60 * 60 * 1000);
  return expiry;
};

const getSLATimeRemaining = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry - now;

  if (diff <= 0) return { expired: true, text: 'SLA Overdue', hours: 0, minutes: 0 };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return {
    expired: false,
    hours,
    minutes,
    text: `${hours}h ${minutes}m left`
  };
};

// ==================== COMPONENTS ====================

const PriorityBadge = ({ priority }) => {
  const config = TICKET_PRIORITIES[priority];
  const colorMap = {
    gray: 'bg-gray-100 text-gray-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[config?.color]}`}>
      {config?.label}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const colorMap = {
    'open': 'bg-indigo-100 text-indigo-700',
    'In Progress': 'bg-indigo-100 text-indigo-700',
    'On Hold': 'bg-yellow-100 text-yellow-700',
    'Escalated': 'bg-red-100 text-red-700',
    'Closed': 'bg-green-100 text-green-700'
  };

  return (
    <span className={`px-3 py-1 rounded-xl text-xs font-medium ${colorMap[status]}`}>
      {status}
    </span>
  );
};

const SLATimer = ({ expiryDate }) => {
  const [timeRemaining, setTimeRemaining] = useState(getSLATimeRemaining(expiryDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getSLATimeRemaining(expiryDate));
    }, 60000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  if (timeRemaining.expired) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">{timeRemaining.text}</span>
      </div>
    );
  }

  const isUrgent = timeRemaining.hours < 2;

  return (
    <div className={`flex items-center gap-2 ${isUrgent ? 'text-orange-600' : 'text-gray-600'}`}>
      <Clock className="w-4 h-4" />
      <span className="text-sm font-medium">{timeRemaining.text}</span>
    </div>
  );
};

const SUB_CATEGORIES = {
  Technical: ['Login Issue', 'Bug', 'Performance'],
  Document: ['Upload Failed', 'Incorrect Document'],
  KYC: ['Rejected', 'Pending', 'Mismatch'],
  Disbursement: ['Delay', 'Amount Mismatch'],
  'Portal Access': ['Access Denied', 'Role Issue'],
  Others: ['General']
};


const CreateTicketModal = ({ isOpen, onClose, onSubmit }) => {
  // const [formData, setFormData] = useState({
  //   title: '',
  //   description: '',
  //   priority: 'MEDIUM',
  //   category: 'Technical'
  // });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: 'Technical',
    subCategory: '',
    ticketType: 'Query',
    assignedTo: '',
    customerRef: null,
    attachments: []
  });


  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
      category: 'Technical'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create New Ticket</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <XCircle className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Detailed information about the issue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(TICKET_PRIORITIES).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                {TICKET_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-category *
              </label>
              <select
                value={formData.subCategory}
                onChange={(e) =>
                  setFormData({ ...formData, subCategory: e.target.value })
                }
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl"
              >
                <option value="">Select Sub-category</option>
                {(SUB_CATEGORIES[formData.category] || []).map(sc => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Type *
              </label>
              <select
                value={formData.ticketType}
                onChange={(e) =>
                  setFormData({ ...formData, ticketType: e.target.value })
                }
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl"
              >
                <option value="Complaint">Complaint</option>
                <option value="Request">Request</option>
                <option value="Query">Query</option>
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To *
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl"
              >
                <option value="">Select</option>
                <option value="Support Team">Support Team</option>
                <option value="IT Support">IT Support</option>
                <option value="Ops Team">Ops Team</option>
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer / Lead Reference
              </label>
              <input
                type="text"
                placeholder="Customer ID / Lead ID"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl"
                onChange={(e) =>
                  setFormData({ ...formData, customerRef: e.target.value })
                }
              />
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Optional)
            </label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setFormData({ ...formData, attachments: [...e.target.files] })
              }
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-indigo-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              Create Ticket
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TicketDetailsModal = ({ ticket, isOpen, onClose, onUpdate }) => {
  const [comment, setComment] = useState('');
  const [newStatus, setNewStatus] = useState(ticket?.status || 'open');

  if (!isOpen || !ticket) return null;

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const updatedTicket = {
      ...ticket,
      comments: [
        ...(ticket.comments || []),
        {
          id: Date.now(),
          text: comment,
          author: 'Current User',
          timestamp: new Date().toISOString()
        }
      ]
    };

    onUpdate(updatedTicket);
    setComment('');
  };

  const handleStatusUpdate = () => {
    onUpdate({ ...ticket, status: newStatus });
  };

  // useEffect(() => {
  //   if (ticket) {
  //     setNewStatus(ticket.status);
  //   }
  // }, [ticket]);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{ticket.title}</h2>
            <p className="text-sm text-gray-500 mt-1">Ticket #{ticket.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <XCircle className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
            <div>
              <p className="text-xs text-gray-500">Ticket ID</p>
              <p className="font-medium text-gray-900">{ticket.id}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Status</p>
              <StatusBadge status={ticket.status} />
            </div>

            <div>
              <p className="text-xs text-gray-500">Priority</p>
              <PriorityBadge priority={ticket.priority} />
            </div>

            <div>
              <p className="text-xs text-gray-500">Category</p>
              <p className="text-sm font-medium">{ticket.category}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Sub-category</p>
              <p className="text-sm font-medium">
                {ticket.sub_category || '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Ticket Type</p>
              <p className="text-sm font-medium">{ticket.ticket_type || '—'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Assigned To</p>
              <p className="text-sm font-medium">{ticket.assigned_to || '—'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Created By</p>
              <p className="text-sm font-medium">{ticket.createdBy}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Created At</p>
              <p className="text-sm font-medium">
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Customer / Lead</p>
              <p className="text-sm font-medium">
                {ticket.customerRef || '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">SLA</p>
              <SLATimer expiryDate={ticket.slaExpiry} />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <StatusBadge status={ticket.status} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Priority:</span>
              <PriorityBadge priority={ticket.priority} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">SLA:</span>
              <SLATimer expiryDate={ticket.slaExpiry} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{ticket.description}</p>
          </div>


          {ticket.attachments?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Attachments</h3>

              <div className="flex flex-wrap gap-3">
                {ticket.attachments.map((file, idx) => {
                  const fileUrl = URL.createObjectURL(file);

                  return (
                    <a
                      key={idx}
                      href={fileUrl}
                      download={file.name}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm text-indigo-600 hover:bg-gray-200 transition"
                    >
                      {file.name}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-indigo-50 p-4 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
            <div className="flex gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex-1 p-3 bg-white border border-gray-300 rounded-xl"
              >
                {Object.values(TICKET_STATUSES).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Communication Thread</h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {(ticket.comments || []).map(c => (
                <div key={c.id} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{c.author}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(c.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddComment}
                className="px-5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SupportTicketingDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);


  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const stats = [
    {
      label: 'Total Tickets',
      value: tickets.length,
      icon: Ticket,
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      label: 'Open',
      value: tickets.filter(t => t.status === 'open').length,
      icon: AlertCircle,
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      label: 'In Progress',
      value: tickets.filter(t => t.status === 'In Progress').length,
      icon: RefreshCw,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      label: 'SLA Overdue',
      value: tickets.filter(t => getSLATimeRemaining(t.slaExpiry).expired).length,
      icon: Clock,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    }
  ];
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await gettickets();
      const backendTickets = response.data;

      // Transform backend data if necessary
      const formattedTickets = backendTickets.map(ticket => ({
        ...ticket,
        slaExpiry: calculateSLAExpiry(
          ticket.created_at,
          TICKET_PRIORITIES[ticket.priority]?.slaHours || 24
        )
      }));

      setTickets(formattedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    if (filterPriority !== 'ALL') {
      filtered = filtered.filter(t => t.priority === filterPriority);
    }

    setFilteredTickets(filtered);
  }, [searchTerm, filterStatus, filterPriority, tickets]);

  // const handleCreateTicket = (formData) => {
  //   const newTicket = {
  //     id: `SUP-${String(tickets.length + 1).padStart(3, '0')}`,
  //     ...formData,
  //     status: 'Open',
  //     assignedTo: 'Support Team',
  //     createdAt: new Date().toISOString(),
  //     slaExpiry: calculateSLAExpiry(new Date(), TICKET_PRIORITIES[formData.priority].slaHours),
  //     comments: []
  //   };

  //   setTickets([newTicket, ...tickets]);
  //   setShowCreateModal(false);
  // };



  const handleCreateTicket = async (formData) => {
    try {
      if (
        !formData.title ||
        !formData.description ||
        !formData.subCategory ||
        !formData.assignedTo ||
        !formData.customerRef
      ) {
        alert("All required fields must be filled");
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,

        // Convert to backend expected format
        priority: TICKET_PRIORITIES[formData.priority].label, // "Medium" not "MEDIUM"

        category: formData.category,
        sub_category: formData.subCategory,
        ticket_type: formData.ticketType,
        assigned_to: formData.assignedTo,

        customer_id: formData.customerRef, // FIXED NAME
        status: "open" // REQUIRED
      };

      await createtickets(payload);

      setShowCreateModal(false);
      fetchTickets();

    } catch (error) {
      console.error("Error creating ticket:", error.response?.data || error);
    }
  };




  const handleUpdateTicket = (updatedTicket) => {
    setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    try{
      const res = updatetickets(updatedTicket.id, {
        title: updatedTicket.title,
        description: updatedTicket.description,
        priority: TICKET_PRIORITIES[updatedTicket.priority]?.label,
        category: updatedTicket.category,
        sub_category: updatedTicket.subCategory,
        ticket_type: updatedTicket.ticketType,
        assigned_to: updatedTicket.assignedTo,
        customer_id: updatedTicket.customerRef,
        status: updatedTicket.status
      });
      console.log("Update response:", res.data);
    }
    catch(error){
      console.error("Error updating ticket:", error.response?.data || error);
    }
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-2xl">
                <Ticket className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                  Support Ticketing & SLA
                </h1>
                <p className="text-sm text-gray-500">
                  Track and manage support requests with SLA monitoring
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Ticket</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow">

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-4 ${stat.bgColor} rounded-xl`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
            >
              <option value="ALL">All Status</option>
              {Object.values(TICKET_STATUSES).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
            >
              <option value="ALL">All Priority</option>
              {Object.keys(TICKET_PRIORITIES).map(priority => (
                <option key={priority} value={priority}>
                  {TICKET_PRIORITIES[priority].label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SLA</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => {
                  const slaStatus = getSLATimeRemaining(ticket.slaExpiry);

                  return (
                    <tr
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket)}
                      className={`${slaStatus.expired ? 'bg-red-50' : ''} hover:bg-gray-50 cursor-pointer`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-indigo-600">{ticket.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{ticket.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{ticket.assignedTo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <SLATimer expiryDate={ticket.slaExpiry} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tickets found</p>
            </div>
          )}
        </div>
      </div>

      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTicket}
      />

      <TicketDetailsModal
        ticket={selectedTicket}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onUpdate={handleUpdateTicket}
      />
    </div>
  );
};

export default SupportTicketingDashboard;